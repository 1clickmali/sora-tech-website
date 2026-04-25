const mongoose = require('mongoose');
const { PRODUCT_CATEGORIES, PRODUCT_SUBCATEGORIES } = require('../config/productCatalog');

const produitSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: Number, required: true },
  category: {
    type: String,
    enum: PRODUCT_CATEGORIES,
    required: true,
  },
  subcategory: {
    type: String,
    required: true,
    validate: {
      validator(value) {
        const allowed = PRODUCT_SUBCATEGORIES[this.category] || [];
        return allowed.includes(value);
      },
      message: 'Sous-catégorie invalide pour cette catégorie',
    },
  },
  features: [String],
  image: { type: String, default: '' },
  badge: { type: String },
  digital: { type: Boolean, default: true },
  stock: { type: Number, default: -1 }, // -1 = illimité
  lowStockThreshold: { type: Number, default: 5 },
  sku: { type: String, default: '' },
  supplier: { type: String, default: '' },
  lastUnitCost: { type: Number, default: 0 },
  lastRestockedAt: { type: Date },
  active: { type: Boolean, default: true },
  order: { type: Number, default: 0 },
}, { timestamps: true });

produitSchema.index({ active: 1, order: 1, createdAt: -1 });
produitSchema.index({ active: 1, category: 1 });
produitSchema.index({ active: 1, category: 1, subcategory: 1 });

module.exports = mongoose.model('Produit', produitSchema);
