const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const { regexCheckUrl } = require('../utils/constants');
const { login, createUser } = require('../controllers/users');
const auth = require('../middlewares/auth');
const cardsRoutes = require('./cards');
const usersRoutes = require('./users');
const NotFoundErr = require('../utils/errors/NotFoundErr');

router.post(
  '/signin',
  celebrate({
    body: Joi.object().keys({
      email: Joi.string().email().required(),
      password: Joi.string().min(8).required(),
    }),
  }),
  login
);

router.post(
  '/signup',
  celebrate({
    body: Joi.object().keys({
      name: Joi.string().min(2).max(30),
      about: Joi.string().min(2).max(30),
      avatar: Joi.string().regex(regexCheckUrl),
      email: Joi.string().email().required().min(5),
      password: Joi.string().min(8).required(),
    }),
  }),
  createUser
);

router.use(auth);

router.use('/users', usersRoutes);
router.use('/cards', cardsRoutes);

router.use('*', (req, res, next) => {
  next(new NotFoundErr('Такой страницы не существует'));
});

module.exports = router;
