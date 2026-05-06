const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/commandeController');
const { protect } = require('../middleware/auth');
const { atLeast } = require('../middleware/role');

// Route publique de suivi (DOIT être avant /:id pour ne pas confondre)
router.get('/tracking/:trackingCode', ctrl.getCommandeByTracking);
router.get('/payment-return/:token', ctrl.getCommandePaymentReturn);
router.post('/payment-return/:token/refresh', ctrl.refreshCommandePaymentPublic);
router.post('/webhooks/geniuspay', ctrl.geniusPayWebhook);

router.get('/', protect, atLeast('commercial'), ctrl.getCommandes);
router.get('/:id', protect, atLeast('commercial'), ctrl.getCommande);
router.post('/', ctrl.createCommande);
router.patch('/:id', protect, atLeast('commercial'), ctrl.updateCommande);
router.delete('/:id', protect, atLeast('admin'), ctrl.deleteCommande);

module.exports = router;
