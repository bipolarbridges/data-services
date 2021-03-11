const fs = require('fs');
const path = require('path');
const logs = require('../logging');
const crypt = require('crypto');
const axios = require('axios');
const { InternalError } = require('../errors');

class AuthError extends InternalError {};

function basicHash(sec) {
    return crypt.createHash('sha256')
        .update(sec).digest('hex');
}

let config = JSON.parse(fs.readFileSync((path.join(__dirname, 'config.json'))));
config = config['auth_server'];
logs.info('Config: ', config);

const remote = axios.create({
	baseURL: `${config.protocol}://${config.addr}:${config.port}`
});

async function getRemoteId(token) {
    try {
        const res = await remote.post('/validate', { token }, {
            headers: {
                "Content-Type": "application/json"
            }
        });
        if (res.status != 200) {
            throw new Error("Wrong status code response from remote auth");
        } else if (!res.data['result']) {
            return null;
        } else {
            if (!res.data['id']) {
                throw new Error("No id from remote auth");
            } else {
                return res.data['id']
            }
        }
    } catch (e) {
        throw new AuthError(e);
    }
}

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
                    check: basicHash(auth),
                    path: req.path,
                    method: req.method
                });
            return results.records.length > 0;
        },
        // TODO: add id token option
        (req, auth) => async (_) => {
            const id = await getRemoteId(auth);
            if (!id) {
                return false;
            } else {
                logs.info('Authenticated: ', id);
                return true; // TODO
            }
        }
    ]
}