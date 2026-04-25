const mongoose = require('mongoose');
const slugify = require('slugify');

const articleSchema = new mongoose.Schema({
  title: { type: String, required: true },
  slug: { type: String, unique: true },
  content: { type: String, required: true },
  excerpt: { type: String },
  category: {
    type: String,
    enum: ['Digitalisation', 'Cybersécurité', 'Web', 'Mobile', 'ERP', 'Business'],
    required: true,
  },
  image: { type: String, default: '' },
  author: { type: String, default: 'Sissoko Abdoulaye' },
  authorId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  published: { type: Boolean, default: false },
  featured: { type: Boolean, default: false },
  views: { type: Number, default: 0 },
  readTime: { type: String },
}, { timestamps: true });

// Indexes pour les requêtes les plus fréquentes
articleSchema.index({ published: 1, createdAt: -1 });
articleSchema.index({ published: 1, featured: 1 });
articleSchema.index({ published: 1, category: 1, createdAt: -1 });
articleSchema.index({ slug: 1 });

// Générer le slug automatiquement
articleSchema.pre('save', function (next) {
  if (this.isModified('title')) {
    this.slug = slugify(this.title, { lower: true, strict: true, locale: 'fr' });
  }
  if (!this.readTime && this.content) {
    const words = this.content.split(' ').length;
    const minutes = Math.ceil(words / 200);
    this.readTime = `${minutes} min`;
  }
  next();
});

module.exports = mongoose.model('Article', articleSchema);
