const logs = require('../logging');

class InternalError extends Error {}

function wrap(proc) {
    return async (req, res, next) => {
        try {
            return await proc(req, res);
        } catch (e) {
            return next(e);
        }
    }
}

function handle() {
    return (err, _, res, __) => {
        logs.error(err)
        res.status(500).send({
            message: "Internal Error"
        });
    }
}

module.exports = {
    InternalError,
    wrap,
    handle
}
