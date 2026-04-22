const mongoose = require('mongoose');

const factureItemSchema = new mongoose.Schema({
  description: String,
  quantity: { type: Number, default: 1 },
  unitPrice: Number,
  total: Number,
}, { _id: false });

const factureSchema = new mongoose.Schema({
  numero: { type: String, unique: true },
  clientName: { type: String, required: true },
  clientEmail: { type: String },
  clientPhone: { type: String },
  clientAddress: { type: String },
  items: [factureItemSchema],
  subtotal: { type: Number, required: true },
  tva: { type: Number, default: 0 }, // % TVA
  tvaAmount: { type: Number, default: 0 },
  total: { type: Number, required: true },
  status: {
    type: String,
    enum: ['impayee', 'payee', 'annulee'],
    default: 'impayee',
  },
  pdfUrl: { type: String },
  commandeId: { type: mongoose.Schema.Types.ObjectId, ref: 'Commande' },
  devisId: { type: mongoose.Schema.Types.ObjectId, ref: 'Devis' },
  notes: { type: String },
  echeance: { type: Date },
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
