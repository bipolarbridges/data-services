const { authMethods } = require('./auth_methods');
const { findOne } = require('../util/misc');
const logs = require('../logging');

module.exports = {
    auth: (db) => async (req, res, next) => {
        const provided = req.get('Authorization');
        if (!provided ||
            !(await findOne(authMethods, async m => await db.exec(m(req, provided))))) {
            logs.warn("Unauthorized request attempted");
            res.status(403).send({
                message: "Not authorized"
            });
        } else {
            next();
        }
    }
};