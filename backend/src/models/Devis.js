const mongoose = require('mongoose');

const devisSchema = new mongoose.Schema({
  reference: { type: String, unique: true },
  clientName: { type: String, required: true },
  clientPhone: { type: String, required: true },
  clientEmail: { type: String, required: true },
  clientCompany: { type: String },
  serviceType: {
    type: String,
    enum: ['web', 'soft', 'app', 'erp', 'cyber', 'maint'],
    required: true,
  },
  complexity: { type: Number, min: 1, max: 3, default: 1 },
  modules: { type: Number, default: 3 },
  options: { type: Map, of: Boolean, default: {} },
  estimatedPrice: { type: Number },
  estimatedDays: { type: Number },
  rdvDate: { type: String },
  rdvSlot: { type: String },
  message: { type: String },
  status: {
    type: String,
    enum: ['nouveau', 'contacte', 'accepte', 'refuse', 'complete'],
    default: 'nouveau',
  },
  notes: { type: String },
  assignedTo: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
}, { timestamps: true });

devisSchema.pre('save', async function (next) {
  if (!this.reference) {
    const count = await this.constructor.countDocuments();
    this.reference = `DEV-${String(count + 1).padStart(4, '0')}-${Date.now().toString().slice(-4)}`;
  }
  next();
});

module.exports = mongoose.model('Devis', devisSchema);
