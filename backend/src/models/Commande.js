const mongoose = require('mongoose');

const itemSchema = new mongoose.Schema({
  productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Produit' },
  title: { type: String },
  price: { type: Number },
  quantity: { type: Number, default: 1 },
  digital: { type: Boolean, default: false },
  image: { type: String },
}, { _id: false });

const timelineSchema = new mongoose.Schema({
  event: { type: String },
  by: { type: String, default: 'Système' },
  date: { type: Date, default: Date.now },
}, { _id: false });

const commandeSchema = new mongoose.Schema({
  reference: { type: String, unique: true },
  trackingCode: { type: String, unique: true, sparse: true },
  trackingUrl: { type: String },

  clientName: { type: String, required: true },
  clientPhone: { type: String, required: true },
  clientEmail: { type: String, default: '' },
  clientAddress: { type: String, default: '' },
  clientQuartier: { type: String, default: '' },

  // Rétro-compatibilité avec les anciens champs
  address: { type: String },
  quartier: { type: String },

  items: [itemSchema],
  subtotal: { type: Number, required: true },
  deliveryFee: { type: Number, default: 0 },
  total: { type: Number, required: true },

  paymentMode: { type: String, enum: ['online', 'cod'], required: true },
  paymentProvider: { type: String, default: '' },

  status: {
    type: String,
    enum: ['nouveau', 'confirme', 'en_cours', 'en_livraison', 'livre', 'annule'],
    default: 'nouveau',
  },

  notes: { type: String },
  invoicePath: { type: String },
  invoiceUrl: { type: String },

  timeline: [timelineSchema],
}, { timestamps: true });

// Génère référence + trackingCode avant la 1ère sauvegarde
commandeSchema.pre('save', async function (next) {
  if (!this.reference) {
    const count = await this.constructor.countDocuments();
    const year = new Date().getFullYear();
    const num = String(count + 1).padStart(4, '0');
    this.reference = `CMD-${year}-${num}`;
    this.trackingCode = `STC-${year}-${num}`;
    const base = process.env.FRONTEND_URL || 'https://soratech.ci';
    this.trackingUrl = `${base}/suivi/${this.trackingCode}`;
    this.timeline = [{ event: 'Commande reçue et enregistrée', by: 'Système' }];
  }

  // Normalise les anciens champs vers les nouveaux
  if (!this.clientAddress && this.address) this.clientAddress = this.address;
  if (!this.clientQuartier && this.quartier) this.clientQuartier = this.quartier;

  next();
});

module.exports = mongoose.model('Commande', commandeSchema);
