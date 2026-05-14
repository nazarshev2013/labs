/** Route validation schemas (params / body / query) for user routes. */

const userIdParamsSchema = {
  type: 'object',
  properties: {
    id: { type: 'integer' }
  },
  required: ['id']
};

const getUserByIdRouteSchema = {
  schema: {
    params: userIdParamsSchema
  }
};

module.exports = {
  userIdParamsSchema,
  getUserByIdRouteSchema
};
