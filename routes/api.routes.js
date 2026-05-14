const userController = require('#controllers/user.controller');
const { getStats } = require('#state/request-counter');
const { getUserByIdRouteSchema } = require('#validators/user.schemas');

async function apiRoutes(fastify, _options) {
  fastify.get('/users', userController.getUsers);
  fastify.get('/users/:id', getUserByIdRouteSchema, userController.getUserById);

  fastify.get('/stats', async () => getStats());
}

module.exports = apiRoutes;
