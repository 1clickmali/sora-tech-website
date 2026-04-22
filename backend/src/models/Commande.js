const mongoose = require('mongoose');

const itemSchema = new mongoose.Schema({
  productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Produit' },
  title: String,
  price: Number,
  quantity: { type: Number, default: 1 },
  digital: { type: Boolean, default: false },
}, { _id: false });

const commandeSchema = new mongoose.Schema({
  reference: { type: String, unique: true },
  clientName: { type: String, required: true },
  clientPhone: { type: String, required: true },
  clientEmail: { type: String },
  items: [itemSchema],
  subtotal: { type: Number, required: true },
  deliveryFee: { type: Number, default: 0 },
  total: { type: Number, required: true },
  paymentMode: { type: String, enum: ['online', 'cod'], required: true },
  quartier: { type: String },
  address: { type: String },
  status: {
    type: String,
    enum: ['nouveau', 'en_cours', 'livre', 'annule'],
    default: 'nouveau',
  },
  notes: { type: String },
}, { timestamps: true });

// Générer une référence unique avant sauvegarde
commandeSchema.pre('save', async function (next) {
  if (!this.reference) {
    const count = await this.constructor.countDocuments();
    this.reference = `CMD-${String(count + 1).padStart(4, '0')}-${Date.now().toString().slice(-4)}`;
  }
  next();
});

module.exports = mongoose.model('Commande', commandeSchema);
