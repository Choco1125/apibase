const { Router } = require('express');
const UserRoutes = require('./users.routes');
const AuthRoutes = require('./auth.routes');

function routerApi(app) {
  const router = Router();

  app.use('/api/v1', router);
  router.use('/auth', AuthRoutes);
  router.use('/users', UserRoutes);

}

module.exports = routerApi;
