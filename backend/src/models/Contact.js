const mongoose = require('mongoose');

const contactSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String },
  company: { type: String },
  service: { type: String },
  budget: { type: String },
  message: { type: String, required: true },
  status: {
    type: String,
    enum: ['nouveau', 'traite', 'archive'],
    default: 'nouveau',
  },
  notes: { type: String },
  assignedTo: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
}, { timestamps: true });

module.exports = mongoose.model('Contact', contactSchema);
