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
import { UserIdentityInstance } from 'lib/models/auth/userIdentity';
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


async function matchClientCreatorRole(db: Session, key: ApiKeyInstance): Promise<boolean> {
	const matches = await key.findRelationships({
		alias: 'ClientCreatorRole',
        session: db,
		limit: 1
	});
	debug("Client creator matches: ", matches);
	return matches.length >= 1;
}

async function matchDataExporterRole(db: Session, models: allModels, key: ApiKeyInstance, source: string)
: Promise<boolean> {
	const matches = await key.findRelationships({
		alias: 'DataExporterRole',
        session: db,
	});
	return findOne(matches, async (m) => {
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

async function matchClientReaderRole(db: Session, models: allModels,
					user: UserIdentityInstance, clientId: string): Promise<boolean> {
	const matches = await user.findRelationships({
		alias: 'ClientReaderRole',
		where: {
			target: {},
			relationship: {
				name: 'Has'
			}
		},
		session: db
	});
	return findOne(matches, async(m) => {
		const clients = await m.target.findRelationships({
			alias: 'User',
			where: {
				target: {
					uid: clientId,
				},
				relationship: {}
			},
			session: db,
			limit: 1,
		});
		return clients.length == 1;
	}) != null;
}


export type AuthResult = DatabaseProcedure<boolean>;
export type AuthMethod = (req: Request, auth: BinaryLike) => AuthResult;


export const authMethods: AuthMethod[] = [
    // KEY AUTHENTICATION
    (req: Request, auth: BinaryLike) => async (db: Session, models: allModels) => {
		const key: ApiKeyInstance = await models.auth.apiKey.findOne({
			where: {
				hash: basicHash(auth),
			},
			session: db
		});
		if (!(key?.__existsInDatabase)) {
			return false;
		}
		switch (req.method) {
			case 'POST':
				switch (req.path) {
					case '/client':
						return await matchClientCreatorRole(db, key);
					case '/measurement':
						return await matchDataExporterRole(db, models,
										key, req.body['source']);
					break;
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
        const id = await getRemoteId(auth);
        if (!id) {
            return false;
        }
        const user: UserIdentityInstance = await models.auth.userIdentity.findOne({
            where: {
                uid: id,
            },
            session: db
        });
        if (!user) {
            return false;
        }
		debug("Base url: ", req.baseUrl);
		switch (req.method) {
			case 'GET':
				switch (req.baseUrl) {
					case '/client':
						return matchClientReaderRole(db, models,
									user, req.params.clientId);
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
