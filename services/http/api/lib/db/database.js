const neo4j = require('neo4j-driver');
const { InternalError } = require('../errors');

class DatabaseError extends InternalError {};

class Database {

    constructor () {
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
        const session = this.driver.session()
        try {
            const ret = await proc(session)
            return ret
        } catch (e) {
            throw new DatabaseError(e)
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
