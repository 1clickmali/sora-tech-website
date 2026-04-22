const mongoose = require('mongoose');
require('dotenv').config();

const connectDB = require('../config/database');
const User = require('../models/User');

const seed = async () => {
  await connectDB();

  const existing = await User.findOne({ email: 'admin@soratech.ci' });
  if (existing) {
    console.log('✅ Admin déjà existant — seed ignoré.');
    process.exit(0);
  }

  await User.create({
    name: 'Super Admin',
    email: 'admin@soratech.ci',
    password: 'admin123',
    role: 'super_admin',
    active: true,
  });

  console.log('✅ Admin créé : admin@soratech.ci / admin123');
  process.exit(0);
};

seed().catch(err => {
  console.error('❌ Seed échoué :', err.message);
  process.exit(1);
});
