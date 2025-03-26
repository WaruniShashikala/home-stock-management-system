const mongoose = require('mongoose');

const wasteSchema = new mongoose.Schema({
    itemName: {
        type: String,
        required: true
    },
    category: {
        type: String,
        required: true,
        enum: [
            'Fruits',
            'Vegetables',
            'Dairy',
            'Bakery',
            'Meat',
            'Seafood',
            'Grains',
            'Snacks',
            'Beverages',
            'Leftovers',
            'Other'
        ]        
    },
    quantity: {
        type: String,
        required: true
    },
    reason: {
        type: String,
        required: true,
        enum: [
            'Expired',
            'Spoiled',
            'Moldy',
            'Freezer Burn',
            'Overcooked',
            'Didnt Like',
            'Too Much Prepared',
            'Forgot About It',
            'Other'
        ]
    },
    date: {
        type: String,
        required: true,
    },
    imageUrl: {
        type: String 
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

const Waste = mongoose.model('Waste', wasteSchema);

module.exports = Waste;