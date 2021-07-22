module.exports = app => {
  const controller = require('../controllers/steps')();

  app.route('/api/steps')
    .get(controller.steps);

  app.route('/api/steps/save')
    .post(controller.save);
  app.route('/api/steps/getData')
    .post(controller.getData);
}