const mongoose = require('mongoose');

const projetSchema = new mongoose.Schema({
  title: { type: String, required: true },
  client: { type: String, required: true },
  description: { type: String, required: true },
  category: {
    type: String,
    enum: ['Site web', 'Logiciel', 'Application', 'ERP', 'Cybersécurité'],
    required: true,
  },
  results: [String],
  tech: [String],
  image: { type: String, default: '' },
  year: { type: String, default: () => new Date().getFullYear().toString() },
  featured: { type: Boolean, default: false },
  order: { type: Number, default: 0 },
}, { timestamps: true });

projetSchema.index({ order: 1, createdAt: -1 });
projetSchema.index({ featured: 1, order: 1 });

module.exports = mongoose.model('Projet', projetSchema);
