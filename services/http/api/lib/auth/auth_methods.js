const fs = require('fs');
const path = require('path');
const logs = require('../logging');

const config = JSON.parse(fs.readFileSync((path.join(__dirname, 'config.json'))));
logs.info('Config: ', config);

module.exports = {
    authMethods: [
        (req, auth) => async (db) => {
            // KEY AUTHENTICATION
            const results = await db.run(
                "MATCH (i:Identity{type: 'key', check: $check}) " +
                "MATCH (r:Resource{path: $path}) " +
                "MATCH (i)-[c:Can{method: $method}]->(r)" +
                "RETURN i,r,c;", 
                {
                    check: auth,
                    path: req.path,
                    method: req.method
                });
            return results.records.length > 0;
        },
        // TODO: add id token option
    ]
}