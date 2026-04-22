const express = require('express');
const router = express.Router();
const { login, register, getMe } = require('../controllers/authController');
const { protect } = require('../middleware/auth');
const { atLeast } = require('../middleware/role');

router.post('/login', login);
router.post('/register', protect, atLeast('admin'), register);
router.get('/me', protect, getMe);

module.exports = router;
