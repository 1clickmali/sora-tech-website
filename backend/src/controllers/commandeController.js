const Commande = require('../models/Commande');
const { sendCommandeConfirmation, notifyAdminNewCommande } = require('../utils/email');
const { sendCommandeWhatsApp } = require('../utils/whatsapp');

// GET /api/commandes
const getCommandes = async (req, res) => {
  try {
    const { status, search, page = 1, limit = 20 } = req.query;
    const query = {};
    if (status && status !== 'tous') query.status = status;
    if (search) {
      query.$or = [
        { clientName: { $regex: search, $options: 'i' } },
        { clientPhone: { $regex: search, $options: 'i' } },
        { reference: { $regex: search, $options: 'i' } },
      ];
    }

    const total = await Commande.countDocuments(query);
    const commandes = await Commande.find(query)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(Number(limit));

    res.json({ success: true, data: commandes, total, page: Number(page), pages: Math.ceil(total / limit) });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// GET /api/commandes/:id
const getCommande = async (req, res) => {
  try {
    const commande = await Commande.findById(req.params.id);
    if (!commande) return res.status(404).json({ success: false, message: 'Commande introuvable' });
    res.json({ success: true, data: commande });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// POST /api/commandes (publique)
const createCommande = async (req, res) => {
  try {
    const commande = await Commande.create(req.body);

    // Notifications asynchrones (ne bloquent pas la réponse)
    if (commande.clientEmail) {
      sendCommandeConfirmation(commande).catch(e => console.error('[Email client]', e.message));
    }
    notifyAdminNewCommande(commande).catch(e => console.error('[Email admin]', e.message));
    sendCommandeWhatsApp(commande).catch(e => console.error('[WhatsApp]', e.message));

    res.status(201).json({ success: true, data: commande });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

// PATCH /api/commandes/:id
const updateCommande = async (req, res) => {
  try {
    const commande = await Commande.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!commande) return res.status(404).json({ success: false, message: 'Commande introuvable' });
    res.json({ success: true, data: commande });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

// DELETE /api/commandes/:id
const deleteCommande = async (req, res) => {
  try {
    await Commande.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Commande supprimée' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

module.exports = { getCommandes, getCommande, createCommande, updateCommande, deleteCommande };
