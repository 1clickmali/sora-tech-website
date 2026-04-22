const Devis = require('../models/Devis');
const { sendDevisConfirmation, notifyAdminNewDevis } = require('../utils/email');
const { sendDevisWhatsApp } = require('../utils/whatsapp');

const getDevis = async (req, res) => {
  try {
    const { status, search, page = 1, limit = 20 } = req.query;
    const query = {};
    if (status && status !== 'tous') query.status = status;
    if (search) {
      query.$or = [
        { clientName: { $regex: search, $options: 'i' } },
        { clientPhone: { $regex: search, $options: 'i' } },
        { clientEmail: { $regex: search, $options: 'i' } },
      ];
    }

    const total = await Devis.countDocuments(query);
    const devis = await Devis.find(query)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(Number(limit))
      .populate('assignedTo', 'name email');

    res.json({ success: true, data: devis, total, page: Number(page), pages: Math.ceil(total / limit) });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

const getOneDevis = async (req, res) => {
  try {
    const devis = await Devis.findById(req.params.id).populate('assignedTo', 'name email');
    if (!devis) return res.status(404).json({ success: false, message: 'Devis introuvable' });
    res.json({ success: true, data: devis });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

const createDevis = async (req, res) => {
  try {
    const devis = await Devis.create(req.body);

    sendDevisConfirmation(devis).catch(e => console.error('[Email client]', e.message));
    notifyAdminNewDevis(devis).catch(e => console.error('[Email admin]', e.message));
    sendDevisWhatsApp(devis).catch(e => console.error('[WhatsApp]', e.message));

    res.status(201).json({ success: true, data: devis });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

const updateDevis = async (req, res) => {
  try {
    const devis = await Devis.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!devis) return res.status(404).json({ success: false, message: 'Devis introuvable' });
    res.json({ success: true, data: devis });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

const deleteDevis = async (req, res) => {
  try {
    await Devis.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Devis supprimé' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

module.exports = { getDevis, getOneDevis, createDevis, updateDevis, deleteDevis };
