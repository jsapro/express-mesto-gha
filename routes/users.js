const router = require('express').Router();
const { createUser, getUsers, getUserById, updateUserInfo } = require('../controllers/users');

router.get('/', getUsers);
router.get('/:userId', getUserById);
router.post('/', createUser);
router.patch('/me', updateUserInfo);
// router.patch('/me/avatar', updateUserAvatar);

module.exports = router;
