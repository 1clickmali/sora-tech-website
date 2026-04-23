const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
require('dotenv').config();

const connectDB = require('./config/database');

const app = express();

// Connect to MongoDB
connectDB();

// Middleware
app.use(cors({
  origin: true,
  credentials: true,
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Static files for uploads
const uploadsDir = path.join(__dirname, '../uploads');
if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir, { recursive: true });
const facturesDir = path.join(uploadsDir, 'factures');
if (!fs.existsSync(facturesDir)) fs.mkdirSync(facturesDir, { recursive: true });
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
});
