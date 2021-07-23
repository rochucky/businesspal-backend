module.exports = () => {
  const controller = {};

  controller.request = async (req, res) => {
    let { setor, name, description, email } = req.body;

    const db = require('../../db');
    await db.query(`insert into report_requests values ('', '${setor}', '${name}', '${email}', '${description}')`);
    db.close();
    res.status(200).json({message: 'inserted!'});
  }

  return controller
}