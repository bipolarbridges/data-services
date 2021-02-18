const logs = require('../logging');

class InternalError extends Error {}

function wrap(proc) {
    return async (req, res) => {
        try {
            await proc(req, res)
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