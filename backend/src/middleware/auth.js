const jwt = require('jsonwebtoken');
const User = require('../models/User');

function getToken(req) {
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer ')) {
    return req.headers.authorization.split(' ')[1];
  }
  if (req.cookies && req.cookies.token) {
    return req.cookies.token;
  }
  return null;
}

async function getUserFromToken(token) {
  const decoded = jwt.verify(token, process.env.JWT_SECRET);
  return User.findById(decoded.id).select('-password');
}

// Vérifier le JWT et charger l'utilisateur
const protect = async (req, res, next) => {
  const token = getToken(req);
  if (!token) {
    return res.status(401).json({ success: false, message: 'Non autorisé — token manquant' });
  }

  try {
    req.user = await getUserFromToken(token);

    if (!req.user || !req.user.active) {
      return res.status(401).json({ success: false, message: 'Compte inactif ou supprimé' });
    }

    next();
  } catch (err) {
    return res.status(401).json({ success: false, message: 'Token invalide ou expiré' });
  }
};

const optionalProtect = async (req, res, next) => {
  const token = getToken(req);

  if (!token) {
    return next();
  }

  try {
    const user = await getUserFromToken(token);
    if (user && user.active) {
      req.user = user;
    }
  } catch (err) {
    req.user = null;
  }

  next();
};

module.exports = { protect, optionalProtect };
