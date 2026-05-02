const express = require('express');
const cors = require('cors');
const compression = require('compression');
const cookieParser = require('cookie-parser');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const path = require('path');
const fs = require('fs');
require('dotenv').config();

const connectDB = require('./config/database');
const { verifyEmailConfig } = require('./utils/email');

const app = express();

// Connect to MongoDB
connectDB();

// Security: Helmet for HTTP headers
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", "'unsafe-inline'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      imgSrc: ["'self'", 'data:', 'https:'],
      connectSrc: ["'self'", process.env.FRONTEND_URL || 'https://soratech.ci'],
    },
  },
  frameguard: { action: 'deny' },
  noSniff: true,
  xssFilter: true,
  hsts: { maxAge: 31536000, includeSubDomains: true, preload: true },
}));

// Gzip all responses — reduces JSON payload size by ~70%
app.use(compression());

// Security: CORS with whitelist
const allowedOrigins = [
  'https://soratech.ci',
  'https://www.soratech.ci',
  'https://sora-tech-frontend-production.up.railway.app',
  'http://localhost:3000',
  'http://localhost:3001',
  // Production deployments
  ...(process.env.FRONTEND_URL ? [process.env.FRONTEND_URL] : []),
  // Allow *.vercel.app for Vercel deployments
  ...(process.env.NODE_ENV === 'production' ? ['https://sora-tech-website.vercel.app'] : []),
];

app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin) || /vercel\.app$/.test(origin)) {
      callback(null, true);
    } else {
      callback(new Error('CORS policy violation'));
    }
  },
  credentials: true,
  optionsSuccessStatus: 200,
  methods: ['GET', 'POST', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Cookie'],
  maxAge: 86400,
}));

// Security: Rate limiting
const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: 'Trop de requêtes, réessayez plus tard',
  standardHeaders: true,
  legacyHeaders: false,
});

const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  message: 'Trop de tentatives de connexion, réessayez dans 15 minutes',
  skipSuccessfulRequests: true,
});

app.use('/api/', generalLimiter);
app.use(express.json({ limit: '5mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Cache-Control headers for public GET endpoints
// Tells the browser (and Vercel CDN edge) to cache responses
app.use((req, res, next) => {
  if (req.method !== 'GET') return next();
  const pub = ['/api/produits', '/api/articles', '/api/projets'];
  const isPublic = pub.some(p => req.path.startsWith(p));
  if (isPublic && !req.headers.authorization) {
    // 5 min CDN cache, serves stale while revalidating for 10 min
    res.set('Cache-Control', 'public, s-maxage=300, stale-while-revalidate=600');
  } else {
    res.set('Cache-Control', 'private, no-store');
  }
  next();
});

// Static files (images produits, avatars — pas les PDFs qui sont servis via API)
const uploadsDir = path.join(__dirname, '../uploads');
if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir, { recursive: true });
app.use('/uploads', express.static(uploadsDir));

// Routes
app.use('/api/auth',      require('./routes/auth'));
app.use('/api/commandes', require('./routes/commandes'));
app.use('/api/devis',     require('./routes/devis'));
app.use('/api/contacts',  require('./routes/contacts'));
app.use('/api/produits',  require('./routes/produits'));
app.use('/api/stock',     require('./routes/stock'));
app.use('/api/articles',  require('./routes/articles'));
app.use('/api/projets',   require('./routes/projets'));
app.use('/api/factures',  require('./routes/factures'));
app.use('/api/stats',     require('./routes/stats'));
app.use('/api/users',     require('./routes/users'));
app.use('/api/upload',    require('./routes/upload'));

// Export loginLimiter for routes to use
app.loginLimiter = loginLimiter;

// Health check (ne pas exposer l'environnement)
app.get('/api/health', (req, res) => {
  res.json({ success: true, message: 'API operational', timestamp: new Date().toISOString() });
});

// 404
app.use((req, res) => {
  res.status(404).json({ success: false, message: 'Route introuvable' });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error('[ERROR]', err);
  res.status(err.status || 500).json({ success: false, message: err.message || 'Erreur serveur' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`\n🚀 SORA TECH API démarré sur http://localhost:${PORT}`);
  console.log(`   Environnement : ${process.env.NODE_ENV || 'development'}\n`);
  verifyEmailConfig();
});
