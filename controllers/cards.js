const Card = require('../models/card');
const {
  OK,
  CREATED,
  BAD_REQUEST,
  NOT_FOUND,
  INTERNAL_SERVER_ERROR,
} = require('../constants');

const createCard = (req, res) => {
  const { name, link } = req.body;

  Card.create({ name, link, owner: req.user._id })
    .then((newCard) => res.status(CREATED).send(newCard))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return res.status(BAD_REQUEST).send({
          message: 'Переданы некорректные данные при создании карточки.',
        });
      }
      return res.status(INTERNAL_SERVER_ERROR).send({
        message: 'Произошла неизвестная ошибка, проверьте корректность запроса',
      });
    });
};

const deleteCard = (req, res) => {
  Card.findByIdAndRemove(req.params.cardId)
    .orFail(() => {
      const error = new Error(`Карточка с указанным _id [${req.params.cardId}] не найдена.`);
      error.name = 'NotFound';
      throw error;
    })
    .then(() => res.status(OK).send({ message: `Карточка ${req.params.cardId} - удалена` }))
    .catch((err) => {
      if (err.name === 'CastError') {
        return res.status(BAD_REQUEST).send({ message: 'Переданы некорректные данные при удаление карточки.' });
      }

      if (err.name === 'NotFound') {
        return res.status(NOT_FOUND).send({ message: err.message });
      }

      return res.status(INTERNAL_SERVER_ERROR).send({
        message: 'Произошла неизвестная ошибка, проверьте корректность запроса',
      });
    });
};

const readCards = (req, res) => {
  Card.find({})
    .populate(['owner', 'likes'])
    .then((card) => {
      res.status(OK).send(card);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        return res.status(BAD_REQUEST).send({ message: 'Переданы некорректные данные для получения карточек.' });
      }

      return res.status(INTERNAL_SERVER_ERROR).send({ message: 'Произошла неизвестная ошибка, проверьте корректность запроса' });
    });
};

const createIsLike = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    {
      $addToSet: { likes: req.user._id },
    },
    { new: true },
  )
    .populate('owner')
    .orFail(() => {
      const error = new Error(`Передан несуществующий _id [${req.params.cardId}] карточки.`);
      error.name = 'NotFound';
      throw error;
    })
    .then((putLikeCard) => res.status(OK).send(putLikeCard))
    .catch((err) => {
      if (err.name === 'CastError') {
        return res.status(BAD_REQUEST).send({ message: 'Переданы некорректные данные для постановки лайка.' });
      }

      if (err.name === 'NotFound') {
        return res.status(NOT_FOUND).send({ message: err.message });
      }

      return res.status(INTERNAL_SERVER_ERROR).send({ message: 'Произошла неизвестная ошибка, проверьте корректность запроса' });
    });
};

const deleteIsLike = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    {
      $pull: { likes: req.user._id },
    },
    { new: true },
  )
    .orFail(() => {
      const error = new Error(`Передан несуществующий _id [${req.params.cardId}] карточки.`);
      error.name = 'NotFound';
      throw error;
    })
    .then((removedLikeCard) => res.send(removedLikeCard))
    .catch((err) => {
      if (err.name === 'CastError') {
        return res.status(BAD_REQUEST).send({ message: 'Переданы некорректные данные для постановки лайка.' });
      }

      if (err.name === 'NotFound') {
        return res.status(NOT_FOUND).send({ message: err.message });
      }

      return res.status(INTERNAL_SERVER_ERROR).send({ message: 'Произошла неизвестная ошибка, проверьте корректность запроса' });
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
