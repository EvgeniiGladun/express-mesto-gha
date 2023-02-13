const Card = require('../models/card');

const Forbidden = require('../errors/Forbidden');
const BadRequest = require('../errors/BadRequest');
const Unauthorized = require('../errors/Unauthorized');
const NotFoundError = require('../errors/NotFoundError');

const {
  OK,
  CREATED,
  OK_CARD_DELETE,
  NOT_FOUND_CARD_MESSAGE,
  NOT_FOUND_CARDID,
  BAD_REQUEST_MESSAGE,
  BAD_REQUEST_CARD_DELETE,
  BAD_REQUEST_PUT_LIKE,
  BAD_REQUEST_DEL_LIKE,
  UNAUTHORIZED_CARD,
} = require('../constants');

const createCard = (req, res, next) => {
  const { name, link } = req.body;

  Card.create({ name, link, owner: req.user._id })
    .then((newCard) => res.status(CREATED).send(newCard))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return next(new BadRequest(BAD_REQUEST_MESSAGE));
      }

      return next(err);
    });
};

const deleteCard = (req, res, next) => {
  Card.findById(req.params.cardId)
    .then((card) => {
      const userId = req.user._id;
      const ownerId = card ? card.owner.toString() : null;

      // Проверяем наличие ключа 'owner'
      if (ownerId === null) {
        return next(new NotFoundError(NOT_FOUND_CARD_MESSAGE));
      }

      // Проверяем на статус владельца
      if (userId !== ownerId) {
        return next(new Forbidden(UNAUTHORIZED_CARD));
      }

      return Card.findByIdAndRemove(req.params.cardId)
        .orFail(() => {
          throw new NotFoundError(NOT_FOUND_CARDID);
        })
        .then(() => res.status(OK).send({ message: OK_CARD_DELETE }))
        .catch((err) => {
          if (err.name === 'CastError') {
            return next(new Unauthorized(BAD_REQUEST_CARD_DELETE));
          }

          return next(err);
        });
    })
    .catch(next);
};

const readCards = (req, res, next) => {
  Card.find({})
    .populate(['owner', 'likes'])
    .then((card) => {
      res.status(OK).send(card);
    })
    .catch(next);
};

const createIsLike = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    {
      $addToSet: { likes: req.user._id },
    },
    { new: true },
  )
    .orFail(() => {
      throw new NotFoundError(NOT_FOUND_CARDID);
    })
    .populate(['owner', 'likes'])
    .then((putLikeCard) => res.status(OK).send(putLikeCard))
    .catch((err) => {
      if (err.name === 'CastError') {
        return next(new BadRequest(BAD_REQUEST_PUT_LIKE));
      }

      return next(err);
    });
};

const deleteIsLike = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    {
      $pull: { likes: req.user._id },
    },
    { new: true },
  )
    .orFail(() => {
      throw new NotFoundError(NOT_FOUND_CARDID);
    })
    .then((removedLikeCard) => res.send(removedLikeCard))
    .catch((err) => {
      if (err.name === 'CastError') {
        return next(new BadRequest(BAD_REQUEST_DEL_LIKE));
      }

      return next(err);
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
