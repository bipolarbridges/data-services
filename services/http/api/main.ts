import dotenv from 'dotenv';
dotenv.config();

import express, { NextFunction, Response, Request } from 'express';
import cors from 'cors';
import { database, Database } from './lib/db';
import api, { CreateMeasurementArgs } from './lib/interface';
import accept from './lib/requests';
import { handle } from './lib/errors';
import { auth } from './lib/auth';
import { debug } from './lib/logging';


const app = express()
const db: Database = database()
const authenticate = auth(db)

app.use(express.json())
app.use(cors())
app.use(accept())

app.get('/', (req, res) => {
    return res.status(200).end();
});


const clientRouter = express.Router();

const clientInfoRoute = clientRouter.route('/:clientId');

clientRouter.use(authenticate);

clientRouter.route('/')
    .post(async (req, res) => {
        const data = req.body
        if (!data['id']) {
            res.status(400).send({
                message: "Missing id field"
            })
        } else {
            const id = data['id'];
            try {
                const exists = await db.exec(api.userExists(id));
                if (exists) {
                    res.status(403).send({
                        message: "Already exists"
                    })
                } else {
                    await db.exec(api.createUser(id))
                    res.status(201).send({
                        message: "Created"
                    })
                }
            } catch (err) {
                res.status(404).send({
                    message: err
                })
            }
        }
    });

clientInfoRoute.get(authenticate);

clientInfoRoute.get(async (req, res) => {
        res.status(200).send({
            id: req.params.clientId
        });
    });

app.use('/client', clientRouter);

// MEASUREMENT ADD
interface measurementBody {
    clientID: string,
    data: {
        name: string,
        value: number,
        date: number,
        source: string
    },
}

type RequestWithParams = Request & { _params: measurementBody };

const measurementParamFilter = async (req: RequestWithParams, res: Response, next: NextFunction) => {
    const { clientID, data }: Partial<measurementBody> = req.body;
    if (!data) {
            res.status(400).send({
                message: "Missing data object"
            });
            return;
    }
    const { name, value, date, source } = data;
    if (!clientID || !date || !value || !name || !source) {
            res.status(400).send({
                    message: "Missing data fields"
            });
            return;
    }
    if (isNaN(data.date)) {
            res.status(400).send({
            message: "date must be a number"
            })
            return;
    }
    req._params = { clientID, data };
    next();
}

const measurementRouter = express.Router();
measurementRouter.use(measurementParamFilter);
measurementRouter.use(authenticate);

measurementRouter.route('/')
    .post(async (req: RequestWithParams, res) => {
        debug(req._params);
        const { clientID, data } = req._params;
        const { name, value, date, source } = data;
        const me: CreateMeasurementArgs = {
            date,
            uid: clientID,
            source,
            name,
            value,
        }
        if (!(await db.exec(api.userExists(me.uid)))) {
            res.status(404).send({
                message: "Specified client does not exist"
            })
        } else if (!(await db.exec(api.createMeasurement(me)))) {
            res.status(400).send({
                message: "measurement could not be created"
            })
        } else {
            res.status(201).send({
                message: "Created"
            })
        }
    })

app.use('/measurement', measurementRouter);
app.use(handle());

const port = 8888
const host = process.env.API_ADDR

const server = app.listen(port, host, () => {
    console.log(`Example app listening at http://${host}:${port}`)
});

process.on('SIGINT', async () => {
    await db.stop()
    server.close(() => {
        console.log("\n\nBye.")
        process.exit()
    })
});
