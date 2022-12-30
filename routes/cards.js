const card = require('express').Router();
const {
  createCard,
  deleteCard,
  readCards,
  createIsLike,
  deleteIsLike,
} = require('../controllers/cards');

card.post('/', createCard);

card.delete('/:cardId', deleteCard);

card.get('/', readCards);

card.put('/:cardId/likes', createIsLike);
card.delete('/:cardId/likes', deleteIsLike);

// Экспортируем "роутер"
module.exports = card;
