const mongoose = require('mongoose');

const ShoppingListSchema = new mongoose.Schema({
    itemName: {
        type: String,
        required: true,
    },
    Quantity: {
        type: String,
        trim: true
    },
    userId: {
        type: String  
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('ShoppingList', ShoppingListSchema);