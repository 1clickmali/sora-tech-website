const mongoose = require('mongoose');

const contactSchema = new mongoose.Schema({
  // Contact form fields
  name: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String },
  company: { type: String },
  service: { type: String },
  budget: { type: String },
  message: { type: String },
  status: {
    type: String,
    enum: ['nouveau', 'traite', 'archive'],
    default: 'nouveau',
  },
  notes: { type: String },
  assignedTo: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },

  // CRM fields (auto-populated from commandes/devis)
  source: {
    type: String,
    enum: ['contact_form', 'commande', 'devis', 'manual'],
    default: 'contact_form',
  },
  clientStatus: {
    type: String,
    enum: ['lead', 'client', 'vip', 'inactif'],
    default: 'lead',
  },
  quartier: { type: String },
  address: { type: String },
  totalOrders: { type: Number, default: 0 },
  totalSpent: { type: Number, default: 0 },
  lastOrderDate: { type: Date },
  tags: [{ type: String }],
}, { timestamps: true });

// Email unique index (for upsert)
contactSchema.index({ email: 1 }, { sparse: true });
contactSchema.index({ phone: 1 }, { sparse: true });

module.exports = mongoose.model('Contact', contactSchema);
