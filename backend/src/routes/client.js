const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const { authorize } = require('../middleware/role');
const Devis = require('../models/Devis');
const Commande = require('../models/Commande');
const { notifyAdmin } = require('../utils/email');

// Escape HTML to prevent injection in emails
const escHtml = (s) => String(s || '').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');

// Toutes les routes client nécessitent d'être authentifié avec le rôle 'client'
router.use(protect, authorize('client'));

// GET /api/client/devis — liste des devis du client connecté
router.get('/devis', async (req, res) => {
  try {
    const devis = await Devis.find({ clientEmail: req.user.email }).sort({ createdAt: -1 });
    res.json({ success: true, data: devis });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// GET /api/client/commandes — liste des commandes du client connecté
router.get('/commandes', async (req, res) => {
  try {
    const commandes = await Commande.find({ clientEmail: req.user.email }).sort({ createdAt: -1 });
    res.json({ success: true, data: commandes });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// PATCH /api/client/devis/:id/rdv — modifier le RDV (date, créneau, type)
router.patch('/devis/:id/rdv', async (req, res) => {
  try {
    const devis = await Devis.findOne({ _id: req.params.id, clientEmail: req.user.email });
    if (!devis) return res.status(404).json({ success: false, message: 'Devis introuvable' });
    if (['complete', 'refuse'].includes(devis.status)) {
      return res.status(400).json({ success: false, message: 'Ce devis ne peut plus être modifié' });
    }
    const { rdvDate, rdvSlot, rdvType } = req.body;
    if (rdvDate) devis.rdvDate = rdvDate;
    if (rdvSlot) devis.rdvSlot = rdvSlot;
    if (rdvType) devis.rdvType = rdvType;
    if (devis.status === 'accepte') devis.status = 'contacte'; // reset pour que l'admin reconfirme
    await devis.save();
    res.json({ success: true, data: devis });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
});

// DELETE /api/client/devis/:id — annuler un devis (seulement si pas encore accepté)
router.delete('/devis/:id', async (req, res) => {
  try {
    const devis = await Devis.findOne({ _id: req.params.id, clientEmail: req.user.email });
    if (!devis) return res.status(404).json({ success: false, message: 'Devis introuvable' });
    if (['accepte', 'complete'].includes(devis.status)) {
      return res.status(400).json({ success: false, message: 'Impossible d\'annuler un devis déjà accepté ou complété' });
    }
    devis.status = 'refuse';
    await devis.save();
    res.json({ success: true, message: 'Demande de devis annulée' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// POST /api/client/commandes/:id/refund — demander un remboursement (avant livraison)
router.post('/commandes/:id/refund', async (req, res) => {
  try {
    const commande = await Commande.findOne({ _id: req.params.id, clientEmail: req.user.email });
    if (!commande) return res.status(404).json({ success: false, message: 'Commande introuvable' });
    if (commande.status === 'livre') {
      return res.status(400).json({ success: false, message: 'Remboursement impossible après livraison' });
    }
    if (commande.status === 'annule') {
      return res.status(400).json({ success: false, message: 'Commande déjà annulée' });
    }
    if (commande.refundRequested) {
      return res.status(400).json({ success: false, message: 'Demande de remboursement déjà envoyée' });
    }
    const reason = String(req.body.reason || '').slice(0, 500);
    commande.refundRequested = true;
    commande.refundReason = reason;
    commande.refundRequestedAt = new Date();
    commande.timeline = [...(commande.timeline || []), {
      event: `Remboursement demandé par le client${reason ? ' : ' + reason : ''}`,
      by: req.user.name,
    }];
    await commande.save();

    notifyAdmin(
      `💸 Demande de remboursement — ${commande.reference}`,
      `<div class="info-card">
        <div class="label">Client</div><div class="value">${escHtml(commande.clientName)} — ${escHtml(commande.clientPhone)}</div>
        <div style="margin-top:6px" class="label">Commande</div><div class="value">${escHtml(commande.reference)}</div>
        <div style="margin-top:6px" class="label">Total</div><div class="value" style="color:#0099FF">${(commande.total || 0).toLocaleString('fr-FR')} FCFA</div>
        <div style="margin-top:6px" class="label">Statut actuel</div><div class="value">${escHtml(commande.status)}</div>
        ${reason ? `<div style="margin-top:6px" class="label">Raison</div><div class="value">${escHtml(reason)}</div>` : ''}
      </div>`
    ).catch(() => {});

    res.json({ success: true, message: 'Demande de remboursement enregistrée. L\'équipe vous contactera sous 24h.' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
