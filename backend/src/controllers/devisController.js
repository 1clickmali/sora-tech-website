const Devis = require('../models/Devis');
const { sendDevisConfirmation, sendRdvAccepteEmail, notifyAdminNewDevis } = require('../utils/email');
const { sendDevisWhatsApp } = require('../utils/whatsapp');
const upsertContact = require('../utils/upsertContact');

// Escape user input before using in MongoDB $regex to prevent ReDoS
const escapeRegex = (str) => String(str || '').replace(/[.*+?^${}()|[\]\\]/g, '\\$&').slice(0, 100);

const getDevis = async (req, res) => {
  try {
    const { status, search, page = 1, limit = 20 } = req.query;
    const query = {};
    if (status && status !== 'tous') query.status = status;
    if (search) {
      const safe = escapeRegex(search);
      query.$or = [
        { clientName: { $regex: safe, $options: 'i' } },
        { clientPhone: { $regex: safe, $options: 'i' } },
        { clientEmail: { $regex: safe, $options: 'i' } },
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

// Public fields accepted from the devis form — prevents mass assignment
const DEVIS_PUBLIC_FIELDS = [
  'clientName', 'clientEmail', 'clientPhone', 'clientCompany',
  'serviceType', 'complexity', 'modules', 'options',
  'estimatedPrice', 'estimatedDays',
  'rdvDate', 'rdvSlot', 'rdvType', 'message',
];

const createDevis = async (req, res) => {
  try {
    const payload = {};
    for (const key of DEVIS_PUBLIC_FIELDS) {
      if (req.body[key] !== undefined) payload[key] = req.body[key];
    }

    if (!payload.clientName || !payload.clientEmail || !payload.clientPhone || !payload.serviceType) {
      return res.status(400).json({ success: false, message: 'Nom, email, téléphone et type de service requis' });
    }

    const devis = await Devis.create(payload);

    sendDevisConfirmation(devis).catch(e => console.error('[Email client]', e.message));
    notifyAdminNewDevis(devis).catch(e => console.error('[Email admin]', e.message));
    sendDevisWhatsApp(devis).catch(e => console.error('[WhatsApp]', e.message));
    upsertContact({
      name: devis.clientName,
      email: devis.clientEmail,
      phone: devis.clientPhone,
      source: 'devis',
    }).catch(e => console.error('[upsertContact devis]', e.message));

    res.status(201).json({ success: true, data: devis });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

// Admin-editable fields for PATCH — prevents mass assignment of internal fields
const DEVIS_ADMIN_FIELDS = new Set(['status', 'notes', 'rdvDate', 'rdvSlot', 'rdvType', 'assignedTo', 'budget', 'message']);

const updateDevis = async (req, res) => {
  try {
    const old = await Devis.findById(req.params.id);
    if (!old) return res.status(404).json({ success: false, message: 'Devis introuvable' });

    const update = {};
    for (const key of Object.keys(req.body)) {
      if (DEVIS_ADMIN_FIELDS.has(key)) update[key] = req.body[key];
    }

    const devis = await Devis.findByIdAndUpdate(req.params.id, update, { new: true, runValidators: true });
    if (update.status === 'accepte' && old.status !== 'accepte') {
      sendRdvAccepteEmail(devis).catch(e => console.error('[Email RDV accepte]', e.message));
    }
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
