const neo4j = require('neo4j-driver')
const express = require('express')
const cors = require('cors')
const bodyParser = require('body-parser');

const app = express()

app.use(bodyParser.json())
app.use(cors())

// connects to the locally-running database
// URL is hardcoded to match the container network config
const driver = neo4j.driver("bolt://localhost:7687", null)

const stubApiKey = "apikey1"

app.post('/client', async (req, res) => {
    console.log(`${req.method} ${req.path} ${req.hostname}`)
    const data = req.body
    const key = req.get('Authorization')
    if (!data['id']) {
        res.status(400).send({
            message: "Missing id field"
        })
    } else if (key !== stubApiKey) {
        res.status(403).send({
            message: "Invalid API key"
        })
    } else {
        const id = data['id']
        let session = driver.session()
        // TODO handle errors
        const exist = await session.run(
            "MATCH (u:User{uid: $uid}) RETURN u;", { uid: id })
        if (exist.records.length > 0) {
            res.status(403).send({
                message: "Already exists"
            })
        } else {
            // TODO: create database abstraction layer
            await session.run("CREATE (:User{uid: $uid});", { uid: id })
            res.status(201).send({
                message: "Created"
            })
        }
    }
})

const port = 8888

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
});

// on application exit:
// TODO should manage a sesion maintaining an ephemeral driver instance
//driver.close().then(() => { console.log("Done") });