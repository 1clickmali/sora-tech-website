const jwt = require('jsonwebtoken');
const User = require('../models/User');

const signToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '24h',
  });
};

// Le proxy Next.js (soratech.ci/api → Railway) fait que le cookie est always same-origin
// SameSite=Lax est suffisant et plus sécurisé que None
function cookieOptions() {
  const isProd = process.env.NODE_ENV === 'production';
  return {
    httpOnly: true,
    secure: isProd,
    sameSite: 'lax',
    maxAge: 24 * 60 * 60 * 1000, // 24h
  };
}

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
    res.cookie('token', token, cookieOptions());
    res.json({
      success: true,
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

    if (role === 'super_admin' && req.user?.role !== 'super_admin') {
      return res.status(403).json({ success: false, message: 'Seul un super_admin peut créer un super_admin' });
    }

    const user = await User.create({ name, email, phone, password, role: role || 'commercial' });
    const token = signToken(user._id);

    res.cookie('token', token, cookieOptions());
    res.status(201).json({ success: true, user });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// GET /api/auth/me
const getMe = async (req, res) => {
  res.json({ success: true, user: req.user });
};

// POST /api/auth/logout
const logout = (req, res) => {
  const isProd = process.env.NODE_ENV === 'production';
  res.clearCookie('token', {
    httpOnly: true,
    secure: isProd,
    sameSite: 'lax',
  });
  res.json({ success: true, message: 'Déconnecté avec succès' });
};

// POST /api/auth/seed-admin — crée le super admin si aucun utilisateur n'existe
// Disponible en développement OU quand ALLOW_SEED=true en production
const seedAdmin = async (req, res) => {
  try {
    const count = await User.countDocuments();
    if (count > 0) {
      return res.status(400).json({ success: false, message: 'Des utilisateurs existent déjà — utilisez /emergency-access pour réinitialiser' });
    }

    const adminEmail = process.env.SEED_ADMIN_EMAIL || 'admin@soratech.ci';
    const adminPassword = process.env.SEED_ADMIN_PASSWORD;

    if (!adminPassword) {
      return res.status(500).json({
        success: false,
        message: 'SEED_ADMIN_PASSWORD non configuré. Ajoutez-le dans les variables Railway.',
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
      message: `Admin créé : ${adminEmail}`,
      user: { id: admin._id, email: admin.email, role: admin.role },
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// POST /api/auth/emergency-access — crée OU réinitialise le mot de passe admin
// Uniquement disponible quand ALLOW_SEED=true (variable Railway à retirer après usage)
const emergencyAccess = async (req, res) => {
  try {
    const adminEmail = process.env.SEED_ADMIN_EMAIL || 'admin@soratech.ci';
    const adminPassword = process.env.SEED_ADMIN_PASSWORD;

    if (!adminPassword) {
      return res.status(500).json({
        success: false,
        message: 'SEED_ADMIN_PASSWORD non configuré dans Railway.',
      });
    }

    let admin = await User.findOne({ email: adminEmail }).select('+password');

    if (!admin) {
      admin = await User.create({
        name: 'Super Admin',
        email: adminEmail,
        password: adminPassword,
        role: 'super_admin',
        active: true,
      });
      return res.json({ success: true, action: 'created', message: `Admin créé : ${adminEmail}` });
    }

    admin.password = adminPassword;
    admin.active = true;
    admin.role = 'super_admin';
    await admin.save();

    return res.json({ success: true, action: 'reset', message: `Mot de passe réinitialisé : ${adminEmail}` });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

module.exports = { login, register, getMe, logout, seedAdmin, emergencyAccess };
