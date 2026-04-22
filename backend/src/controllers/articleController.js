const Article = require('../models/Article');

const getArticles = async (req, res) => {
  try {
    const { category, published, featured, page = 1, limit = 10 } = req.query;
    const query = {};
    // Route publique : afficher seulement les articles publiés
    if (!req.user) query.published = true;
    else if (published !== undefined) query.published = published === 'true';
    if (category && category !== 'Tous') query.category = category;
    if (featured) query.featured = featured === 'true';

    const total = await Article.countDocuments(query);
    const articles = await Article.find(query).sort({ createdAt: -1 }).skip((page - 1) * limit).limit(Number(limit)).select('-content');
    res.json({ success: true, data: articles, total });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

const getArticle = async (req, res) => {
  try {
    const article = await Article.findOne({
      $or: [{ _id: req.params.id }, { slug: req.params.id }]
    });
    if (!article) return res.status(404).json({ success: false, message: 'Article introuvable' });
    // Incrémenter les vues si route publique
    if (!req.user) article.views += 1;
    await article.save();
    res.json({ success: true, data: article });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

const createArticle = async (req, res) => {
  try {
    const article = await Article.create({ ...req.body, authorId: req.user._id });
    res.status(201).json({ success: true, data: article });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

const updateArticle = async (req, res) => {
  try {
    const article = await Article.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!article) return res.status(404).json({ success: false, message: 'Article introuvable' });
    res.json({ success: true, data: article });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

const deleteArticle = async (req, res) => {
  try {
    await Article.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Article supprimé' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

module.exports = { getArticles, getArticle, createArticle, updateArticle, deleteArticle };
