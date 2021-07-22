module.exports = app => {
  const controller = require('../controllers/reports')();

  app.route('/api/reports/newRequest')
    .post(controller.request)
}