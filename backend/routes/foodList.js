const express = require('express');
const router = express.Router();
const foodListController = require('../controllers/foodListController');

router.post('/', foodListController.createFood);
router.get('/', foodListController.getAllFoods);
router.get('/:id', foodListController.getFoodById);
router.put('/:id', foodListController.updateFood);
router.delete('/:id', foodListController.deleteFood);
router.get('/search', foodListController.searchFoods);

module.exports = router;