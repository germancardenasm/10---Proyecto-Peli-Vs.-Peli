var mysql = require('mysql');
console.log("Variables de Entorno: " + process.env.DB_HOST + process.env.DB_DATABASE + process.env.DB_DATABSE + process.env.DB_PORT);

var connection = mysql.createConnection({
    host     : 'localhost',
    port     : "3306",
    user     : 'root',
    password : 'Gcm10321#',
    database : 'competencias'
  });
   
  connection.connect();

  module.exports = connection;