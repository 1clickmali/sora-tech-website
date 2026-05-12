const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const { login, register, clientRegister, getMe, logout, seedAdmin, emergencyAccess } = require('../controllers/authController');
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

const validateClientRegister = [
  body('name').trim().isLength({ min: 2, max: 80 }).withMessage('Nom invalide (2–80 caractères)'),
  body('email').isEmail().normalizeEmail().withMessage('Email invalide'),
  body('password').isLength({ min: 8 }).withMessage('Mot de passe minimum 8 caractères'),
  body('phone').optional().trim().isLength({ max: 20 }),
];

router.post('/register', protect, atLeast('admin'), register);
router.post('/client-register', validateClientRegister, handleValidationErrors, clientRegister); // inscription publique client
router.post('/logout', protect, logout);
router.get('/me', protect, getMe);

// Endpoints de récupération — disponibles en dev OU quand ALLOW_SEED=true en prod
const seedEnabled = process.env.NODE_ENV === 'development' || process.env.ALLOW_SEED === 'true';
if (seedEnabled) {
  router.post('/seed-admin', seedAdmin);
  // emergency-access : crée OU réinitialise le mot de passe admin sans supprimer les données
  router.post('/emergency-access', emergencyAccess);

  // seed-catalog : insère 25 produits + 6 articles de blog (super_admin requis)
  router.post('/seed-catalog', protect, atLeast('super_admin'), async (req, res) => {
    try {
      const Produit = require('../models/Produit');
      const Article = require('../models/Article');
      const { PRODUITS, ARTICLES } = require('../scripts/seedCatalog');

      await Produit.deleteMany({});
      const produits = await Produit.insertMany(PRODUITS);

      let artInserted = 0;
      for (const art of ARTICLES) {
        const existing = await Article.findOne({ title: art.title });
        if (!existing) {
          const a = new Article(art);
          await a.save();
          artInserted++;
        }
      }

      res.json({
        success: true,
        message: `${produits.length} produits et ${artInserted} articles insérés.`,
      });
    } catch (err) {
      res.status(500).json({ success: false, message: err.message });
    }
  });
}

module.exports = router;
