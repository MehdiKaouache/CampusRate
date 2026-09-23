import * as Joi from 'joi';

export const envValidationSchema = Joi.object({
  PORT: Joi.number().port().default(3000),
  DATA_FILE_PATH: Joi.string().required(),
});