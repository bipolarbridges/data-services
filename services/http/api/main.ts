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


const appUserRouter = express.Router();

const appUserInfoRoute = appUserRouter.route('/:appUserId');

appUserRouter.use(authenticate);

appUserRouter.route('/')
    .post(async (req, res) => {
        const data = req.body
        if (!data['id']) {
            res.status(400).send({
                message: "Missing id field"
            })
        } else {
            const id = data['id'];
            try {
                const exists = await db.exec(api.appUserExists(id));
                if (exists) {
                    res.status(403).send({
                        message: "Already exists"
                    })
                } else {
                    await db.exec(api.createAppUser(id))
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

appUserInfoRoute.get(authenticate);

appUserInfoRoute.get(async (req, res) => {
        res.status(200).send({
            id: req.params.appUserId
        });
    });

app.use('/appUser', appUserRouter);

// MEASUREMENT ADD
interface measurementBody {
    appUserID: string,
    data: {
        name: string,
        value: number,
        date: number,
        source: string
    },
}

type RequestWithParams = Request & { _params: measurementBody };

const measurementParamFilter = async (req: RequestWithParams, res: Response, next: NextFunction) => {
    const { appUserID, data }: Partial<measurementBody> = req.body;
    if (!data) {
            res.status(400).send({
                message: "Missing data object"
            });
            return;
    }
    const { name, value, date, source } = data;
    if (!appUserID || !date || !value || !name || !source) {
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
    req._params = { appUserID, data };
    next();
}

const measurementRouter = express.Router();
measurementRouter.use(measurementParamFilter);
measurementRouter.use(authenticate);

measurementRouter.route('/')
    .post(async (req: RequestWithParams, res) => {
        debug(req._params);
        const { appUserID, data } = req._params;
        const { name, value, date, source } = data;
        const me: CreateMeasurementArgs = {
            date,
            uid: appUserID,
            source,
            name,
            value,
        }
        if (!(await db.exec(api.appUserExists(me.uid)))) {
            res.status(404).send({
                message: "Specified appUser does not exist"
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
