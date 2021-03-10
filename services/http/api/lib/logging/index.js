function info(...msg) {
    console.log('[INFO]', ...msg);
}

function error(...msg) {
    console.log('[ERROR]', ...msg);
}
function debug(...msg) {
    console.log('[DEBUG]', ...msg);
}

info('Logging enabled')

module.exports = { info, error, debug };

