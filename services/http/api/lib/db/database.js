const neo4j = require('neo4j-driver')

class Database {

    constructor() {
        this.driver = null
        this.initialized = false
    }

    init () {
        // connects to the locally-running database
        // URL is hardcoded to match the container network config
        this.driver = neo4j.driver("bolt://localhost:7687", null)
        this.initialized = true
    }

    async exec (proc) {
        // TODO handle errors
        const session = this.driver.session()
        const ret = await proc(session)
        await session.close()
        return ret
    }
}

function database() {
    db = new Database()
    db.init()
    return db
}

module.exports = database
