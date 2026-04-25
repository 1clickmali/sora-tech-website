const Article = require('../models/Article');
const mongoose = require('mongoose');

const getArticles = async (req, res) => {
  try {
    const { category, published, featured, page = 1, limit = 10 } = req.query;
    const query = {};
    // Route publique : afficher seulement les articles publiés
    if (!req.user) query.published = true;
    else if (published === 'true' || published === 'false') query.published = published === 'true';
    if (category && category !== 'Tous') query.category = category;
    if (featured === 'true' || featured === 'false') query.featured = featured === 'true';

    const total = await Article.countDocuments(query);
    const articles = await Article.find(query)
      .sort({ createdAt: -1 })
      .skip((Number(page) - 1) * Number(limit))
      .limit(Number(limit))
      .select('-content')
      .lean();
    res.json({ success: true, data: articles, total });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

const getArticle = async (req, res) => {
  try {
    const filters = [{ slug: req.params.id }];
    if (mongoose.isValidObjectId(req.params.id)) {
      filters.unshift({ _id: req.params.id });
    }
    const filter = { $or: filters };
    if (!req.user) filter.published = true;
    const article = await Article.findOne(filter).lean();
    if (!article) return res.status(404).json({ success: false, message: 'Article introuvable' });
    // Incrémenter les vues en arrière-plan — ne bloque pas la réponse
    if (!req.user) {
      Article.updateOne(filter, { $inc: { views: 1 } }).exec();
    }
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
    const article = await Article.findById(req.params.id);
    if (!article) return res.status(404).json({ success: false, message: 'Article introuvable' });
    Object.assign(article, req.body);
    await article.save();
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
