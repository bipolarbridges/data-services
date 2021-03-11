const logs = require('../logging');

class InternalError extends Error {}

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
    handle
}
