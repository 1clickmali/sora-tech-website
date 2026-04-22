const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/contactController');
const { protect } = require('../middleware/auth');
const { atLeast } = require('../middleware/role');

router.get('/', protect, atLeast('commercial'), ctrl.getContacts);
router.post('/', ctrl.createContact); // publique
router.patch('/:id', protect, atLeast('commercial'), ctrl.updateContact);
router.delete('/:id', protect, atLeast('admin'), ctrl.deleteContact);

module.exports = router;
