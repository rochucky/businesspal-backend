module.exports = () => {
  const controller = {};

  controller.users = async (req, res) => {
    const db = require('../../db');
    let results = await db.query('select * from users');
    db.close();
    res.status(200).json(results);
  };
  controller.count = async (req, res) => {
    const db = require('../../db');
    let results = await db.query('select count(id) as count from users');
    db.close();
    res.status(200).json(results);
  };
  controller.active = async (req, res) => {
    const db = require('../../db');
    let results = await db.query('select count(id) as count from users where is_active = 1');
    db.close();
    res.status(200).json(results);
  };

  controller.login = async (req, res) => {
    const db = require('../../db');
    const crypto = require('crypto');

    const { email, password } = req.body;
    let response = await db.validateUser(email, password);

    if(response.length === 1) {
      const token = crypto.randomBytes(64).toString('hex');
      responseData = {...response[0], token: token}
      db.query(`update users set token = '${token}' where id = ${responseData.id}`);
      delete responseData.id;
      db.close();
      res.status(200).json(responseData);
    }
    else {
      db.close();
      res.status(403).json({message: 'Falha no login'});
    }
  }

  controller.getData = async (req, res) => {
    const db = require('../../db');
    let response = await db.query(`select id, name, email, is_admin from users where token = '${req.headers.token}'`);
    if(response.length === 1) {
      db.close();
      res.status(200).json(response[0]);
    }
    else {
      db.close();
      res.status(403).json({message: 'Token not found'});
    }
  }

  return controller;
}
