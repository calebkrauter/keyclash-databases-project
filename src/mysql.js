var mySql = require('mysql');

var connection = mySql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'root',
    database: 'keyclash.db'
});

connection.connect(function (err) {
    if (err)
        throw err;
    console.log("connected to database");
});

module.exports = connection;