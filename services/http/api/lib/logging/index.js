function info(...msg) {
    console.log('[INFO]', ...msg);
}

function warn(...msg) {
    console.log('[WARNING]', ...msg);
}

function error(...msg) {
    console.log('[ERROR]', ...msg);
}

function debug(...msg) {
    console.log('[DEBUG]', ...msg);
}

info('Logging enabled')

module.exports = { info, warn, error, debug };

