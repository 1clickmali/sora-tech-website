const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/produitController');
const { protect } = require('../middleware/auth');
const { atLeast } = require('../middleware/role');

router.get('/', ctrl.getProduits); // publique
router.get('/:id', ctrl.getProduit); // publique
router.post('/', protect, atLeast('admin'), ctrl.createProduit);
router.patch('/:id', protect, atLeast('admin'), ctrl.updateProduit);
router.delete('/:id', protect, atLeast('admin'), ctrl.deleteProduit);

module.exports = router;
