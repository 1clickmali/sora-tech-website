const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/stockController');
const { protect } = require('../middleware/auth');
const { atLeast } = require('../middleware/role');

router.get('/', protect, atLeast('commercial'), ctrl.getStockOverview);
router.post('/mouvements', protect, atLeast('admin'), ctrl.createStockMovement);
router.patch('/produits/:id', protect, atLeast('admin'), ctrl.updateStockSettings);

module.exports = router;
