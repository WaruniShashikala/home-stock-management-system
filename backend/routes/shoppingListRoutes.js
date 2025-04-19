const express = require('express');
const router = express.Router();
const shoppingListController = require('../controllers/shoppingListController');

router.post('/', shoppingListController.createListItem);
router.get('/', shoppingListController.getAllListItems);
router.get('/:id', shoppingListController.getListItemById);
router.put('/:id', shoppingListController.updateListItem);
router.delete('/:id', shoppingListController.deleteListItem);

module.exports = router;