const mysql = require('mysql2');
var fs = require('fs');

var configPath = './config.json'
var parsed = JSON.parse(fs.readFileSync(configPath, 'UTF-8'));

var mysqlConnection  = mysql.createConnection({
    host : parsed.host,
    user : parsed.user,
    password : parsed.password,
    database : parsed.database
});


mysqlConnection.connect((err) => {
    if(err){
         console.log('Error in DB connection' + JSON.stringify(err,undefined,2) );
    }
    else{
         console.log('DB Connected successfully' )
    }
})

module.exports = mysqlConnection




