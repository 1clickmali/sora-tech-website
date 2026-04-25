const Produit = require('../models/Produit');

const getProduits = async (req, res) => {
  try {
    const { category, active = 'true' } = req.query;
    const query = {};
    if (active !== 'all') query.active = active === 'true';
    if (category && category !== 'Tous') query.category = category;
    const produits = await Produit.find(query).sort({ order: 1, createdAt: -1 }).lean();
    res.json({ success: true, data: produits });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

const getProduit = async (req, res) => {
  try {
    const produit = await Produit.findById(req.params.id);
    if (!produit) return res.status(404).json({ success: false, message: 'Produit introuvable' });
    res.json({ success: true, data: produit });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

const createProduit = async (req, res) => {
  try {
    const produit = await Produit.create(req.body);
    res.status(201).json({ success: true, data: produit });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

const updateProduit = async (req, res) => {
  try {
    const produit = await Produit.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!produit) return res.status(404).json({ success: false, message: 'Produit introuvable' });
    res.json({ success: true, data: produit });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

const deleteProduit = async (req, res) => {
  try {
    await Produit.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Produit supprimé' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

module.exports = { getProduits, getProduit, createProduit, updateProduit, deleteProduit };
