const { constants } = require('http2');
const User = require('../models/user');

module.exports.getUsers = (req, res) => {
  User.find({})
    .then((users) => {
      if (users) {
        return res.send({ users });
      }
      return res
        .status(constants.HTTP_STATUS_NOT_FOUND)
        .send({ message: 'Пользователи не найдены' });
    })
    .catch((err) =>
      res
        .status(constants.HTTP_STATUS_INTERNAL_SERVER_ERROR)
        .send({ message: 'Ошибка по умолчанию', error: err })
    );
};

module.exports.getUserById = (req, res) => {
  User.findById(req.params.userId)
    .then((user) => {
      if (user) {
        return res.send({ user });
      }
      return res
        .status(constants.HTTP_STATUS_NOT_FOUND)
        .send({ message: 'Пользователь по указанному _id не найден' });
    })
    .catch((err) => {
      if (err.name === 'ValidationError' || err.name === 'CastError') {
        return res.status(constants.HTTP_STATUS_BAD_REQUEST).send({
          message: 'Переданы некорректные данные для получения пользователя',
          error: err,
        });
      }
      return res
        .status(constants.HTTP_STATUS_INTERNAL_SERVER_ERROR)
        .send({ message: 'Ошибка по умолчанию', error: err });
    });
};

module.exports.createUser = (req, res) => {
  const { name, about, avatar } = req.body;

  User.create({ name, about, avatar })
    .then((user) => res.send({ user }))
    .catch((err) => {
      if (err.name === 'ValidationError' || err.name === 'CastError') {
        return res.status(constants.HTTP_STATUS_BAD_REQUEST).send({
          message: 'Переданы некорректные данные при создании пользователя',
          error: err,
        });
      }
      return res
        .status(constants.HTTP_STATUS_INTERNAL_SERVER_ERROR)
        .send({ message: 'Ошибка по умолчанию', error: err });
    });
};

module.exports.updateUserInfo = (req, res) => {
  const { name, about } = req.body;
  User.findByIdAndUpdate(
    req.user._id,
    { name, about },
    { new: true, runValidators: true }
  )
    .then((user) => {
      if (user) {
        return res.send({ user });
      }
      return res
        .status(constants.HTTP_STATUS_NOT_FOUND)
        .send({ message: 'Пользователь с указанным _id не найден' });
    })
    .catch((err) => {
      if (err.name === 'ValidationError' || err.name === 'CastError') {
        return res.status(constants.HTTP_STATUS_BAD_REQUEST).send({
          message: 'Переданы некорректные данные при обновлении профиля',
          error: err,
        });
      }
      return res
        .status(constants.HTTP_STATUS_INTERNAL_SERVER_ERROR)
        .send({ message: 'Ошибка по умолчанию', error: err });
    });
};

module.exports.updateUserAvatar = (req, res) => {
  const { avatar } = req.body;
  User.findByIdAndUpdate(
    req.user._id,
    { avatar },
    { new: true, runValidators: true }
  )
    .then((user) => {
      if (user) {
        return res.send({ user });
      }
      return res
        .status(constants.HTTP_STATUS_NOT_FOUND)
        .send({ message: 'Пользователь с указанным _id не найден' });
    })
    .catch((err) => {
      if (err.name === 'ValidationError' || err.name === 'CastError') {
        return res.status(constants.HTTP_STATUS_BAD_REQUEST).send({
          message: 'Переданы некорректные данные при обновлении аватара',
          error: err,
        });
      }
      return res
        .status(constants.HTTP_STATUS_INTERNAL_SERVER_ERROR)
        .send({ message: 'Ошибка по умолчанию', error: err });
    });
};
