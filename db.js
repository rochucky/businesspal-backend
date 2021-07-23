const bcrypt = require('bcrypt');
const salt = '$2b$10$XsBAyM.YEWfZZ39V90Idk.';

const connect = () => {
  const mysql = require('mysql');
  
  var con = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "businesspal"

  });
  
  con.connect(function(err) {
    if (err) throw err;
    console.log("Connected!");
  });

  return con;
}

module.exports = {
  query: (queryString) => {
    return new Promise((resolve, reject) => {
      const db = connect();
      db.query(queryString, (err, result, fields) => {
        if (err) reject(err);
        resolve(result);
      });
    });
  },
  validateUser: (email, password) => {
    return new Promise((resolve, reject) => {
      const db = connect();
      bcrypt.hash(password, salt, function(err, hash) {
        db.query(`select id, name, email from users where email = '${email}' and password = '${hash}'`, (err, result, fields) => {
          if (err) reject(err);
          resolve(result);
        });
      });
    });
  }
}