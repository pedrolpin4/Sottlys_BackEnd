import Joi from 'joi';

const signUpValidation = Joi.object({
  name: Joi.string().min(3).max(20).required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(6).max(12).required(),
  cpf: Joi.string().length(11).required(),
  address: Joi.object({
    district: Joi.string().required(),
    city: Joi.string().required(),
    neighborhood: Joi.string().required(),
    street: Joi.string().required(),
    number: Joi.number().required(),
    complement: Joi.optional(),
  }),
  phone: Joi.string().min(10).max(15).required(),
});

export default signUpValidation;
