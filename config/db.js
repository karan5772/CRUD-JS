const mysql = require("mysql");
const dotenv = require("dotenv");
dotenv.config();

const connection = mysql.createConnection({
  host : "localhost",
  user : "root",
  password : "",
  database : "crud",
})

connection.connect((error)=>{
  if (error)
    throw error;
  console.log("connetion sucessful");
})

module.exports = connection;