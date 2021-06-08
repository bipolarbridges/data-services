import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import cors from 'cors';
import {database, Database} from './lib/db';
import api, { MeasurementInput } from './lib/interface';
import accept from './lib/requests';
import { handle } from './lib/errors';
import { auth } from './lib/auth';
//import logs from './lib/logging';


const app = express()
const db: Database = database()

app.use(express.json())
app.use(cors())
app.use(accept())

app.get('/', (req, res) => {
    return res.status(200).end();
});

app.use(auth(db))


const clientRouter = express.Router();
clientRouter.route('/')
    .post(async (req, res) => {
        const data = req.body
        if (!data['id']) {
            res.status(400).send({
                message: "Missing id field"
            })
        } else {
            const id = data['id']
            const exists = await db.exec(api.userExistsX(id))
            if (exists) {
                res.status(403).send({
                    message: "Already exists"
                })
            } else {
                await db.exec(api.createUserX(id))
                res.status(201).send({
                    message: "Created"
                })
            }
        }
    });

clientRouter.route('/:clientId')
    .get(async (req, res) => {
        res.status(200).send({
            id: req.params.clientId
        });
    });

app.use('/client', clientRouter);

interface measurementBody {
    clientID: string,
    data: {
        subtype: string,
        value: number,
        date: number,
        source: string
    },
}
const measurementRouter = express.Router();

measurementRouter.route('/')
    .post(async (req, res) => {
        const data: Partial<measurementBody> = req.body
        if (!data?.clientID
            || !data?.data
            || !data.data?.date || !data.data?.source || !data.data?.value) {
            res.status(400).send({
                message: "Missing data fields"
            })
        } else if (isNaN(data.data.date)) {
            res.status(400).send({
                message: "date must be a number"
            })
        } else {
            const me: MeasurementInput = {
                date: data.data.date,            
                uid: data.clientID,
                source: data.data.source,
                data: data.data,                
            }
            if (!(await db.exec(api.userExistsX(me.uid)))) {
                res.status(404).send({
                    message: "Specified client does not exist"
                })
            } else if (!(await db.exec(api.createMeasurementX(me)))) {
                res.status(400).send({
                    message: "measurement could not be created"
                })
            } else {
                res.status(201).send({
                    message: "Created"
                })
            }
        }
    })

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
