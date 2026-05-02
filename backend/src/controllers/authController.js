const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Générer un JWT — expiration courte pour plus de sécurité
const signToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '24h',
  });
};

// POST /api/auth/login
const login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ success: false, message: 'Email et mot de passe requis' });
  }

  try {
    const user = await User.findOne({ email }).select('+password');
    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({ success: false, message: 'Email ou mot de passe incorrect' });
    }

    if (!user.active) {
      return res.status(403).json({ success: false, message: 'Compte désactivé' });
    }

    const token = signToken(user._id);
    res.json({
      success: true,
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        avatar: user.avatar,
      },
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// POST /api/auth/register (admin seulement)
const register = async (req, res) => {
  const { name, email, phone, password, role } = req.body;

  try {
    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(400).json({ success: false, message: 'Email déjà utilisé' });
    }

    // Seul un super_admin peut créer un autre super_admin
    if (role === 'super_admin' && req.user?.role !== 'super_admin') {
      return res.status(403).json({ success: false, message: 'Seul un super_admin peut créer un super_admin' });
    }

    const user = await User.create({ name, email, phone, password, role: role || 'commercial' });
    const token = signToken(user._id);

    res.status(201).json({ success: true, token, user });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// GET /api/auth/me
const getMe = async (req, res) => {
  res.json({ success: true, user: req.user });
};

// POST /api/auth/seed-admin — crée le super admin si aucun utilisateur n'existe
// SÉCURITÉ: DISABLED en production, utiliser les variables d'environnement
const seedAdmin = async (req, res) => {
  try {
    if (process.env.NODE_ENV === 'production') {
      return res.status(403).json({ success: false, message: 'Endpoint non disponible en production' });
    }

    const count = await User.countDocuments();
    if (count > 0) {
      return res.status(400).json({ success: false, message: 'Des utilisateurs existent déjà' });
    }

    // Utiliser les variables d'environnement pour l'admin initial
    const adminEmail = process.env.SEED_ADMIN_EMAIL || 'admin@soratech.ci';
    const adminPassword = process.env.SEED_ADMIN_PASSWORD;

    if (!adminPassword) {
      return res.status(500).json({
        success: false,
        message: 'SEED_ADMIN_PASSWORD not configured. Set it in environment variables.',
      });
    }

    const admin = await User.create({
      name: 'Super Admin',
      email: adminEmail,
      password: adminPassword,
      role: 'super_admin',
      active: true,
    });

    res.json({
      success: true,
      message: `Admin created: ${adminEmail}`,
      user: { id: admin._id, email: admin.email, role: admin.role },
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

module.exports = { login, register, getMe, seedAdmin };
