require('dotenv').config()

const express = require('express')
const cors = require('cors')
const bodyParser = require('body-parser')
const database = require('./lib/db')
const api = require('./lib/interface')
const { accept } = require('./lib/requests')
const { handle } = require('./lib/errors')
const { auth } = require('./lib/auth');
const logs = require('./lib/logging');


const app = express()
const db = database()

app.use(bodyParser.json())
app.use(cors())
app.use(accept())
app.use(auth(db))

app.post('/client', async (req, res) => {
    const data = req.body
    if (!data['id']) {
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

app.post('/measurement', async (req, res) => {
    const data = req.body
    if (!data['clientID'] 
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
            type: data.data.dataType,
            value: data.data.value
        }
        if (!(await db.exec(api.createMeasurement(me)))) {
            res.status(404).send({
                message: "Specified client does not exist"
            })
        } else {
            res.status(201).send({
                message: "Created"
            })
        }
    }
});

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
