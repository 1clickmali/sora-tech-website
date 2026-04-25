const Produit = require('../models/Produit');
const { normalizeProductPayload } = require('../config/productCatalog');

const getProduits = async (req, res) => {
  try {
    const { category, subcategory, active = 'true' } = req.query;
    const query = {};
    if (active !== 'all') query.active = active === 'true';
    const produits = await Produit.find(query).sort({ order: 1, createdAt: -1 }).lean();
    const normalized = produits
      .map((produit) => normalizeProductPayload(produit))
      .filter((produit) => !category || category === 'Tous' || produit.category === category)
      .filter((produit) => !subcategory || subcategory === 'Tous' || produit.subcategory === subcategory);
    res.json({ success: true, data: normalized });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

const getProduit = async (req, res) => {
  try {
    const produit = await Produit.findById(req.params.id);
    if (!produit) return res.status(404).json({ success: false, message: 'Produit introuvable' });
    res.json({ success: true, data: normalizeProductPayload(produit.toObject()) });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

const createProduit = async (req, res) => {
  try {
    const produit = await Produit.create(normalizeProductPayload(req.body));
    res.status(201).json({ success: true, data: produit });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

const updateProduit = async (req, res) => {
  try {
    const produit = await Produit.findById(req.params.id);
    if (!produit) return res.status(404).json({ success: false, message: 'Produit introuvable' });
    Object.assign(produit, normalizeProductPayload({ ...produit.toObject(), ...req.body }));
    await produit.save();
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
