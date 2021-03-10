require('dotenv').config()

const express = require('express')
const cors = require('cors')
const bodyParser = require('body-parser')
const database = require('./lib/db')
const api = require('./lib/interface')
const { accept } = require('./lib/requests')
const { wrap } = require('./lib/errors')

const app = express()
app.use(bodyParser.json())
app.use(cors())
app.use(wrap())
app.use(accept())

const db = database()

app.post('/client', async (req, res) => {
    const data = req.body
    const key = req.get('Authorization')
    if (!(await db.exec(api.validateAuthKey(key)))) {
        res.status(403).send({
            message: "Invalid API key"
        })
    } else if (!data['id']) {
        res.status(400).send({
            message: "Missing id field"
        })
    } else {
        const id = data['id']
        const exists = await db.exec(api.userExists(id))
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
    }
});

app.post('/account', async (req, res) => {
const data = req.body
    const key = req.get('Authorization')
    if (!(await db.exec(api.validateAuthKey(key)))) {
        res.status(403).send({
            message: "Invalid API key"
        })
    } else if (!data['clientID'] || !data['coachID']) {
        res.status(400).send({
            message: "Missing id field"
        })
    } else {
        await db.exec(api.createAccount(data['clientID'], data['coachID']));
        res.status(201).send({
            message: "Created"
        });
    }
});

app.post('/measurement', async (req, res) => {
    const data = req.body
    const key = req.get('Authorization')
    if (!(await db.exec(api.validateAuthKey(key)))) {
        res.status(403).send({
            message: "Invalid API key"
        })
    } else if (!data['clientID'] || !data['coachID'] 
                || !data['data']
                || !data.data['date'] || !data.data['dataType'] || !data.data['value']) {
        res.status(400).send({
            message: "Missing data fields"
        })
    } else if (isNaN(data.data['date'])) {
        res.status(400).send({
            message: "date must be a number"
        })
    } else {
        const me = {
            date: data.data['date'],
            uid: data.clientID,
            cid: data.coachID,
            type: data.data.dataType,
            value: data.data.value
        }
        if (!(await db.exec(api.createMeasurement(me)))) {
            res.status(404).send({
                message: "at least one of client or coach does not exist"
            })
        } else {
            res.status(201).send({
                message: "Created"
            })
        }
    }
});

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
