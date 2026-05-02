const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const { login, register, getMe, seedAdmin } = require('../controllers/authController');
const { protect } = require('../middleware/auth');
const { atLeast } = require('../middleware/role');

// Validation middleware for login
const validateLogin = [
  body('email').isEmail().normalizeEmail(),
  body('password').isLength({ min: 6 }).trim(),
];

const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ success: false, errors: errors.array() });
  }
  next();
};

router.post('/login', validateLogin, handleValidationErrors, login);
router.post('/register', protect, atLeast('admin'), register);

// SÉCURITÉ: seed-admin endpoint disabled en production
if (process.env.NODE_ENV === 'development') {
  router.post('/seed-admin', seedAdmin);
}

router.get('/me', protect, getMe);

module.exports = router;
