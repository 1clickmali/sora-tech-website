const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/userController');
const { protect } = require('../middleware/auth');
const { atLeast } = require('../middleware/role');

router.get('/', protect, atLeast('admin'), ctrl.getUsers);
router.get('/:id', protect, atLeast('admin'), ctrl.getUser);
router.patch('/me/password', protect, ctrl.changePassword);
router.patch('/:id', protect, atLeast('admin'), ctrl.updateUser);
router.delete('/:id', protect, atLeast('super_admin'), ctrl.deleteUser);

module.exports = router;
