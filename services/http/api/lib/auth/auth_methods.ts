import { readFileSync } from 'fs';
import path, { join } from 'path';
import { BinaryLike, createHash } from 'crypto';
import axios, { AxiosInstance, AxiosRequestConfig } from 'axios';

import { Request } from 'express';
import { Session } from 'neo4j-driver-core';
import { DatabaseProcedure } from 'lib/db';
import { info } from 'console';
import { AllModels } from 'lib/models';
import { InternalError } from '../errors';

/* eslint-disable @typescript-eslint/naming-convention */
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
const config = configFile.auth_server;
info('Config: ', config);

const axiosConfig: AxiosRequestConfig = {
  baseURL: `${config.protocol}://${config.addr}:${config.port}`,
};
const remote: AxiosInstance = axios.create(axiosConfig);

async function getRemoteId(token: BinaryLike) {
  try {
    const res = await remote.post('/validate', { token }, {
      headers: {
        'Content-Type': 'application/json',
      },
    });
    if (res.status !== 200) {
      throw new Error('Wrong status code response from remote auth');
    } else if (!res.data.result) {
      return null;
    } else if (!res.data.id) {
      throw new Error('No id from remote auth');
    } else {
      return res.data.id;
    }
  } catch (e) {
    throw new AuthError(e);
  }
}

export type AuthResult = DatabaseProcedure<boolean>;
export type AuthMethod = (req: Request, auth: BinaryLike) => AuthResult;

export const authMethods: AuthMethod[] = [
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  (req: Request, auth: BinaryLike) => async (db: Session, models: AllModels) => {
    // KEY AUTHENTICATION
    const results = await db.run(
      "MATCH (i:Identity{type: 'key', check: $check}) "
            + 'MATCH (r:Resource{path: $path}) '
            + 'MATCH (i)-[c:Can{method: $method}]->(r)'
            + 'RETURN i,r,c;',
      {
        check: basicHash(auth),
        path: req.path,
        method: req.method,
      },
    );
    return results.records.length > 0;
  },
  (req: Request, auth: BinaryLike) => async (db: Session) => {
    const id = await getRemoteId(auth);
    if (!id) {
      return false;
    }
    info('Authenticated: ', id);
    const results = await db.run(
      'MATCH (u:User{uid: $uid}) '
                + 'MATCH (r:Resource{path: $path}) '
                + 'MATCH (u)-[c:Can{method: $method}]->(r)'
                + 'RETURN u,r,c;',
      {
        uid: id,
        path: req.path,
        method: req.method,
      },
    );
    return results.records.length > 0;
  },
];
