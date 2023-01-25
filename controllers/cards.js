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
  BAD_REQUEST_CARD_GET,
  BAD_REQUEST_PUT_LIKE,
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

      return next;
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

          if (err.name === 'NotFound') {
            return next(new NotFoundError(NOT_FOUND_CARDID));
          }

          return next;
        });
    });
};

const readCards = (req, res, next) => {
  Card.find({})
    .populate(['owner', 'likes'])
    .then((card) => {
      res.status(OK).send(card);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        return next(new BadRequest(BAD_REQUEST_CARD_GET));
      }

      return next;
    });
};

const createIsLike = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    {
      $addToSet: { likes: req.user._id },
    },
    { new: true },
  )
    .populate('owner')
    .orFail(() => {
      throw new NotFoundError(NOT_FOUND_CARDID);
    })
    .then((putLikeCard) => res.status(OK).send(putLikeCard))
    .catch((err) => {
      if (err.name === 'CastError') {
        return next(new BadRequest(BAD_REQUEST_PUT_LIKE));
      }

      if (err.name === 'NotFound') {
        return next(new NotFoundError(NOT_FOUND_CARD_MESSAGE));
      }

      return next;
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
        return next(BadRequest(BAD_REQUEST_PUT_LIKE));
      }

      if (err.name === 'NotFound') {
        return next(new NotFoundError(NOT_FOUND_CARD_MESSAGE));
      }

      return next;
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
