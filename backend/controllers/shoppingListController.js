const List = require('../models/ShoppingList');

// Create a new shopping list item
exports.createListItem = async (req, res) => {
    try {
        const { itemName, Quantity } = req.body;
        const userId = req.headers['x-user-id'];

        if (!userId) {
            return res.status(403).json({ message: "User ID is required" });
        }
        
        const newItem = new List({
            itemName,
            Quantity,
            userId
        });

        const savedItem = await newItem.save();
        res.status(201).json(savedItem);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get all shopping list items
exports.getAllListItems = async (req, res) => {
    try {
        const userId = req.headers['x-user-id'];
        
        if (!userId) {
            return res.status(400).json({ error: 'User ID is required in headers' });
        }

        const items = await List.find({ userId: userId });
        res.json(items);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Get a single shopping list item by ID
exports.getListItemById = async (req, res) => {
    try {
        const item = await List.findById(req.params.id);
        if (!item) {
            return res.status(404).json({ message: 'Item not found' });
        }
        res.status(200).json(item);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Update a shopping list item
exports.updateListItem = async (req, res) => {
    try {
        const { itemName, Quantity } = req.body;
        
        const updatedItem = await List.findByIdAndUpdate(
            req.params.id,
            {
                itemName,
                Quantity
            },
            { new: true }
        );

        if (!updatedItem) {
            return res.status(404).json({ message: 'Item not found' });
        }

        res.status(200).json(updatedItem);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Delete a shopping list item
exports.deleteListItem = async (req, res) => {
    try {
        const deletedItem = await List.findByIdAndDelete(req.params.id);
        if (!deletedItem) {
            return res.status(404).json({ message: 'Item not found' });
        }
        res.status(200).json({ message: 'Item deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Search shopping list items by name
exports.searchListItems = async (req, res) => {
    try {
        const query = req.query.q;
        const userId = req.headers['x-user-id'];
        
        const items = await List.find({
            userId,
            itemName: { $regex: query, $options: 'i' }
        });
        res.status(200).json(items);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};