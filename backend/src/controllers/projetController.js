const Projet = require('../models/Projet');

const getProjets = async (req, res) => {
  try {
    const { category } = req.query;
    const query = {};
    if (category && category !== 'Tous') query.category = category;
    const projets = await Projet.find(query).sort({ order: 1, createdAt: -1 }).lean();
    res.json({ success: true, data: projets });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

const getProjet = async (req, res) => {
  try {
    const projet = await Projet.findById(req.params.id);
    if (!projet) return res.status(404).json({ success: false, message: 'Projet introuvable' });
    res.json({ success: true, data: projet });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

const createProjet = async (req, res) => {
  try {
    const projet = await Projet.create(req.body);
    res.status(201).json({ success: true, data: projet });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

const updateProjet = async (req, res) => {
  try {
    const projet = await Projet.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!projet) return res.status(404).json({ success: false, message: 'Projet introuvable' });
    res.json({ success: true, data: projet });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

const deleteProjet = async (req, res) => {
  try {
    await Projet.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Projet supprimé' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

module.exports = { getProjets, getProjet, createProjet, updateProjet, deleteProjet };
