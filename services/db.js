const mySQL = require('mysql');

const config = {
    host: 'localhost',
    user: 'root',
    password: 'root',
    database: 'university'
}

const connection = mySQL.createConnection(config);

module.exports = connection;