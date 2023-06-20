const Card = require('../models/card');

module.exports.createCard = (req, res) => {
  const { name, link, owner } = req.body;
  const id = req.user._id;
  Card.create({ name, link, owner, id })
    .then(card => res.send({ card });
  console.log(req.user._id); // _id станет доступен
};

module.exports.getCards = (req, res) => {
  Card.find({})
    .then((cards) => res.send({ cards }))
    .catch((err) =>
      res.status(500).send({ message: `Ошибка getCards: ${err.message}` })
    );
};

module.exports.deleteCard = (req, res) => {
  Card.findById(req.user._id)
    .then((card) => console.log(`Удалить карточку №${card._id}`))
    .catch((err) =>
      res.status(500).send({ message: `Ошибка deleteCard: ${err.message}` })
    );
};

