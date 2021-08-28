import { Request, Response, NextFunction } from 'express';
import { AuthMethod, authMethods } from './auth_methods';
import findOne from '../util/misc';
import { info, warn } from '../logging';
import { Database } from '../db';

export default function auth(db: Database) {
  return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const provided = req.get('Authorization');
    if (!provided
            || !(await findOne(authMethods, async (m: AuthMethod) => db.exec(m(req, provided))))) {
      warn('Unauthorized request attempted');
      info(`requested path: ${req.path}`);
      res.status(403).send({
        message: 'Not authorized',
      });
    } else {
      next();
    }
  };
}
