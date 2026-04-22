const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/articleController');
const { protect } = require('../middleware/auth');
const { atLeast } = require('../middleware/role');

router.get('/', ctrl.getArticles); // publique (filtre published automatique)
router.get('/:id', ctrl.getArticle); // publique
router.post('/', protect, atLeast('admin'), ctrl.createArticle);
router.patch('/:id', protect, atLeast('admin'), ctrl.updateArticle);
router.delete('/:id', protect, atLeast('admin'), ctrl.deleteArticle);

module.exports = router;
