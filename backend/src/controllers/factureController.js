const Facture = require('../models/Facture');
const { generateFacturePDF } = require('../utils/pdf');
const path = require('path');
const fs = require('fs');

const getFactures = async (req, res) => {
  try {
    const { status, search, page = 1, limit = 20 } = req.query;
    const query = {};
    if (status && status !== 'tous') query.status = status;
    if (search) {
      query.$or = [
        { numero: { $regex: search, $options: 'i' } },
        { clientName: { $regex: search, $options: 'i' } },
      ];
    }
    const total = await Facture.countDocuments(query);
    const factures = await Facture.find(query).sort({ createdAt: -1 }).skip((page - 1) * limit).limit(Number(limit));
    res.json({ success: true, data: factures, total });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

const getFacture = async (req, res) => {
  try {
    const facture = await Facture.findById(req.params.id);
    if (!facture) return res.status(404).json({ success: false, message: 'Facture introuvable' });
    res.json({ success: true, data: facture });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

const createFacture = async (req, res) => {
  try {
    // Calculer les totaux automatiquement
    const items = req.body.items || [];
    const subtotal = items.reduce((sum, item) => sum + (item.unitPrice * item.quantity), 0);
    items.forEach(item => { item.total = item.unitPrice * item.quantity; });
    const tva = req.body.tva || 0;
    const tvaAmount = Math.round(subtotal * tva / 100);
    const total = subtotal + tvaAmount;

    const facture = await Facture.create({ ...req.body, items, subtotal, tvaAmount, total });

    // Générer le PDF
    try {
      const { filepath, filename } = await generateFacturePDF(facture);
      facture.pdfUrl = `/uploads/factures/${filename}`;
      await facture.save();
    } catch (pdfErr) {
      console.error('[PDF]', pdfErr.message);
    }

    res.status(201).json({ success: true, data: facture });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

const updateFacture = async (req, res) => {
  try {
    const facture = await Facture.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!facture) return res.status(404).json({ success: false, message: 'Facture introuvable' });
    res.json({ success: true, data: facture });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

const downloadPDF = async (req, res) => {
  try {
    const facture = await Facture.findById(req.params.id);
    if (!facture) return res.status(404).json({ success: false, message: 'Facture introuvable' });

    // Régénérer le PDF si nécessaire
    const { filepath, filename } = await generateFacturePDF(facture);
    facture.pdfUrl = `/uploads/factures/${filename}`;
    await facture.save();

    res.download(filepath, filename);
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

const deleteFacture = async (req, res) => {
  try {
    const facture = await Facture.findById(req.params.id);
    if (!facture) return res.status(404).json({ success: false, message: 'Facture introuvable' });
    // Supprimer le PDF physique
    if (facture.pdfUrl) {
      const filepath = path.join(__dirname, '../../', facture.pdfUrl);
      if (fs.existsSync(filepath)) fs.unlinkSync(filepath);
    }
    await facture.deleteOne();
    res.json({ success: true, message: 'Facture supprimée' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

module.exports = { getFactures, getFacture, createFacture, updateFacture, downloadPDF, deleteFacture };
