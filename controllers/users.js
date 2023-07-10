const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const NotFoundErr = require('../utils/errors/NotFoundErr');
const BadRequestErr = require('../utils/errors/BadRequestErr');
const ConflictErr = require('../utils/errors/ConflictErr');
const { JWT_SECRET, NODE_ENV } = require('../utils/config');

module.exports.login = (req, res, next) => {
  const { email, password } = req.body;

  User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign(
        { _id: user._id },
        NODE_ENV === 'production' ? JWT_SECRET : 'key-for-token',
        {
          expiresIn: '7d',
        }
      );
      res.send({ token });
    })
    .catch(next);
};

module.exports.getUsers = (req, res, next) => {
  User.find({})
    .then((users) => res.send({ users }))
    .catch(next);
};

module.exports.getUserById = (req, res, next) => {
  User.findById(req.params.userId)
    .then((user) => {
      if (user) {
        return res.send({ user });
      }
      throw new NotFoundErr('Пользователь по указанному _id не найден');
    })
    .catch(next);
};

module.exports.createUser = (req, res, next) => {
  bcrypt
    .hash(req.body.password, 10)
    .then((hash) => {
      req.body.password = hash;

      return User.create(req.body);
    })
    .then((user) => {
      const { name, about, avatar, email } = user;
      res.status(201).send({
        name,
        about,
        avatar,
        email,
      });
      next();
    })
    .catch((err) => {
      if (err instanceof mongoose.Error.ValidationError) {
        next(
          new BadRequestErr(
            'Переданы некорректные данные при создании пользователя'
          )
        );
      } else if (err.code === 11000) {
        next(
          new ConflictErr('Пользователь с данным e-mail уже зарегистрирован')
        );
      } else {
        next(err);
      }
    });
};

// Надо закешировать через “Прозрачное кэширование” ???
const findAndUpdateUserData = (req, res, next, userData) => {
  User.findByIdAndUpdate(req.user._id, userData, {
    new: true,
    runValidators: true,
  })
    .then((user) => {
      if (user) {
        return res.send({ user });
      }
      return next(new NotFoundErr('Пользователь с указанным _id не найден'));
    })
    .catch((err) => {
      if (err instanceof mongoose.Error.ValidationError) {
        return next(
          new BadRequestErr(
            'Переданы некорректные данные при обновлении профиля'
          )
        );
      }
      return next(err);
    });
};

module.exports.updateUserInfo = (req, res, next) => {
  const { name, about } = req.body;
  findAndUpdateUserData(req, res, next, { name, about });
};

module.exports.updateUserAvatar = (req, res, next) => {
  const { avatar } = req.body;
  findAndUpdateUserData(req, res, next, { avatar });
};

module.exports.getCurrentUser = (req, res, next) => {
  User.findById(req.user._id)
    .orFail(new NotFoundErr('Пользователь по данному id не найден'))
    .then((user) => res.send(user))
    .catch(next);
};
