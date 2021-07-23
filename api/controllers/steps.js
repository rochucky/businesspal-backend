module.exports = () => {
  const controller = {};

  controller.steps = async (req, res) => {
    const db = require('../../db');
    let results = await db.query('select * from steps');
    db.close();
    res.status(200).json(results);
  }
  
  controller.save = async (req, res) => {
    const db = require('../../db');
    const { step, project_id, data} = req.body
    let results = await db.query(`select id from project_steps where project_id = ${project_id} and step = ${step}`);
    // let results = await db.query('select id from steps');
    try {
      if(results.length === 0){
        db.query(`insert into project_steps values ('', ${step}, ${project_id}, '${data}')`);
        db.close();
        res.status(200).json({error: false});
      }
      else {
        db.query(`update project_steps set step = ${step}, project_id = ${project_id}, answers = '${data}' where id = ${results[0].id}`);
        db.close();
        res.status(200).json({error: false});
      }
    }
    catch(err){
      db.close();
      res.status(418).json({error: true});
    }
  }

  controller.getData = async (req, res) => {
    const db = require('../../db');
    const {step, project_id} = req.body;
    let results = await db.query(`select answers as data from project_steps where project_id = ${project_id} and step = ${step}`);
    db.close();
    res.status(200).json(results[0].data);
  }

  return controller;
}