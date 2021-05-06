const mySQL = require('mysql');

const config = {
    host: 'localhost',
    user: 'root',
    password: 'root',
    database: 'university'
}

const connection = mySQL.createPool(config);

module.exports = connection;