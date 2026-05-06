const crypto = require('crypto');
const mongoose = require('mongoose');
const Commande = require('../models/Commande');
const Facture = require('../models/Facture');
const Produit = require('../models/Produit');
const StockMovement = require('../models/StockMovement');
const { generateCommandePDF } = require('../utils/pdf');
const { sendCommandeConfirmation, notifyAdminNewCommande } = require('../utils/email');
const { sendCommandeWhatsApp, sendCommandeAdminWhatsApp } = require('../utils/whatsapp');
const upsertContact = require('../utils/upsertContact');
const {
  createHostedPayment,
  getPayment,
  isGeniusPayConfigured,
  mapGeniusPayStatus,
  verifyWebhookSignature,
} = require('../utils/geniuspay');

const FRONTEND_BASE_URL = process.env.FRONTEND_URL || process.env.NEXT_PUBLIC_SITE_URL || 'https://soratech.ci';
const FINAL_FAILED_PAYMENT_STATUSES = new Set(['failed', 'cancelled', 'expired']);

const stableSort = (value) => {
  if (Array.isArray(value)) return value.map(stableSort);
  if (!value || typeof value !== 'object') return value;

  return Object.keys(value)
    .sort()
    .reduce((acc, key) => {
      acc[key] = stableSort(value[key]);
      return acc;
    }, {});
};

const buildFingerprint = (payload) =>
  crypto.createHash('sha256').update(JSON.stringify(stableSort(payload))).digest('hex');

const normalizePhoneForPayment = (phone) => {
  const raw = String(phone || '').trim();
  if (!raw) return '';

  const digits = raw.replace(/\D/g, '');
  if (raw.startsWith('+')) return `+${digits}`;
  if (digits.startsWith('225')) return `+${digits}`;
  return `+225${digits}`;
};

const normalizeCommandeBody = (body = {}) => {
  const normalized = { ...body };
  if (!normalized.clientAddress && normalized.address) normalized.clientAddress = normalized.address;
  if (!normalized.clientQuartier && normalized.quartier) normalized.clientQuartier = normalized.quartier;
  return normalized;
};

const paymentTimelineLabel = (status) => {
  switch (status) {
    case 'pending':
      return 'Paiement initié, en attente de confirmation';
    case 'processing':
      return 'Paiement en cours de traitement';
    case 'paid':
      return 'Paiement confirmé par GeniusPay';
    case 'failed':
      return 'Paiement échoué';
    case 'cancelled':
      return 'Paiement annulé par le client';
    case 'expired':
      return 'Lien de paiement expiré';
    case 'refunded':
      return 'Paiement remboursé';
    default:
      return `Mise à jour paiement : ${status}`;
  }
};

const toPublicPaymentView = (commande) => ({
  reference: commande.reference,
  trackingCode: commande.trackingCode,
  trackingUrl: commande.trackingUrl,
  total: commande.total,
  status: commande.status,
  paymentMode: commande.paymentMode,
  paymentStatus: commande.paymentStatus,
  paymentProvider: commande.paymentProvider,
  paymentMethod: commande.paymentMethod,
  paymentReference: commande.paymentReference,
  paymentCheckoutUrl: commande.paymentCheckoutUrl,
  createdAt: commande.createdAt,
  facturePublicToken: commande.facturePublicToken,
});

const buildCommandeResponse = (commande, extra = {}) => ({
  success: true,
  data: commande,
  payment:
    commande.paymentMode === 'online'
      ? {
          provider: commande.paymentProvider || 'geniuspay',
          status: commande.paymentStatus,
          reference: commande.paymentReference,
          checkoutUrl: commande.paymentCheckoutUrl,
          returnToken: commande.paymentReturnToken,
        }
      : undefined,
  redirectUrl:
    commande.paymentMode === 'online' && ['pending', 'processing'].includes(commande.paymentStatus)
      ? commande.paymentCheckoutUrl
      : undefined,
  ...extra,
});

const reserveCommandeStock = async (commande, userName = 'Boutique') => {
  for (const item of commande.items || []) {
    if (!item.productId || item.digital) continue;
    if (!mongoose.isValidObjectId(item.productId)) continue;

    const product = await Produit.findById(item.productId);
    if (!product || product.stock < 0) continue;

    const qty = Number(item.quantity || 1);
    if (product.stock < qty) {
      throw new Error(`Stock insuffisant pour ${product.title}`);
    }

    const beforeStock = product.stock;
    const afterStock = beforeStock - qty;
    product.stock = afterStock;
    await product.save();

    await StockMovement.create({
      productId: product._id,
      type: 'sortie',
      quantity: qty,
      beforeStock,
      afterStock,
      unitCost: product.lastUnitCost || 0,
      reference: commande.reference,
      note: `Commande ${commande.reference}`,
      source: 'commande',
      commandeId: commande._id,
      createdByName: userName,
    });
  }
};

