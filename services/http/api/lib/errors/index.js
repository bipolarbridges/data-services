const logs = require('../logging');

class InternalError extends Error {}

function wrap() {
    return async (req, res, next) => {
        try {
            await next();
        } catch (e) {
            logs.error(e)
            res.status(500).send({
                message: "Internal Error"
            })
        }
    }
}

module.exports = {
    InternalError,
    wrap
}
