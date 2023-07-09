const Card = require('../models/card');
const NotFoundErr = require('../utils/errors/NotFoundErr');
const BadRequestErr = require('../utils/errors/BadRequestErr');
const ForbiddenErr = require('../utils/errors/ForbiddenErr');

module.exports.getCards = (req, res, next) => {
  Card.find({})
    .then((cards) => res.send({ cards }))
    .catch(next);
};

module.exports.deleteCard = (req, res, next) => {
  Card.findById(req.params.cardId)
    .orFail(new NotFoundErr('Карточка с указанным _id не найдена'))
    .then((card) => {
      if (card.owner.toString() !== req.user._id) {
        return next(new ForbiddenErr('Удалять можно только свои карточки'));
      }
      return card.deleteOne().then(() => res.send(card));
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        return new BadRequestErr(
          'Переданы некорректные данные для получения карточки',
        );
      }
      return next(err);
    });
};

module.exports.createCard = (req, res, next) => {
  const { name, link } = req.body;
  const id = req.user._id;

  Card.create({ name, link, owner: id })
    .then((card) => res.send(card))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return next(
          new BadRequestErr(
            'Переданы некорректные данные при создании карточки',
          ),
        );
      }
      return next(err);
    });
};

module.exports.likeCard = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } }, // добавить _id в массив, если его там нет
    // eslint-disable-next-line comma-dangle
    { new: true }
  )
    .populate('owner')
    .then((card) => {
      if (card) {
        return res.send({ card });
      }
      return next(new NotFoundErr('Передан несуществующий _id карточки'));
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        return next(
          new BadRequestErr(
            'Переданы некорректные данные для постановки/снятии лайка',
          ),
        );
      }
      return next(err);
    });
};

module.exports.dislikeCard = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } }, // убрать _id из массива
    // eslint-disable-next-line comma-dangle
    { new: true }
  )
    .then((card) => {
      if (card) {
        return res.send({ card });
      }
      return next(new NotFoundErr('Передан несуществующий _id карточки'));
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        return next(
          new BadRequestErr(
            'Переданы некорректные данные для постановки/снятии лайка',
          ),
        );
      }
      return next(err);
    });
};

// CastError - возникает, если передан невалидный ID
// — идентификаторы в MongoDB имеют определенную структуру.
// Обычно эта ошибка возникает при любых манипуляциях, где используется ID — поиск, удаление и др.
// после аутентификации можно гарантировать, что ID пользователя валидный

// ValidationError - ошибка валидации на стороне БД
// возникает при передаче невалидных даных(любых, за исключением ID)
// если данные не соответствуют схеме, которая описана для модели.
// обычно возникает при создании объекта или его обновления.
