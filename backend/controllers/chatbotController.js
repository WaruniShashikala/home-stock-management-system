const { OpenAI } = require('openai');
const Product = require('../models/Product');
const Food = require('../models/FoodList');
const ShoppingList = require('../models/ShoppingList');
const Waste = require('../models/Waste');

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

exports.handleChat = async (req, res) => {
  try {
    const { message, userId } = req.body;
    
    if (!userId) {
      return res.status(400).json({ error: "User ID is required" });
    }

    // Get current stock data
    const products = await Product.find({ userId });
    const foods = await Food.find({ userId });
    const shoppingList = await ShoppingList.find({ userId });
    const wastedItems = await Waste.find({ userId });
    
    const stockContext = `
      Current Inventory:
      - Products: ${products.map(p => `${p.name} (${p.quantity})`).join(', ')}
      - Foods: ${foods.map(f => `${f.name} (${f.quantity} ${f.unit})`).join(', ')}
      - Shopping List: ${shoppingList.map(s => s.itemName).join(', ')}
      - Recently Wasted: ${wastedItems.map(w => w.itemName).join(', ')}
    `;

    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: `You are a home inventory assistant. Help users manage their stock.
                  Current inventory: ${stockContext}
                  Rules:
                  - Be factual and concise
                  - Only reference items that exist in the inventory
                  - Mention quantities and units when available
                  - For expiry checks, use today's date: ${new Date().toISOString().split('T')[0]}`
        },
        { role: "user", content: message }
      ],
      temperature: 0.3
    });

    res.json({ reply: response.choices[0].message.content });
  } catch (error) {
    console.error("Chatbot error:", error);
    res.status(500).json({ error: "Error processing your request" });
  }
};