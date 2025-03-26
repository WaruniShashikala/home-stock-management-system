const express = require('express');
const router = express.Router();
const wasteController = require('../controllers/wasteController');

router.post('/', wasteController.createWaste);
router.get('/', wasteController.getAllWastes);
router.get('/:id', wasteController.getWasteById);
router.put('/:id', wasteController.updateWaste);
router.delete('/:id', wasteController.deleteWaste);

module.exports = router;