const express = require('express');
const router = express.Router();
const axios = require('axios');
const Product = require('../models/Product');
const Food = require('../models/FoodList');
const ShoppingList = require('../models/ShoppingList');
const Waste = require('../models/Waste');

// Hugging Face model endpoint (example: Mistral, GPT-J, etc.)
const HF_API_URL = "https://api-inference.huggingface.co/models/mistralai/Mistral-7B-Instruct-v0.1";


// Helper function to query all relevant collections
async function queryStockData(userId) {
    const products = await Product.find({ userId });
    const foods = await Food.find({ userId });
    const shoppingList = await ShoppingList.find({ userId });
    const wastedItems = await Waste.find({ userId });

    return { products, foods, shoppingList, wastedItems };
}

// Chat endpoint
router.post('/', async (req, res) => {
    try {
        const { message, userId } = req.body;

        if (!userId) {
            return res.status(400).json({ error: "User ID is required" });
        }

        // Get stock data
        const stockData = await queryStockData(userId);
        const stockDataString = JSON.stringify(stockData);

        // Construct the prompt
        const prompt = `
You are a helpful home stock management assistant. 
Use this JSON data about the user's stock to answer questions:
${stockDataString}

Rules:
- Be concise but helpful
- If asked about specific items, check if they exist in the data
- For quantities, always mention the unit if available
- For expiry dates, warn if items are expired or close to expiring
- Shopping list items are things the user needs to buy

User: ${message}
AI:
`;

        // Call Hugging Face API
        const response = await axios.post(
            HF_API_URL,
            { inputs: prompt },
            {
                headers: {
                    Authorization: `Bearer ${process.env.HUGGINGFACE_API_KEY}`,
                    'Content-Type': 'application/json'
                }
            }
        );

        const botReply = response.data.generated_text || "Sorry, I couldn’t generate a response.";

        res.json({ reply: botReply });
    } catch (error) {
        console.error("Chatbot error:", error?.response?.data || error.message);
        res.status(500).json({ error: "Error processing your request" });
    }
});

module.exports = router;
