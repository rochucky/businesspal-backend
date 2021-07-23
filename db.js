const bcrypt = require('bcrypt');
const salt = '$2b$10$XsBAyM.YEWfZZ39V90Idk.';

const connect = () => {
  const mysql = require('mysql');
  // b3795aa3531f99:f164aa41@us-cdbr-east-04.cleardb.com/heroku_01a4f15b435726c
  var con = mysql.createConnection({
    host: "us-cdbr-east-04.cleardb.com",
    user: "b3795aa3531f99",
    password: "f164aa41",
    database: "heroku_01a4f15b435726c"

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