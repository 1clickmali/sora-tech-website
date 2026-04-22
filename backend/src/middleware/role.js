// Vérifier que l'utilisateur a l'un des rôles autorisés
const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ success: false, message: 'Non authentifié' });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: `Accès refusé — rôle requis : ${roles.join(', ')}`,
      });
    }

    next();
  };
};

// Hiérarchie des rôles (super_admin > admin > commercial/comptable)
const ROLE_HIERARCHY = {
  super_admin: 4,
  admin: 3,
  commercial: 2,
  comptable: 2,
};

const atLeast = (minRole) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ success: false, message: 'Non authentifié' });
    }

    const userLevel = ROLE_HIERARCHY[req.user.role] || 0;
    const requiredLevel = ROLE_HIERARCHY[minRole] || 0;

    if (userLevel < requiredLevel) {
      return res.status(403).json({ success: false, message: 'Permissions insuffisantes' });
    }

    next();
  };
};

module.exports = { authorize, atLeast };
