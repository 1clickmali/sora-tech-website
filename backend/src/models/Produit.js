const mongoose = require('mongoose');

const produitSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: Number, required: true },
  category: {
    type: String,
    enum: ['Logiciels', 'Templates', 'Formations', 'Services'],
    required: true,
  },
  features: [String],
  image: { type: String, default: '' },
  badge: { type: String },
  digital: { type: Boolean, default: true },
  stock: { type: Number, default: -1 }, // -1 = illimité
  active: { type: Boolean, default: true },
  order: { type: Number, default: 0 },
}, { timestamps: true });

module.exports = mongoose.model('Produit', produitSchema);
