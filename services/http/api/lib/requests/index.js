const logs = require('../logging');

function accept(handler) {
    return (req,res) => {
        logs.info(`${req.method} ${req.path} ${req.hostname}`);
        handler(req,res);
    }
}

module.exports = { accept };
