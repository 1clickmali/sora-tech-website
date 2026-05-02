const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const { login, register, getMe, logout, seedAdmin, emergencyAccess } = require('../controllers/authController');
const { protect } = require('../middleware/auth');
const { atLeast } = require('../middleware/role');

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

router.post('/login', (req, res, next) => {
  const loginLimiter = req.app.loginLimiter;
  loginLimiter(req, res, next);
}, validateLogin, handleValidationErrors, login);

router.post('/register', protect, atLeast('admin'), register);
router.post('/logout', protect, logout);
router.get('/me', protect, getMe);

// Endpoints de récupération — disponibles en dev OU quand ALLOW_SEED=true en prod
const seedEnabled = process.env.NODE_ENV === 'development' || process.env.ALLOW_SEED === 'true';
if (seedEnabled) {
  router.post('/seed-admin', seedAdmin);
  // emergency-access : crée OU réinitialise le mot de passe admin sans supprimer les données
  router.post('/emergency-access', emergencyAccess);
}

module.exports = router;
