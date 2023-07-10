const router = require('express').Router();
const {
  getUsers,
  getUserById,
  updateUserInfo,
  updateUserAvatar,
  getCurrentUser,
} = require('../controllers/users');
const {
  validateUserId,
  validateUserInfo,
  validateUserAvatar,
} = require('../utils/celebrateValidation');

router.get('/', getUsers);

router.get('/me', validateUserInfo, getCurrentUser);

router.get('/:userId', validateUserId, getUserById);

router.patch('/me', validateUserInfo, updateUserInfo);

router.patch('/me/avatar', validateUserAvatar, updateUserAvatar);

module.exports = router;
