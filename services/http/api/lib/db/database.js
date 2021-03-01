const neo4j = require('neo4j-driver')

class DatabaseError extends Error {}

class Database {

    constructor () {
        this.driver = null
        this.initialized = false
    }

    init () {
        this.driver = neo4j.driver(`bolt://${process.env.DB_ADDR}:7687`, null)
        this.initialized = true
    }

    async exec (proc) {
        const session = this.driver.session()
        try {
            const ret = await proc(session)
            return ret
        } catch (e) {
            throw new DatabaseError()
        } finally {
            await session.close()
        }
    }

    async stop () {
        await this.driver.close()
    }
}

function database() {
    db = new Database()
    db.init()
    return db
}

module.exports = database
