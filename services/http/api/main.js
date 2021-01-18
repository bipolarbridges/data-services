const neo4j = require('neo4j-driver')
const express = require('express')

const app = express()
const port = 8888

// connects to the locally-running database
// URL is hardcoded to match the container network config
const driver = neo4j.driver("bolt://db:7687", null)

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
});

// on application exit:
// TODO should manage a sesion maintaining an ephemeral driver instance
//driver.close().then(() => { console.log("Done") });