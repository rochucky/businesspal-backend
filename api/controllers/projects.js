module.exports = () => {
  const controller = {};

  controller.projects = async (req, res) => {
    const db = require('../../db');
    let results = await db.query('select * from projects');
    db.close();
    res.status(200).json(results);
  };
  controller.count = async (req, res) => {
    const db = require('../../db');
    let results = await db.query('select count(id) as count from projects');
    db.close();
    res.status(200).json(results);
  };

  controller.getData = async (req, res) => {
    const { userId } = req.params
    const db = require('../../db');
    let results = await db.query(`
    select 
      i.id as idea_id,
      p.id as project_id,
      i.nome,
      i.description,
      i.setor,
      p.start_date,
      p.step,
      s.name as step_name,
      round(((step - 1)/15) * 100) as progress
    from 
      ideas i
    inner join projects p on i.id = p.idea_id and p.user_id = ${userId}
    inner join steps s on s.id = p.id;
    `);
    db.close();
    res.status(200).json(results);
  }

  controller.create = async (req, res) => {
    let { user, idea } = req.body;

    const db = require('../../db');
    await db.query(`insert into projects values ('', ${idea}, ${user}, now())`);
    db.close();
    res.status(200).json({message: 'inserted!'});
  }
  
  controller.update = async (req, res) => {
    let id = req.params.projectId;
    let { data } = req.body;
    const setStatement = Object.entries(data).map(item => {
      return `${item[0]} = ${item[1]}`
    })

    const db = require('../../db');
    await db.query(`update projects set ${setStatement.join(', ')} where id = ${id}`);
    db.close();
    res.status(200).json({message: 'updated!'});
  }

  controller.delete = async (req, res) => {
    let id = req.params.projectId;

    const db = require('../../db');
    await db.query(`delete from projects where id = ${id}`);
    db.close();
    res.status(200).json({message: 'deleted!'});
  }

  return controller
}