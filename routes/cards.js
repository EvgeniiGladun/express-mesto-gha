const card = require('express').Router();
const {
  createCard,
  deleteCard,
  readCards,
  createIsLike,
  deleteIsLike,
} = require('../controllers/cards');

card.post('/cards', createCard);

card.delete('/cards/:cardId', deleteCard);

card.get('/cards', readCards);

card.put('/cards/:cardId/likes', createIsLike);
card.delete('/cards/:cardId/likes', deleteIsLike);

// Экспортируем "роутер"
module.exports = card;
