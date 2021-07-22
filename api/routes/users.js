module.exports = app => {
  const controller = require('../controllers/users')();

  app.route('/api/users')
    .get(controller.users);
  app.route('/api/users/count')
    .get(controller.count);
  app.route('/api/users/count-active')
    .get(controller.active);
  
  app.route('/api/users/login')
    .post(controller.login)

  app.route('/api/users/getData')
    .get(controller.getData);
}