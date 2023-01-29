const RegExp = /https?:\/\//;
const { Joi, celebrate, errors } = require('celebrate');
const card = require('express').Router();

const {
  createCard,
  deleteCard,
  readCards,
  createIsLike,
  deleteIsLike,
} = require('../controllers/cards');

card.post('/', celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30).required(),
    link: Joi.string().required().pattern(RegExp),
  }),
}), createCard);

card.delete('/:cardId', celebrate({
  params: Joi.object().keys({
    cardId: Joi.string().length(24).hex(),
  }),
}), deleteCard);

card.get('/', readCards);

card.put('/:cardId/likes', celebrate({
  params: Joi.object().keys({
    cardId: Joi.string().length(24).hex(),
  }),
}), createIsLike);
card.delete('/:cardId/likes', celebrate({
  params: Joi.object().keys({
    cardId: Joi.string().length(24).hex(),
  }),
}), deleteIsLike);

// Обработка ошибок модуля 'Joi'
card.use(errors());

// Экспортируем "роутер"
module.exports = card;
