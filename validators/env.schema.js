/** Ajv JSON Schema for process.env (Lab 3: shared validation). */
const envSchema = {
  type: 'object',
  properties: {
    PORT: { type: 'string' },
    HOST: { type: 'string' },
    NODE_ENV: { type: 'string', enum: ['development', 'production', 'test'] }
  },
  required: ['PORT', 'HOST', 'NODE_ENV'],
  additionalProperties: true
};

module.exports = {
  envSchema
};
