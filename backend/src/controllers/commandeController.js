const Commande = require('../models/Commande');
const { generateCommandePDF } = require('../utils/pdf');
const { sendCommandeConfirmation, notifyAdminNewCommande } = require('../utils/email');
const { sendCommandeWhatsApp, sendCommandeAdminWhatsApp } = require('../utils/whatsapp');

// GET /api/commandes
const getCommandes = async (req, res) => {
  try {
    const { status, search, page = 1, limit = 50 } = req.query;
    const query = {};
    if (status && status !== 'tous') query.status = status;
    if (search) {
      query.$or = [
        { clientName: { $regex: search, $options: 'i' } },
        { clientPhone: { $regex: search, $options: 'i' } },
        { clientEmail: { $regex: search, $options: 'i' } },
        { reference: { $regex: search, $options: 'i' } },
        { trackingCode: { $regex: search, $options: 'i' } },
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

// GET /api/commandes/tracking/:trackingCode  (public)
const getCommandeByTracking = async (req, res) => {
  try {
    const commande = await Commande.findOne({ trackingCode: req.params.trackingCode });
    if (!commande) return res.status(404).json({ success: false, message: 'Code de suivi introuvable' });
    res.json({ success: true, data: commande });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// POST /api/commandes  (publique)
const createCommande = async (req, res) => {
  try {
    // Normalise les anciens noms de champs envoyés par le frontend
    const body = { ...req.body };
    if (!body.clientAddress && body.address) body.clientAddress = body.address;
    if (!body.clientQuartier && body.quartier) body.clientQuartier = body.quartier;

    const commande = await Commande.create(body);

    // Répondre immédiatement au client
    res.status(201).json({ success: true, data: commande });

    // Tâches asynchrones (ne bloquent pas la réponse)
    setImmediate(async () => {
      try {
        // 1. Générer PDF facture
        const { filepath, filename } = await generateCommandePDF(commande);
        await Commande.findByIdAndUpdate(commande._id, {
          invoicePath: filepath,
          invoiceUrl: `/uploads/factures/${filename}`,
          $push: { timeline: { event: 'Facture PDF générée', by: 'Système' } },
        });

        // 2. Email au client avec PDF
        if (commande.clientEmail) {
          await sendCommandeConfirmation(commande, filepath).catch(e =>
            console.error('[Email client]', e.message)
          );
          await Commande.findByIdAndUpdate(commande._id, {
            $push: { timeline: { event: `Email de confirmation envoyé à ${commande.clientEmail}`, by: 'Système' } },
          });
        }

        // 3. Email à l'admin
        await notifyAdminNewCommande(commande).catch(e =>
          console.error('[Email admin]', e.message)
        );

        // 4. WhatsApp au client
        await sendCommandeWhatsApp(commande).catch(e =>
          console.error('[WhatsApp client]', e.message)
        );

        // 5. WhatsApp à l'admin
        await sendCommandeAdminWhatsApp(commande).catch(e =>
          console.error('[WhatsApp admin]', e.message)
        );

      } catch (e) {
        console.error('[Commande post-processing]', e.message);
      }
    });

  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

// PATCH /api/commandes/:id
const updateCommande = async (req, res) => {
  try {
    const { status, ...rest } = req.body;

    // Ajouter événement timeline si le status change
    const update = { ...rest };
    if (status) {
      update.status = status;
      const labels = {
        confirme: 'Commande confirmée par l\'équipe',
        en_livraison: 'Commande prise en charge par le livreur',
        livre: 'Commande livrée au client',
        annule: 'Commande annulée',
      };
      update.$push = {
        timeline: {
          event: labels[status] || `Statut changé : ${status}`,
          by: req.user?.name || 'Admin',
        },
      };
    }

    const commande = await Commande.findByIdAndUpdate(req.params.id, update, { new: true, runValidators: true });
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

module.exports = { getCommandes, getCommande, getCommandeByTracking, createCommande, updateCommande, deleteCommande };
