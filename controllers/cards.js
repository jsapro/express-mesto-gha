const Card = require('../models/card');

module.exports.getCards = (req, res) => {
  Card.find({})
    .populate(['name', 'link'])
    .then((cards) => res.send({ cards }))
    .catch((err) => {
      if (err.name === 'SomeErrorName') {
        return res.status(404).send({ message: 'Карточки не найдены' });
      }
      return res.status(500).send({ message: 'Ошибка по умолчанию' });
    });
};

module.exports.deleteCard = (req, res) => {
  Card.findByIdAndRemove(req.user._id)
    .then((deletedCard) => res.send(deletedCard))
    .catch((err) => {
      if (err.name === 'SomeErrorName') {
        return res
          .status(404)
          .send({ message: 'Карточка с указанным _id не найдена' });
      }
      return res.status(500).send({ message: 'Ошибка по умолчанию' });
    });
};

module.exports.createCard = (req, res) => {
  const { name, link } = req.body;
  const id = req.user._id;
  console.log(name, link, id);

  Card.create({ name, link, owner: id })
    .then((card) => res.send(card))
    .catch((err) => {
      if (err.name === 'SomeErrorName') {
        return res.status(400).send({
          message: 'Переданы некорректные данные при создании карточки',
        });
      }
      return res.status(500).send({ message: 'Ошибка по умолчанию' });
    });
};

module.exports.likeCard = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } }, // добавить _id в массив, если его там нет
    // eslint-disable-next-line comma-dangle
    { new: true }
  )
    .then((card) => res.send(card))
    .catch((err) => {
      if (err.name === 'SomeErrorName') {
        return res.status(400).send({
          message: 'Переданы некорректные данные для постановки/снятии лайка',
        });
      }
      return res.status(500).send({ message: 'Ошибка по умолчанию' });
    });
};

module.exports.dislikeCard = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } }, // убрать _id из массива
    // eslint-disable-next-line comma-dangle
    { new: true }
  )
    .then((card) => res.send(card))
    .catch((err) => {
      if (err.name === 'SomeErrorName') {
        return res.status(400).send({
          message: 'Переданы некорректные данные для постановки/снятии лайка',
        });
      }
      return res.status(500).send({ message: 'Ошибка по умолчанию' });
    });
};
