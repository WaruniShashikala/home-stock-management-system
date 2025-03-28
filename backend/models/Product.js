const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    category: {
        type: String,
        required: true,
    },
    quantity: {
        type: Number,
        required: true,
        min: 0
    },
    price: {
        type: Number,
        required: true,
        min: 0
    },
    manufactureDate: {
        type: String
    },
    expiryDate: {
        type: String
    },
    image: {
        type: String 
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Prod', productSchema);