import dotenv from 'dotenv';

import express, { Request, Response } from 'express';
import cors from 'cors';
import { database, Database } from './lib/db';
import api, { CreateMeasurementArgs, CreateDomainArgs } from './lib/interface';
import accept from './lib/requests';
import { handle } from './lib/errors';
import auth from './lib/auth';

dotenv.config();

const app = express();
const db: Database = database();

app.use(express.json());
app.use(cors());
app.use(accept());

app.get('/', (req, res) => res.status(200).end());

app.use(auth(db));

const clientRouter = express.Router();
clientRouter.route('/')
  .post(async (req, res) => {
    const data = req.body;
    if (!data.id) {
      res.status(400).send({
        message: 'Missing id field',
      });
    } else {
      const { id } = data;
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
  });

clientRouter.route('/:clientId')
  .get(async (req, res) => {
    res.status(200).send({
      id: req.params.clientId,
    });
  });

app.use('/client', clientRouter);

interface MeasurementBody {
  clientID: string,
  data: {
    name: string,
    value: number,
    date: number,
    source: string
  },
}
const measurementRouter = express.Router();

measurementRouter.route('/')
  .post(async (req, res) => {
    const { clientID, data }: Partial<MeasurementBody> = req.body;
    if (!data) {
      res.status(400).send({
        message: 'Missing data object',
      });
    } else {
      const {
        name, value, date, source,
      } = data;
      if (!clientID || !date || !value || !name || !source) {
        res.status(400).send({
          message: 'Missing data fields',
        });
      /* eslint-disable no-restricted-globals */
      } else if (isNaN(data.date)) {
        res.status(400).send({
          message: 'date must be a number',
        });
      } else {
        const me: CreateMeasurementArgs = {
          date,
          uid: clientID,
          source,
          name,
          value,
        };
        if (!(await db.exec(api.userExists(me.uid)))) {
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

export interface DomainBody {
  id: string,
  data: {
    bullets?: string[],
    importance?: string,
    name?: string,
    scope?: string,
  },
}

domainRouter.route('/')
  .post(async (req: Request, res: Response) => {
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

        if ((await db.exec(api.domainExists(id)))) {
          res.status(400).send({
            message: 'Domain already exists.',
          });
        } else if (!(await db.exec(api.createDomain(me)))) {
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
app.use('/domain', domainRouter);

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
