const fastify = require('fastify');
const config = require('#config/env');
const errorHandler = require('#plugins/error-handler');
const apiRoutes = require('#routes/api.routes');

function buildApp() {
  const app = fastify({ logger: true });

  config.port = 9999;

  app.register(errorHandler);

  app.get('/health', async () => ({ status: 'ok' }));

  app.register(apiRoutes, { prefix: '/api' });

  return app;
}

module.exports = buildApp;
