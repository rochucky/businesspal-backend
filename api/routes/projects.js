module.exports = app => {
  const controller = require('../controllers/projects')();

  app.route('/api/projects/')
    .get(controller.projects);
  app.route('/api/projects/count')
    .get(controller.count);
  app.route('/api/projects/:userId')
    .get(controller.getData);

  app.route('/api/projects/create')
    .post(controller.create);
  app.route('/api/projects/delete/:projectId')
    .get(controller.delete);
    app.route('/api/projects/update/:projectId')
    .post(controller.update);
  }