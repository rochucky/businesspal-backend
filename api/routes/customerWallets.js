module.exports = app => {
  const controller = require('../controllers/customerWallets')();

  app.route('/api/customer-wallets')
    .get(controller.listCustomerWallets);
}