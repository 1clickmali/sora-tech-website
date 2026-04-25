const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/articleController');
const { protect, optionalProtect } = require('../middleware/auth');
const { atLeast } = require('../middleware/role');

router.get('/', optionalProtect, ctrl.getArticles); // publique + admin si token présent
router.get('/:id', optionalProtect, ctrl.getArticle); // publique + admin si token présent
router.post('/', protect, atLeast('admin'), ctrl.createArticle);
router.patch('/:id', protect, atLeast('admin'), ctrl.updateArticle);
router.delete('/:id', protect, atLeast('admin'), ctrl.deleteArticle);

module.exports = router;
