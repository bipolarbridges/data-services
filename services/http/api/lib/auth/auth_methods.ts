import { readFileSync } from 'fs';
import { join } from 'path';
import { info, debug } from '../logging';
import { BinaryLike, createHash } from 'crypto';
import axios, { AxiosInstance, AxiosRequestConfig }  from 'axios';
import {InternalError} from '../errors';
import path from 'path';
import { Request } from 'express';
import { Session } from 'neo4j-driver-core';
import { allModels } from 'lib/models';
import { DatabaseProcedure } from 'lib/db';
import { ApiKeyInstance } from 'lib/models/auth/apiKey';
import { ServiceUserInstance } from 'lib/models/auth/serviceUser';
import { findOne } from '../util/misc';

const __dirname = path.resolve();

class AuthError extends InternalError {
    constructor(error: string) {
        super(error);
    }
}

function basicHash(sec: BinaryLike): string {
    return createHash('sha256')
        .update(sec).digest('hex');
}

type Configuration = {
    [key: string]: {
        protocol: string,
        addr: string,
        port: string
    }
};

const configFile: Configuration = JSON.parse(readFileSync(join(__dirname, 'lib/auth', 'config.json'), 'utf8'));
const config = configFile['auth_server'];
info('Config: ', config);

const axiosConfig: AxiosRequestConfig = {
    baseURL: `${config.protocol}://${config.addr}:${config.port}`,
};
const remote: AxiosInstance = axios.create(axiosConfig)

async function getRemoteId(token: BinaryLike) {
    try {
        const res = await remote.post('/validate', { token }, {
            headers: {
                "Content-Type": "application/json"
            }
        });
        if (res.status != 200) {
            throw new Error("Wrong status code response from remote auth");
        } else if (!res.data['result']) {
            return null;
        } else {
            if (!res.data['id']) {
                throw new Error("No id from remote auth");
            } else {
                return res.data['id']
            }
        }
    } catch (e) {
        throw new AuthError(e);
    }
}

async function matchAppUserCreatorRole(db: Session, key: ApiKeyInstance): Promise<boolean> {
	debug("Finding appUser creator role");
	const matches = await key.findRelationships({
		alias: 'AppUserCreatorRole',
        session: db,
		limit: 1
	});
	debug("AppUser creator matches: ", matches);
	return matches.length >= 1;
}

async function matchDataExporterRole(db: Session, models: allModels, key: ApiKeyInstance, source: string)
: Promise<boolean> {
	const matches = await key.findRelationships({
		alias: 'DataExporterRole',
        session: db,
	});
	return await findOne(matches, async (m) => {
		const sources = await m.target.findRelationships({
			alias: 'Source',
			where: {
				target: {
					name: source
				},
				relationship: {},
			},
			session: db,
			limit: 1
		});
		return sources.length == 1;
	}) != null;
}

async function matchAppUserReaderRole(db: Session, models: allModels,
					appUser: ServiceUserInstance, appUserId: string): Promise<boolean> {
	const matches = await appUser.findRelationships({
		alias: 'AppUserReaderRole',
		where: {
			target: {},
			relationship: {}
		},
		session: db
	});
	debug(`AppUser ID: ${appUserId}`);
	return await findOne(matches, async(m) => {
		const appUsers = await m.target.findRelationships({
			alias: 'AppUser',
			where: {
				target: {
					uid: appUserId,
				},
				relationship: {}
			},
			session: db,
			limit: 1,
		});
		return appUsers.length == 1;
	}) != null;
}


export type AuthResult = DatabaseProcedure<boolean>;
export type AuthMethod = (req: Request, auth: BinaryLike) => AuthResult;


export const authMethods: AuthMethod[] = [
    // KEY AUTHENTICATION
    (req: Request, auth: BinaryLike) => async (db: Session, models: allModels) => {
		debug("Key auth");
		const key: ApiKeyInstance = await models.auth.apiKey.findOne({
			where: {
				hash: basicHash(auth),
			},
			session: db
		});
		if (!(key?.__existsInDatabase)) {
			debug("Key DNE");
			return false;
		}
		debug(`method: ${req.method}`);
		switch (req.method) {
			case 'POST':
				switch (req.baseUrl) {
					case '/appUser':
						return await matchAppUserCreatorRole(db, key);
					case '/measurement':
						if (!req.body['data'] || !req.body['data']['source']) {
							return false;
						}
						return await matchDataExporterRole(db, models,
										key, req.body['data']['source']);
					default:
						return false;
				}
			break;
			default:
				return false;
		}
    },
        // USER AUTHENTICATION
    (req: Request, auth: BinaryLike) => async (db: Session, models: allModels) => {
		debug("User auth");
        const id = await getRemoteId(auth);
        if (!id) {
            return false;
        }
        const user: ServiceUserInstance = await models.auth.serviceUser.findOne({
            where: {
                uid: id,
            },
            session: db
        });
        if (!user) {
            return false;
        }
	info(`Authenticated as user with id '${id}'`);
		debug(`Base url: ${req.baseUrl}`);
		switch (req.method) {
			case 'GET':
				debug(req.params);
				switch (req.baseUrl) {
					case '/appUser':
						return await matchAppUserReaderRole(db, models,
									user, req.params.appUserId);
					break;
					default:
						return false;
				}	
			break;
			default:
				return false;
		}			
    }
];
