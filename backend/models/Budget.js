const mongoose = require('mongoose');

const budgetSchema = new mongoose.Schema({
    budgetName: {
        type: String,
        required: true,
    },
    totalAmount: {
        type: Number,
        required: true,
        min: 0
    },
    startDate: {
        type: String,
        required: true
    },
    endDate: {
        type: String,
        required: true
    },
    category: {
        type: String,
        required: true
    },
    paymentMethod: {
        type: String,
        required: true
    },
    userId: {
        type: String
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Budget', budgetSchema);