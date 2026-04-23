const mongoose = require('mongoose');
const crypto = require('crypto');

const factureItemSchema = new mongoose.Schema({
  description: String,
  quantity: { type: Number, default: 1 },
  unitPrice: Number,
  total: Number,
}, { _id: false });

const factureSchema = new mongoose.Schema({
  numero: { type: String, unique: true },
  // Lien avec une commande (auto-généré)
  commandeId: { type: mongoose.Schema.Types.ObjectId, ref: 'Commande' },
  commandeRef: { type: String }, // ex: CMD-2025-0001
  trackingCode: { type: String },
  devisId: { type: mongoose.Schema.Types.ObjectId, ref: 'Devis' },
  // Client
  clientName: { type: String, required: true },
  clientEmail: { type: String },
  clientPhone: { type: String },
  clientAddress: { type: String },
  clientQuartier: { type: String },
  // Items
  items: [factureItemSchema],
  // Montants
  subtotal: { type: Number, required: true },
  deliveryFee: { type: Number, default: 0 },
  tva: { type: Number, default: 0 },
  tvaAmount: { type: Number, default: 0 },
  total: { type: Number, required: true },
  // Paiement
  paymentMode: { type: String, enum: ['cod', 'online', 'virement', 'autre'], default: 'cod' },
  paymentStatus: {
    type: String,
    enum: ['impayee', 'payee', 'annulee'],
    default: 'impayee',
  },
  paidAt: { type: Date },
  // PDF
  pdfPath: { type: String },
  pdfUrl: { type: String },
  pdfFilename: { type: String },
  // Divers
  notes: { type: String },
  echeance: { type: Date },
  issuedAt: { type: Date, default: Date.now },
  // Token public pour téléchargement sans auth (lien email client)
  publicToken: { type: String, unique: true, sparse: true, default: () => crypto.randomUUID() },
}, { timestamps: true });

factureSchema.pre('save', async function (next) {
  if (!this.numero) {
    const count = await this.constructor.countDocuments();
    const year = new Date().getFullYear();
    this.numero = `FACT-${year}-${String(count + 1).padStart(4, '0')}`;
  }
  next();
});

module.exports = mongoose.model('Facture', factureSchema);
