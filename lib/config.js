const fs = require('fs'), ini = require('ini');
const config = ini.parse(fs.readFileSync('./config.ini', 'utf-8'));
exports = module.exports = config