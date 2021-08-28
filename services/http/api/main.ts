import dotenv from 'dotenv';

import express, { Request, Response } from 'express';
import cors from 'cors';
import { database, Database } from './lib/db';
import api, { CreateDomainArgs, CreateAffirmationArgs, CreateAffirmationNotifArgs } from './lib/interface';
import accept from './lib/requests';
import { handle } from './lib/errors';
import auth from './lib/auth';
import { CreateMeasurementArgs } from './lib/interface/measurement';

dotenv.config();

const app = express();
const db: Database = database();

app.use(express.json());
app.use(cors());
app.use(accept());

app.get('/', (req, res) => res.status(200).end());

app.use(auth(db));

export interface ClientBody {
  id: string,
}

export interface MeasurementBody {
  clientID: string,
  data: {
    name?: string,
    value?: number,
    date?: (string | number),
    source?: string
  },
}

export interface DomainBody {
  id: string,
  data: {
    bullets?: string[],
    importance?: string,
    name?: string,
    scope?: string,
  },
}

export interface AffirmationBody {
  id: string,
  data: {
    content?: string,
    domains?: string[],
    keywords?: string[],
  },
}

export interface AffirmationNotifBody {
  id: string,
  data: {
    affirmationId?: string,
    userId?: string,
    date?: number,
  },
}

const clientRouter = express.Router();
clientRouter
  .post('/', async (req: Request, res: Response) => {
    const data = req.body;
    if (!data.id) {
      res.status(400).send({
        message: 'Missing id field',
      });
    } else {
      const { id }: ClientBody = data;
      try {
        const exists = await db.exec(api.userExists(id));
        if (exists) {
          res.status(403).send({
            message: 'Already exists',
          });
        } else {
          await db.exec(api.createUser(id));
          res.status(201).send({
            message: 'Created',
          });
        }
      } catch (err) {
        res.status(404).send({
          message: err,
        });
      }
    }
  })
  .get('/:clientId', async (req: Request, res: Response) => {
    res.status(200).send({
      id: req.params.clientId,
    });
  });

app.use('/client', clientRouter);

const measurementRouter = express.Router();
measurementRouter
  .post('/', async (req: Request, res: Response) => {
    const { clientID, data }: Partial<MeasurementBody> = req.body;
    if (!data) {
      res.status(400).send({
        message: 'Missing data object',
      });
    } else if (!clientID) {
      res.status(400).send({
        message: 'Missing clientID',
      });
    } else {
      const {
        name, value, date, source,
      } = data;
      if (!date || !value || !name || !source) {
        res.status(400).send({
          message: 'Missing data fields',
        });
      /* eslint-disable no-restricted-globals */
      } else if (Number.isNaN(data.date)) {
        res.status(400).send({
          message: 'date must be a number',
        });
      } else {
        const me: CreateMeasurementArgs = {
          date: (date as number),
          uid: clientID,
          source,
          name,
          value,
        };
        if (!(await db.exec(api.userExists(clientID)))) {
          res.status(404).send({
            message: 'Specified client does not exist',
          });
        } else if (!(await db.exec(api.createMeasurement(me)))) {
          res.status(400).send({
            message: 'measurement could not be created',
          });
        } else {
          res.status(201).send({
            message: 'Created',
          });
        }
      }
    }
  });

app.use('/measurement', measurementRouter);

const domainRouter = express.Router();
domainRouter
  .post('/', async (req: Request, res: Response) => {
    const { id, data }: Partial<DomainBody> = req.body;
    if (!data) {
      res.status(400).send({
        message: 'Missing data object',
      });
    } else if (!id) {
      res.status(400).send({
        message: 'Missing id',
      });
    } else {
      const {
        bullets, importance, name, scope,
      } = data;
      if (!bullets || !importance || !name || !scope) {
        res.status(400).send({
          message: `Missing data fields: ${bullets}, ${importance}, ${name}, ${scope}`,
        });
      } else {
        const me: CreateDomainArgs = {
          id,
          bullets,
          importance,
          name,
          scope,
        };

        if ((await db.exec(api.domainExists(name)))) {
          res.status(400).send({
            message: 'Domain already exists with that name.',
          });
        } else if (!(await db.exec(api.createDomain(me)))) {
          res.status(400).send({
            message: 'Domain could not be created',
          });
        } else {
          res.status(201).send({
            message: 'Created',
          });
        }
      }
    }
  });
app.use('/domain', domainRouter);

const affirmationRouter = express.Router();
affirmationRouter
  .post('/', async (req: Request, res: Response) => {
    const { id, data }: Partial<AffirmationBody> = req.body;
    if (!id) {
      res.status(400).send({
        message: 'Missing id',
      });
    } else if (!data) {
      res.status(400).send({
        message: 'Missing data',
      });
    } else {
      const {
        content, domains, keywords,
      } = data;

      if (!content || !domains || !keywords) {
        res.status(400).send({
          message: `Missing data fields: ${content}, ${domains}, ${keywords}`,
        });
      } else {
        const me: CreateAffirmationArgs = {
          uid: id,
          content,
          domains,
          keywords,
        };

        if ((await db.exec(api.affirmationExists(id)))) {
          res.status(400).send({
            message: 'Affirmation already exists.',
          });
        } else if (!(await db.exec(api.createAffirmation(me)))) {
          res.status(400).send({
            message: 'Affirmation could not be created',
          });
        } else {
          res.status(201).send({
            message: 'Created',
          });
        }
      }
    }
  });
affirmationRouter
  .post('/notif', async (req: Request, res: Response) => {
    const { id, data }: Partial<AffirmationNotifBody> = req.body;
    if (!data) {
      res.status(400).send({
        message: 'Missing data object',
      });
    } else if (!id) {
      res.status(400).send({
        message: 'Missing id',
      });
    } else {
      const {
        affirmationId, userId, date,
      } = data;
      if (!date || !affirmationId || !userId) {
        res.status(400).send({
          message: 'Missing data fields',
        });
      /* eslint-disable no-restricted-globals */
      } else if (Number.isNaN(data.date)) {
        res.status(400).send({
          message: 'date must be a number',
        });
      } else {
        const an: CreateAffirmationNotifArgs = {
          date,
          notifId: id,
          affirmationId,
          userId,
        };
        if (!(await db.exec(api.userExists(userId)))) {
          res.status(404).send({
            message: 'Specified client does not exist',
          });
        } else if (!(await db.exec(api.affirmationExists(affirmationId)))) {
          res.status(404).send({
            message: 'Specified affirmation does not exist',
          });
        } else if ((await db.exec(api.affirmationNotifExists(id)))) {
          res.status(404).send({
            message: 'Affirmation notif already exists.',
          });
        } else if (!(await db.exec(api.createAffirmationNotif(an)))) {
          res.status(400).send({
            message: 'Affirmation notif could not be created',
          });
        } else {
          res.status(201).send({
            message: 'Created',
          });
        }
      }
    }
  });
app.use('/affirmation', affirmationRouter);

app.use(handle());

const port = 8888;
const host = process.env.API_ADDR;

const server = app.listen(port, host, () => {
  console.log(`Example app listening at http://${host}:${port}`);
});

process.on('SIGINT', async () => {
  await db.stop();
  server.close(() => {
    console.log('\n\nBye.');
    process.exit();
  });
});
