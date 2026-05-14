const fp = require('fastify-plugin');

const errorHandlerPlugin = async (fastify, _options) => {
  fastify.setErrorHandler((error, request, reply) => {
    request.log.error(error);
    reply.status(error.statusCode || 500).send({
      success: false,
      message: error.message || 'Internal Server Error'
    });
  });
};

module.exports = fp(errorHandlerPlugin);
