const Card = require('../models/card');

const createCard = (req, res) => {
  const { name, link, owner } = req.body;

  Card.create({ name, link, owner })
    .then((newCard) => res.send(newCard))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return res.status(400).send({ message: 'Переданы некорректные данные при создании карточки.' });
      }
      return res.status(500).send({ message: 'Произошла неизвестная ошибка, проверьте корректность запроса' });
    });
};

const deleteCard = (req, res) => {
  Card.findByIdAndRemove(req.params.cardId)
    .then(() => res.send({ message: `Карточка ${req.params.cardId} - удалена` }))
    .catch((err) => {
      if (err.name === 'CastError') {
        return res.status(404).send({ message: `Карточка с указанным _id [${req.params.cardId}] не найдена.` });
      }
      return res.status(500).send({ message: 'Произошла неизвестная ошибка, проверьте корректность запроса' });
    });
};

const readCards = (req, res) => {
  Card.find({})
    .orFail(() => {
      const error = new Error('Ни одной карточки, не нашлось');
      error.name = 'NotFound';
      throw error;
    })
    .then((card) => res.send(card))
    .catch((err) => {
      if (err.name === 'NotFound') {
        return res.status(404).send({ message: err.message });
      }

      return res.status(500).send({ message: 'Произошла неизвестная ошибка, проверьте корректность запроса' });
    });
};

const createIsLike = (req, res) => {
  Card.findByIdAndUpdate(req.params.cardId, { $addToSet: { likes: req.user._id } }, { new: true })
    .orFail(() => {
      const error = new Error(`Передан несуществующий _id [${req.params.cardId}] карточки.`);
      error.name = 'NotFound';
      throw error;
    })
    .then((putLikeCard) => res.send(putLikeCard.likes))
    .catch((err) => {
      if (err.name === 'CastError') {
        return res.status(400).send({ message: 'Переданы некорректные данные для постановки лайка.' });
      }

      if (err.name === 'NotFound') {
        return res.status(404).send({ message: err.message });
      }

      return res.status(500).send({ message: 'Произошла неизвестная ошибка, проверьте корректность запроса' });
    });
};

const deleteIsLike = (req, res) => {
  Card.findByIdAndUpdate(req.params.cardId, { $pull: { likes: req.user._id } }, { new: true })
    .orFail(() => {
      const error = new Error(`Передан несуществующий _id [${req.params.cardId}] карточки.`);
      error.name = 'NotFound';
      throw error;
    })
    .then((removedLikeCard) => res.send(removedLikeCard))
    .catch((err) => {
      if (err.name === 'CastError') {
        return res.status(400).send({ message: 'Переданы некорректные данные для постановки лайка.' });
      }

      if (err.name === 'NotFound') {
        return res.status(404).send({ message: err.message });
      }

      return res.status(500).send({ message: 'Произошла неизвестная ошибка, проверьте корректность запроса' });
    });
};

// Экспортируем "функций"
module.exports = {
  createCard,
  deleteCard,
  readCards,
  createIsLike,
  deleteIsLike,
};
