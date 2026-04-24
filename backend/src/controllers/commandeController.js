const Commande = require('../models/Commande');
const Facture = require('../models/Facture');
const { generateCommandePDF } = require('../utils/pdf');
const { sendCommandeConfirmation, notifyAdminNewCommande } = require('../utils/email');
const { sendCommandeWhatsApp, sendCommandeAdminWhatsApp } = require('../utils/whatsapp');
const upsertContact = require('../utils/upsertContact');

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
        // 1. Générer PDF en mémoire (buffer — Railway filesystem éphémère)
        const { buffer: pdfBuffer, filename } = await generateCommandePDF(commande);
        await Commande.findByIdAndUpdate(commande._id, {
          $push: { timeline: { event: 'Facture PDF générée', by: 'Système' } },
        });

        // 2. Créer document Facture dans MongoDB
        let facturePublicToken = null;
        try {
          const factureItems = (commande.items || []).map(it => ({
            description: it.title || it.description || 'Article',
            quantity: it.quantity || 1,
            unitPrice: it.price || it.unitPrice || 0,
            total: (it.price || it.unitPrice || 0) * (it.quantity || 1),
          }));
          const facture = await Facture.create({
            commandeId: commande._id,
            commandeRef: commande.reference,
            trackingCode: commande.trackingCode,
            clientName: commande.clientName,
            clientEmail: commande.clientEmail || '',
            clientPhone: commande.clientPhone || '',
            clientAddress: commande.clientAddress || commande.address || '',
            clientQuartier: commande.clientQuartier || commande.quartier || '',
            items: factureItems,
            subtotal: commande.subtotal || commande.total || 0,
            deliveryFee: commande.deliveryFee || 0,
            total: commande.total || 0,
            paymentMode: commande.paymentMode || 'cod',
            paymentStatus: commande.paymentMode === 'online' ? 'payee' : 'impayee',
            paidAt: commande.paymentMode === 'online' ? new Date() : undefined,
            pdfFilename: filename,
            issuedAt: new Date(),
          });
          facturePublicToken = facture.publicToken;
          // Stocker le token public dans la commande pour y accéder facilement
          await Commande.findByIdAndUpdate(commande._id, { facturePublicToken: facture.publicToken });
        } catch (factureErr) {
          console.error('[Facture create]', factureErr.message);
        }

        // 2b. Upsert contact CRM
        await upsertContact({
          name: commande.clientName,
          email: commande.clientEmail,
          phone: commande.clientPhone,
          quartier: commande.clientQuartier || commande.quartier,
          address: commande.clientAddress || commande.address,
          source: 'commande',
          orderTotal: commande.total || 0,
        });

        // 3. Email au client avec PDF buffer en pièce jointe
        if (commande.clientEmail) {
          await sendCommandeConfirmation(commande, pdfBuffer, facturePublicToken).catch(e =>
            console.error('[Email client]', e.message)
          );
          await Commande.findByIdAndUpdate(commande._id, {
            $push: { timeline: { event: `Email de confirmation envoyé à ${commande.clientEmail}`, by: 'Système' } },
          });
        }

        // 4. Email à l'admin
        await notifyAdminNewCommande(commande).catch(e =>
          console.error('[Email admin]', e.message)
        );

        // 5. WhatsApp au client
        await sendCommandeWhatsApp(commande).catch(e =>
          console.error('[WhatsApp client]', e.message)
        );

        // 6. WhatsApp à l'admin
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
