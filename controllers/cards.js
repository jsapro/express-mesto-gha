const Card = require('../models/card');

module.exports.getCards = (req, res) => {
  Card.find({})
    .populate(['name', 'link'])
    .then((cards) => res.send({ cards }))
    .catch((err) =>
      res.status(500).send({ message: `Ошибка getCards: ${err.message}` })
    );
};

module.exports.deleteCard = (req, res) => {
  Card.findByIdAndRemove(req.user._id)
    .then((deletedCard) => res.send(deletedCard))
    .catch((err) =>
      res.status(500).send({ message: `Ошибка deleteCard: ${err.message}` })
    );
};

module.exports.createCard = (req, res) => {
  const { name, link } = req.body;
  const id = req.user._id;
  console.log(name, link, id);

  Card.create({ name, link, owner: id })
    .then((card) => res.send({ card }))
    .catch((err) =>
      res.status(500).send({ message: `Ошибка createCard: ${err.message}` })
    );
};

module.exports.likeCard = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } }, // добавить _id в массив, если его там нет
    { new: true }
  )
    .then((card) => res.send(card))
    .catch((err) =>
      res.status(500).send({ message: `Ошибка likeCard: ${err.message}` })
    );
};

module.exports.dislikeCard = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } }, // убрать _id из массива
    { new: true }
  )
    .then((card) => res.send(card))
    .catch((err) =>
      res.status(500).send({ message: `Ошибка dislikeCard: ${err.message}` })
    );
};