const releaseCommandeStock = async (commande, userName = 'Système paiement') => {
  if (commande.stockReleasedAt) return commande;

  for (const item of commande.items || []) {
    if (!item.productId || item.digital) continue;
    if (!mongoose.isValidObjectId(item.productId)) continue;

    const product = await Produit.findById(item.productId);
    if (!product) continue;

    const qty = Number(item.quantity || 1);
    const beforeStock = product.stock;
    const afterStock = beforeStock + qty;
    product.stock = afterStock;
    await product.save();

    await StockMovement.create({
      productId: product._id,
      type: 'retour',
      quantity: qty,
      beforeStock,
      afterStock,
      unitCost: product.lastUnitCost || 0,
      reference: commande.reference,
      note: `Libération du stock pour la commande ${commande.reference}`,
      source: 'commande',
      commandeId: commande._id,
      createdByName: userName,
    });
  }

  return Commande.findByIdAndUpdate(
    commande._id,
    {
      $set: { stockReleasedAt: new Date() },
      $push: { timeline: { event: 'Stock relâché automatiquement', by: userName } },
    },
    { new: true }
  );
};

const upsertFactureFromCommande = async (commande, pdfFilename) => {
  const factureItems = (commande.items || []).map((it) => ({
    description: it.title || it.description || 'Article',
    quantity: it.quantity || 1,
    unitPrice: it.price || it.unitPrice || 0,
    total: (it.price || it.unitPrice || 0) * (it.quantity || 1),
  }));

  const paymentStatus =
    commande.paymentStatus === 'paid' ? 'payee' : commande.status === 'annule' ? 'annulee' : 'impayee';

  const payload = {
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
    paymentStatus,
    paidAt: commande.paymentStatus === 'paid' ? commande.paymentCompletedAt || new Date() : undefined,
    pdfFilename,
    issuedAt: new Date(),
  };

  const existing = await Facture.findOne({ commandeId: commande._id });
  if (existing) {
    Object.assign(existing, payload);
    await existing.save();
    return existing;
  }

  return Facture.create(payload);
};

const runCommandePostProcessing = async (commandeId) => {
  const claimed = await Commande.findOneAndUpdate(
    { _id: commandeId, postProcessingDone: { $ne: true } },
    { $set: { postProcessingDone: true, postProcessingDoneAt: new Date() } },
    { new: true }
  );

  if (!claimed) return Commande.findById(commandeId);

  try {
    const { buffer: pdfBuffer, filename } = await generateCommandePDF(claimed);
    await Commande.findByIdAndUpdate(claimed._id, {
      $push: { timeline: { event: 'Facture PDF générée', by: 'Système' } },
    });

    const facture = await upsertFactureFromCommande(claimed, filename);
    await Commande.findByIdAndUpdate(claimed._id, { facturePublicToken: facture.publicToken });

    await upsertContact({
      name: claimed.clientName,
      email: claimed.clientEmail,
      phone: claimed.clientPhone,
      quartier: claimed.clientQuartier || claimed.quartier,
      address: claimed.clientAddress || claimed.address,
      source: 'commande',
      orderTotal: claimed.total || 0,
    });

    if (claimed.clientEmail) {
      await sendCommandeConfirmation(claimed, pdfBuffer, facture.publicToken).catch((error) =>
        console.error('[Email client]', error.message)
      );
      await Commande.findByIdAndUpdate(claimed._id, {
        $push: {
          timeline: { event: `Email de confirmation envoyé à ${claimed.clientEmail}`, by: 'Système' },
        },
      });
    }

    await notifyAdminNewCommande(claimed).catch((error) =>
      console.error('[Email admin]', error.message)
    );
    await sendCommandeWhatsApp(claimed).catch((error) =>
      console.error('[WhatsApp client]', error.message)
    );
    await sendCommandeAdminWhatsApp(claimed).catch((error) =>
      console.error('[WhatsApp admin]', error.message)
    );
  } catch (error) {
    console.error('[Commande post-processing]', error.message);
  }

  return Commande.findById(commandeId);
};

