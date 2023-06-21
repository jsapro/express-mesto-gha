const User = require('../models/user');

module.exports.getUsers = (req, res) => {
  User.find({})
    .then((users) => res.send({ users }))
    .catch((err) => {
      if (err.name === 'SomeErrorName') {
        return res
          .status(404)
          .send({ message: 'Пользователи не найдены' });
      }
      return res
        .status(500)
        .send({ message: 'Ошибка по умолчанию' });
    });
};

module.exports.getUserById = (req, res) => {
  User.findById(req.params.userId)
    .then((user) => res.send({ user }))
    .catch((err) => {
      if (err.name === 'SomeErrorName') {
        return res
          .status(404)
          .send({ message: 'Пользователь по указанному _id не найден' });
      }
      return res
        .status(500)
        .send({ message: 'Ошибка по умолчанию' });
    });
};

module.exports.createUser = (req, res) => {
  const { name, about, avatar } = req.body;

  User.create({ name, about, avatar })
    .then((user) => res.send({ user }))
    .catch((err) => {
      if (err.name === 'SomeErrorName') {
        return res
          .status(400)
          .send({ message: 'Переданы некорректные данные при создании пользователя' });
      }
      return res
        .status(500)
        .send({ message: 'Ошибка по умолчанию' });
    });
};

module.exports.updateUserInfo = (req, res) => {
  const { name, about } = req.body;
  User.findByIdAndUpdate(req.user._id, { name, about }, { new: true })
    .then((user) => res.send(user))
    .catch((err) => {
      if (err.name === 'SomeErrorName') {
        return res
          .status(400)
          .send({ message: 'Переданы некорректные данные при обновлении профиля' });
      }
      return res
        .status(500)
        .send({ message: 'Ошибка по умолчанию' });
    });
};

module.exports.updateUserAvatar = (req, res) => {
  const { avatar } = req.body;
  User.findByIdAndUpdate(req.user._id, { avatar }, { new: true })
    .then((user) => res.send(user))
    .catch((err) => {
      if (err.name === 'SomeErrorName') {
        return res
          .status(400)
          .send({ message: 'Переданы некорректные данные при обновлении аватара' });
      }
      return res
        .status(500)
        .send({ message: 'Ошибка по умолчанию' });
    });
};
