const mysql = require('mysql2');

var mysqlConnection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'mysql123',
    database: 'apidb'
})

mysqlConnection.connect((err) => {
    if(err){
         console.log('Error in DB connection' + JSON.stringify(err,undefined,2) );
    }
    else{
         console.log('DB Connected successfully' )
    }
})

module.exports = mysqlConnection

/*
const pool = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: 'mysql123',
    database: 'apidb'
})*/


