const fs = require('fs');
const path = require('path');
const logs = require('../logging');

const config = JSON.parse(fs.readFileSync((path.join(__dirname, 'config.json'))));

logs.info('Config: ', config);