const mongoose = require('mongoose');

const foodSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    quantity: {
        type: Number,
        required: true,
        min: 0
    },
    category: {
        type: String,
        required: true
    },
    usageQuantity: {
        type: Number,
        required: true,
        min: 0
    },
    restockQuantity: {
        type: Number,
        required: true,
        min: 0
    },
    unit: {
        type: String,
        required: true,
        enum: ['kg', 'liter', 'packs', 'count'],
        default: 'count'
    },
    userId: {
        type: String
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Food', foodSchema);