const ensureOnlineCheckout = async (commande) => {
  if (commande.paymentMode !== 'online') return commande;
  if (commande.paymentStatus === 'paid') return commande;
  if (FINAL_FAILED_PAYMENT_STATUSES.has(commande.paymentStatus)) return commande;

  if (commande.paymentReference && commande.paymentCheckoutUrl) {
    return commande;
  }

  if (!isGeniusPayConfigured()) {
    const error = new Error('Paiement GeniusPay non configuré sur le serveur');
    error.status = 503;
    throw error;
  }

  const amount = Math.round(Number(commande.total || 0));
  if (!amount || amount <= 0) {
    const error = new Error('Montant de paiement invalide');
    error.status = 400;
    throw error;
  }

  const paymentReturnToken = commande.paymentReturnToken || crypto.randomUUID();
  const successUrl = `${FRONTEND_BASE_URL}/paiement/retour?token=${paymentReturnToken}&status=success`;
  const errorUrl = `${FRONTEND_BASE_URL}/paiement/retour?token=${paymentReturnToken}&status=error`;

  let paymentResponse;
  try {
    paymentResponse = await createHostedPayment({
      amount,
      currency: 'XOF',
      description: `Commande ${commande.reference}`,
      customer: {
        name: commande.clientName,
        email: commande.clientEmail || undefined,
        phone: normalizePhoneForPayment(commande.clientPhone),
        country: 'CI',
      },
      success_url: successUrl,
      error_url: errorUrl,
      metadata: {
        order_db_id: String(commande._id),
        order_reference: commande.reference,
        tracking_code: commande.trackingCode || '',
      },
    });
  } catch (error) {
    error.status = error.status || 502;
    throw error;
  }

  const payment = paymentResponse?.data || paymentResponse || {};
  const checkoutUrl = payment.checkout_url || payment.checkoutUrl || payment.url || '';

  if (!payment.reference || !checkoutUrl) {
    const error = new Error('GeniusPay n’a pas retourné de lien de paiement valide');
    error.status = 502;
    throw error;
  }

  return Commande.findByIdAndUpdate(
    commande._id,
    {
      $set: {
        paymentProvider: 'geniuspay',
        paymentStatus: mapGeniusPayStatus(payment.status),
        paymentReference: payment.reference,
        paymentCheckoutUrl: checkoutUrl,
        paymentEnvironment: payment.environment || '',
        paymentReturnToken,
        paymentSyncedAt: new Date(),
        paymentErrorMessage: '',
      },
      $push: { timeline: { event: 'Lien de paiement GeniusPay généré', by: 'Système' } },
    },
    { new: true }
  );
};

const syncCommandePaymentState = async (commande, paymentSnapshot, source = 'provider') => {
  const nextStatus = mapGeniusPayStatus(paymentSnapshot.status);
  const currentStatus = commande.paymentStatus || (commande.paymentMode === 'online' ? 'pending' : 'unpaid');
  const update = {
    paymentProvider: paymentSnapshot.provider || commande.paymentProvider || 'geniuspay',
    paymentMethod: paymentSnapshot.paymentMethod || commande.paymentMethod || '',
    paymentStatus: nextStatus,
    paymentReference: paymentSnapshot.reference || commande.paymentReference || '',
    paymentEnvironment: paymentSnapshot.environment || commande.paymentEnvironment || '',
    paymentSyncedAt: new Date(),
    paymentLastEventId: paymentSnapshot.eventId || commande.paymentLastEventId || '',
    paymentLastWebhookDelivery: paymentSnapshot.webhookDelivery || commande.paymentLastWebhookDelivery || '',
    paymentErrorMessage: paymentSnapshot.errorMessage || '',
  };

  if (paymentSnapshot.checkoutUrl) {
    update.paymentCheckoutUrl = paymentSnapshot.checkoutUrl;
  }

  if (nextStatus === 'paid') {
    update.paymentCompletedAt = commande.paymentCompletedAt || new Date();
    if (commande.status === 'annule' && !commande.postProcessingDone) {
      update.status = 'nouveau';
    }
  }

  if (FINAL_FAILED_PAYMENT_STATUSES.has(nextStatus)) {
    update.status = 'annule';
  }

  const updateDoc = { $set: update };
  if (currentStatus !== nextStatus) {
    updateDoc.$push = {
      timeline: {
        event: `${paymentTimelineLabel(nextStatus)} (${source})`,
        by: 'Système',
      },
    };
  }

  let updated = await Commande.findByIdAndUpdate(commande._id, updateDoc, { new: true, runValidators: true });

  if (FINAL_FAILED_PAYMENT_STATUSES.has(nextStatus) && !updated.stockReleasedAt) {
    updated = await releaseCommandeStock(updated);
  }

  if (nextStatus === 'paid' && currentStatus !== 'paid') {
    updated = await runCommandePostProcessing(updated._id);
  }

  return updated;
};

