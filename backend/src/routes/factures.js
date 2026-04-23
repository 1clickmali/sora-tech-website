const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/factureController');
const { protect } = require('../middleware/auth');
const { atLeast } = require('../middleware/role');

// Route publique (lien email client — sans authentification)
router.get('/public/:publicToken', ctrl.downloadPDFPublic);

// Routes protégées admin
router.get('/', protect, atLeast('comptable'), ctrl.getFactures);
router.get('/:id', protect, atLeast('comptable'), ctrl.getFacture);
router.get('/:id/pdf', protect, atLeast('comptable'), ctrl.downloadPDF);
router.post('/', protect, atLeast('comptable'), ctrl.createFacture);
router.patch('/:id', protect, atLeast('comptable'), ctrl.updateFacture);
router.delete('/:id', protect, atLeast('admin'), ctrl.deleteFacture);

module.exports = router;
