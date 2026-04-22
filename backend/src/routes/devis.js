const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/devisController');
const { protect } = require('../middleware/auth');
const { atLeast } = require('../middleware/role');

router.get('/', protect, atLeast('commercial'), ctrl.getDevis);
router.get('/:id', protect, atLeast('commercial'), ctrl.getOneDevis);
router.post('/', ctrl.createDevis); // publique
router.patch('/:id', protect, atLeast('commercial'), ctrl.updateDevis);
router.delete('/:id', protect, atLeast('admin'), ctrl.deleteDevis);

module.exports = router;