const findCommandeForPaymentPayload = async (paymentData = {}) => {
  if (paymentData.reference) {
    const byPaymentReference = await Commande.findOne({ paymentReference: paymentData.reference });
    if (byPaymentReference) return byPaymentReference;
  }

  const metadata = paymentData.metadata || {};

  if (metadata.order_db_id && mongoose.isValidObjectId(metadata.order_db_id)) {
    const byId = await Commande.findById(metadata.order_db_id);
    if (byId) return byId;
  }

  if (metadata.order_reference) {
    const byReference = await Commande.findOne({ reference: metadata.order_reference });
    if (byReference) return byReference;
  }

  return null;
};

const getCommandePaymentReturn = async (req, res) => {
  try {
    const commande = await Commande.findOne({ paymentReturnToken: req.params.token });
    if (!commande) return res.status(404).json({ success: false, message: 'Paiement introuvable' });
    res.json({ success: true, data: toPublicPaymentView(commande) });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const refreshCommandePaymentPublic = async (req, res) => {
  try {
    const commande = await Commande.findOne({ paymentReturnToken: req.params.token });
    if (!commande) return res.status(404).json({ success: false, message: 'Paiement introuvable' });

    if (commande.paymentMode !== 'online' || !commande.paymentReference) {
      return res.json({ success: true, data: toPublicPaymentView(commande) });
    }

    if (!isGeniusPayConfigured()) {
      return res.status(503).json({ success: false, message: 'Paiement GeniusPay non configuré sur le serveur' });
    }

    const paymentResponse = await getPayment(commande.paymentReference);
    const payment = paymentResponse?.data || paymentResponse || {};
    const updated = await syncCommandePaymentState(
      commande,
      {
        status: payment.status,
        reference: payment.reference,
        paymentMethod: payment.payment_method,
        provider: 'geniuspay',
        environment: payment.environment,
        checkoutUrl: payment.checkout_url || payment.checkoutUrl || payment.url,
        errorMessage: payment.failure_reason || '',
      },
      'refresh'
    );

    res.json({ success: true, data: toPublicPaymentView(updated) });
  } catch (error) {
    res.status(502).json({ success: false, message: error.message || 'Impossible de vérifier le paiement' });
  }
};

const geniusPayWebhook = async (req, res) => {
  try {
    const webhookSecret = process.env.GENIUSPAY_WEBHOOK_SECRET;
    if (!webhookSecret) {
      return res.status(503).json({ success: false, message: 'GENIUSPAY_WEBHOOK_SECRET non configuré' });
    }

    const timestamp = req.get('X-Genius-Timestamp') || '';
    const signature = req.get('X-Genius-Signature') || '';
    const deliveryId = req.get('X-Webhook-Delivery') || '';
    const eventName = req.get('X-Webhook-Event') || req.body?.type || req.body?.event || '';
    const rawBody = req.rawBody || '';

    const timestampSeconds = Number(timestamp);
    if (!timestampSeconds || Math.abs(Math.floor(Date.now() / 1000) - timestampSeconds) > 300) {
      return res.status(400).json({ success: false, message: 'Webhook GeniusPay expiré' });
    }

    const isValidSignature = verifyWebhookSignature({
      rawBody,
      timestamp,
      signature,
      secret: webhookSecret,
    });

    if (!isValidSignature) {
      return res.status(401).json({ success: false, message: 'Signature webhook GeniusPay invalide' });
    }

    const paymentData = req.body?.data || req.body || {};
    const commande = await findCommandeForPaymentPayload(paymentData);

    if (!commande) {
      return res.status(202).json({ success: true, message: 'Webhook reçu, aucune commande correspondante trouvée' });
    }

    if (deliveryId && commande.paymentLastWebhookDelivery === deliveryId) {
      return res.json({ success: true, duplicate: true, data: toPublicPaymentView(commande) });
    }

    const updated = await syncCommandePaymentState(
      commande,
      {
        status: paymentData.status,
        reference: paymentData.reference,
        paymentMethod: paymentData.payment_method,
        provider: 'geniuspay',
        environment: paymentData.environment,
        checkoutUrl: paymentData.checkout_url || paymentData.checkoutUrl || paymentData.url,
        errorMessage: paymentData.failure_reason || '',
        eventId: eventName,
        webhookDelivery: deliveryId,
      },
      'webhook'
    );

    res.json({ success: true, data: toPublicPaymentView(updated) });
  } catch (error) {
    console.error('[Webhook GeniusPay]', error);
    res.status(500).json({ success: false, message: error.message || 'Erreur webhook GeniusPay' });
  }
};

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
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// GET /api/commandes/:id
const getCommande = async (req, res) => {
  try {
    const commande = await Commande.findById(req.params.id);
    if (!commande) return res.status(404).json({ success: false, message: 'Commande introuvable' });
    res.json({ success: true, data: commande });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// GET /api/commandes/tracking/:trackingCode  (public)
const getCommandeByTracking = async (req, res) => {
  try {
    const commande = await Commande.findOne({ trackingCode: req.params.trackingCode });
    if (!commande) return res.status(404).json({ success: false, message: 'Code de suivi introuvable' });
    res.json({ success: true, data: commande });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// POST /api/commandes  (publique)
const createCommande = async (req, res) => {
  const body = normalizeCommandeBody(req.body);
  const idempotencyKey = (req.get('Idempotency-Key') || body.clientRequestId || '').trim();
  const fingerprint = buildFingerprint({
    clientName: body.clientName || '',
    clientPhone: body.clientPhone || '',
    clientEmail: body.clientEmail || '',
    clientAddress: body.clientAddress || '',
    clientQuartier: body.clientQuartier || '',
    items: body.items || [],
    subtotal: body.subtotal || 0,
    deliveryFee: body.deliveryFee || 0,
    total: body.total || 0,
    paymentMode: body.paymentMode || 'online',
  });

  try {
    if (idempotencyKey) {
      const existing = await Commande.findOne({ clientRequestId: idempotencyKey });
      if (existing) {
        if (existing.idempotencyFingerprint && existing.idempotencyFingerprint !== fingerprint) {
          return res.status(409).json({
            success: false,
            message: 'Cette clé d’idempotence a déjà été utilisée pour une autre commande.',
          });
        }

        const hydrated = await ensureOnlineCheckout(existing);
        return res.status(200).json(buildCommandeResponse(hydrated, { idempotent: true }));
      }

      body.clientRequestId = idempotencyKey;
      body.idempotencyFingerprint = fingerprint;
    }

    body.paymentProvider = body.paymentMode === 'online' ? 'geniuspay' : '';
    body.paymentStatus = body.paymentMode === 'online' ? 'pending' : 'unpaid';
    if (body.paymentMode === 'online' && !body.paymentReturnToken) {
      body.paymentReturnToken = crypto.randomUUID();
    }

    const commande = await Commande.create(body);

    try {
      await reserveCommandeStock(commande);
      await Commande.findByIdAndUpdate(commande._id, {
        $set: { stockReservedAt: new Date() },
        $push: { timeline: { event: 'Stock réservé pour la commande', by: 'Système' } },
      });
    } catch (stockError) {
      await Commande.findByIdAndDelete(commande._id);
      throw stockError;
    }

    let persisted = await Commande.findById(commande._id);

    if (persisted.paymentMode === 'online') {
      persisted = await ensureOnlineCheckout(persisted);
    }

    res.status(201).json(buildCommandeResponse(persisted));

    if (persisted.paymentMode !== 'online') {
      setImmediate(() => {
        runCommandePostProcessing(persisted._id).catch((error) =>
          console.error('[Commande COD post-processing]', error.message)
        );
      });
    }
  } catch (error) {
    if (error?.code === 11000 && idempotencyKey) {
      const existing = await Commande.findOne({ clientRequestId: idempotencyKey });
      if (existing) {
        const hydrated = await ensureOnlineCheckout(existing);
        return res.status(200).json(buildCommandeResponse(hydrated, { idempotent: true }));
      }
    }

    res.status(error.status || 400).json({ success: false, message: error.message });
  }
};

// PATCH /api/commandes/:id
const updateCommande = async (req, res) => {
  try {
    const { status, ...rest } = req.body;
    const current = await Commande.findById(req.params.id);
    if (!current) return res.status(404).json({ success: false, message: 'Commande introuvable' });

    const update = { ...rest };
    if (status) {
      update.status = status;
      const labels = {
        confirme: "Commande confirmée par l'équipe",
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

    let commande = await Commande.findByIdAndUpdate(req.params.id, update, { new: true, runValidators: true });
    if (!commande) return res.status(404).json({ success: false, message: 'Commande introuvable' });

    if (status === 'annule' && commande.stockReservedAt && !commande.stockReleasedAt) {
      commande = await releaseCommandeStock(commande, req.user?.name || 'Admin');
    }

    res.json({ success: true, data: commande });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// DELETE /api/commandes/:id
const deleteCommande = async (req, res) => {
  try {
    await Commande.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Commande supprimée' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  createCommande,
  deleteCommande,
  geniusPayWebhook,
  getCommande,
  getCommandeByTracking,
  getCommandePaymentReturn,
  getCommandes,
  refreshCommandePaymentPublic,
  updateCommande,
};
