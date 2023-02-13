const { Joi, celebrate } = require('celebrate');

const validator = (schema) => (payload) => schema.validator(payload, { AbortEarly: false });

const signupShema = celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30).default('Жак-Ив Кусто'),
    about: Joi.string().min(2).max(30).default('Исследователь'),
    avatar: Joi.string().min(2).max(30).default('https://pictures.s3.yandex.net/resources/jacques-cousteau_1604399756.png'),
    email: Joi.string().required().email(),
    password: Joi.string().required().min(8),
  }),
});

const signinShema = celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required().min(8),
  }),
});

const usersShema = celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
  }),
});

const cardsShema = celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30).required(),
    link: Joi.string().required(),
  }),
});

exports.validateSignup = validator(signupShema);
exports.validateSignin = validator(signinShema);
exports.validateUsers = validator(usersShema);
exports.validateCards = validator(cardsShema);
