const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/projetController');
const { protect } = require('../middleware/auth');
const { atLeast } = require('../middleware/role');

router.get('/', ctrl.getProjets); // publique
router.get('/:id', ctrl.getProjet); // publique
router.post('/', protect, atLeast('admin'), ctrl.createProjet);
router.patch('/:id', protect, atLeast('admin'), ctrl.updateProjet);
router.delete('/:id', protect, atLeast('admin'), ctrl.deleteProjet);

module.exports = router;
