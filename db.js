const mySQL = require('mysql');
const config = require('./config').db;

const connection = mySQL.createPool(config);

module.exports = connection;
