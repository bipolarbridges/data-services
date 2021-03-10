function info(...msg) {
    console.log('[INFO]', ...msg);
}

function error(...msg) {
    console.log('[ERROR]', ...msg);
}

info('Logging enabled')

module.exports = { info, error };
