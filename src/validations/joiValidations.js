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

const signInValidation = Joi.object({
  email: Joi.string().email({ tlds: { allow: false } }).required(),
  password: Joi.string().min(6).max(12).required(),
});

const basketValidation = Joi.object({
  userId: Joi.number().required(),
  productId: Joi.number().required(),
  colorId: Joi.number().optional(),
  sizeId: Joi.number().optional(),
  quantity: Joi.number().positive().optional(),
});

const checkoutValidation = Joi.object({
  installments: Joi.number().required(),
  paymentMethod: Joi.string().valid('PIX', 'CARTÃO DE CRÉDITO').required(),
  deliveryFee: Joi.number().required(),
});

export {
  signUpValidation,
  signInValidation,
  basketValidation,
  checkoutValidation,
};
