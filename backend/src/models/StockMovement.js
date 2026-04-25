const mongoose = require('mongoose');

const stockMovementSchema = new mongoose.Schema({
  productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Produit', required: true },
  type: {
    type: String,
    enum: ['approvisionnement', 'sortie', 'ajustement', 'retour', 'perte'],
    required: true,
  },
  quantity: { type: Number, required: true, min: 0 },
  beforeStock: { type: Number, required: true },
  afterStock: { type: Number, required: true },
  unitCost: { type: Number, default: 0 },
  supplier: { type: String, default: '' },
  reference: { type: String, default: '' },
  note: { type: String, default: '' },
  source: {
    type: String,
    enum: ['admin', 'commande', 'systeme'],
    default: 'admin',
  },
  commandeId: { type: mongoose.Schema.Types.ObjectId, ref: 'Commande' },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  createdByName: { type: String, default: 'Système' },
}, { timestamps: true });

stockMovementSchema.index({ productId: 1, createdAt: -1 });
stockMovementSchema.index({ type: 1, createdAt: -1 });

module.exports = mongoose.model('StockMovement', stockMovementSchema);
