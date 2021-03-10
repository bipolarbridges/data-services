const logs = require('../logging');

function accept() {
    return async (req,res, next) => {
        logs.info(`${req.method} ${req.path} ${req.hostname}`);
        await next();
    }
}

module.exports = { accept };
