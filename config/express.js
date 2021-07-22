const express    = require('express');
const bodyParser = require('body-parser');
const config     = require('config');
const cors = require('cors');
module.exports = () => {
  const app = express();

  // SETANDO VARIÁVEIS DA APLICAÇÃO
  app.set('port', process.env.PORT || config.get('server.port'));

  // MIDDLEWARES
  app.use(bodyParser.json());
  app.use(cors());

  require('../api/routes/customerWallets')(app)
  require('../api/routes/users')(app)
  require('../api/routes/ideas')(app)
  require('../api/routes/projects')(app)
  require('../api/routes/reports')(app)
  require('../api/routes/steps')(app)

  return app;
};