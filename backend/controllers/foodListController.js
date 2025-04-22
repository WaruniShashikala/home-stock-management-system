const Food = require('../models/FoodList');

// Create a new food item
exports.createFood = async (req, res) => {
    try {
        const { name, quantity, category, usageQuantity, restockQuantity, unit } = req.body;
        
        const userId = req.headers['x-user-id'];

        if (!userId) {
            return res.status(403).json({ message: "User ID is required" });
        }
        
        const newFood = new Food({
            name,
            quantity,
            category,
            usageQuantity,
            restockQuantity,
            unit,
            userId,
        });

        const savedFood = await newFood.save();
        res.status(201).json(savedFood);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get all food items
exports.getAllFoods =  async (req, res) => {
    try {
        const userId = req.headers['x-user-id'];
        
        if (!userId) {
            return res.status(400).json({ error: 'User ID is required in headers' });
        }

        const foods = await Food.find({ userId: userId });
        res.json(foods);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Get a single food item by ID
exports.getFoodById = async (req, res) => {
    try {
        const food = await Food.findById(req.params.id);
        if (!food) {
            return res.status(404).json({ message: 'Food item not found' });
        }
        res.status(200).json(food);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Update a food item
exports.updateFood = async (req, res) => {
    try {
        const { name, quantity, category, usageQuantity, restockQuantity, unit } = req.body;
        
        const updatedFood = await Food.findByIdAndUpdate(
            req.params.id,
            {
                name,
                quantity,
                category,
                usageQuantity,
                restockQuantity,
                unit
            },
            { new: true }
        );

        if (!updatedFood) {
            return res.status(404).json({ message: 'Food item not found' });
        }

        res.status(200).json(updatedFood);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Delete a food item
exports.deleteFood = async (req, res) => {
    try {
        const deletedFood = await Food.findByIdAndDelete(req.params.id);
        if (!deletedFood) {
            return res.status(404).json({ message: 'Food item not found' });
        }
        res.status(200).json({ message: 'Food item deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Search food items by name
exports.searchFoods = async (req, res) => {
    try {
        const query = req.query.q;
        const foods = await Food.find({
            name: { $regex: query, $options: 'i' }
        });
        res.status(200).json(foods);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};