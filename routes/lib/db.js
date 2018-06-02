var sql = require('mysql');
var conn = sql.createConnection({
    host: '127.0.0.1',
    user: 'vincent',
    password: 'BDNPPpsmmYhAVumS',
    database: 'test'
});

module.exports = conn;
