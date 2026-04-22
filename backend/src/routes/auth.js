const express = require('express');
const router = express.Router();
const { login, register, getMe, seedAdmin } = require('../controllers/authController');
const { protect } = require('../middleware/auth');
const { atLeast } = require('../middleware/role');

router.post('/login', login);
router.post('/register', protect, atLeast('admin'), register);
router.post('/seed-admin', seedAdmin);
router.get('/me', protect, getMe);

module.exports = router;
