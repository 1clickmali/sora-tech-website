const express = require('express');
const cors = require('cors');
const compression = require('compression');
const path = require('path');
const fs = require('fs');
require('dotenv').config();

const connectDB = require('./config/database');
const { verifyEmailConfig } = require('./utils/email');

const app = express();

// Connect to MongoDB
connectDB();

// Gzip all responses — reduces JSON payload size by ~70%
app.use(compression());

// Middleware
app.use(cors({
  origin: true,
  credentials: true,
}));
app.use(express.json({ limit: '5mb' }));
app.use(express.urlencoded({ extended: true }));

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
app.use('/api/articles',  require('./routes/articles'));
app.use('/api/projets',   require('./routes/projets'));
app.use('/api/factures',  require('./routes/factures'));
app.use('/api/stats',     require('./routes/stats'));
app.use('/api/users',     require('./routes/users'));

// Health check
app.get('/api/health', (req, res) => {
  res.json({ success: true, message: 'SORA TECH API running', env: process.env.NODE_ENV });
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
