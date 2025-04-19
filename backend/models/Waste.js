const mongoose = require('mongoose');

const wasteSchema = new mongoose.Schema({
    itemName: {
        type: String,
        required: true
    },
    category: {
        type: String,
        required: true,
    },
    quantity: {
        type: String,
        required: true
    },
    reason: {
        type: String,
        required: true
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
    },
    userId: {
        type: String,
    }
});

const Waste = mongoose.model('Waste', wasteSchema);

module.exports = Waste;