const router = require('express').Router();
const { login, createUser } = require('../controllers/users');
const auth = require('../middlewares/auth');
const cardsRoutes = require('./cards');
const usersRoutes = require('./users');
const NotFoundErr = require('../utils/errors/NotFoundErr');
const {
  validateLogin,
  validateRegister,
} = require('../utils/celebrateValidation');

router.post('/signin', validateLogin, login);
router.post('/signup', validateRegister, createUser);

router.use(auth);

router.use('/users', usersRoutes);
router.use('/cards', cardsRoutes);

router.use('*', (req, res, next) => {
  next(new NotFoundErr('Такой страницы не существует'));
});

module.exports = router;
