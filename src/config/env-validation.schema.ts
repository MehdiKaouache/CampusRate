import * as Joi from 'joi';

export const envValidationSchema = Joi.object({
  PORT: Joi.number().port().default(3000),
  MONGO_URI: Joi.string()
    .pattern(/^mongodb(\+srv)?:\/\/.+/)
    .required()
    .messages({
      'string.pattern.base':
        'MONGO_URI doit commencer par mongodb:// ou mongodb+srv://',
    }),
});