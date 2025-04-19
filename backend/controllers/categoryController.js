const Category = require('../models/Category');

// Create a new category
exports.createCategory = async (req, res) => {
    try {
        const { name, description, status } = req.body;
        const userId = req.headers['x-user-id'];

        if (!userId) {
            return res.status(403).json({ message: "User ID is required" });
        }
        
        const newCategory = new Category({
            name,
            description,
            status: status || 'Active', // Default to Active if not provided
            userId
        });

        const savedCategory = await newCategory.save();
        res.status(201).json(savedCategory);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get all categories
exports.getAllCategories = async (req, res) => {
    try {
        const userId = req.headers['x-user-id'];
        
        if (!userId) {
            return res.status(400).json({ error: 'User ID is required in headers' });
        }

        const categories = await Category.find({ userId: userId });
        res.json(categories);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Get a single category by ID
exports.getCategoryById = async (req, res) => {
    try {
        const category = await Category.findById(req.params.id);
        if (!category) {
            return res.status(404).json({ message: 'Category not found' });
        }
        res.status(200).json(category);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Update a category
exports.updateCategory = async (req, res) => {
    try {
        const { name, description, status } = req.body;
        
        const updatedCategory = await Category.findByIdAndUpdate(
            req.params.id,
            {
                name,
                description,
                status
            },
            { new: true }
        );

        if (!updatedCategory) {
            return res.status(404).json({ message: 'Category not found' });
        }

        res.status(200).json(updatedCategory);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Delete a category
exports.deleteCategory = async (req, res) => {
    try {
        const deletedCategory = await Category.findByIdAndDelete(req.params.id);
        if (!deletedCategory) {
            return res.status(404).json({ message: 'Category not found' });
        }
        res.status(200).json({ message: 'Category deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Search categories by name
exports.searchCategories = async (req, res) => {
    try {
        const query = req.query.q;
        const userId = req.headers['x-user-id'];
        
        const categories = await Category.find({
            userId,
            name: { $regex: query, $options: 'i' }
        });
        res.status(200).json(categories);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get active categories only
exports.getActiveCategories = async (req, res) => {
    try {
        const userId = req.headers['x-user-id'];
        
        const activeCategories = await Category.find({ 
            userId,
            status: 'Active' 
        });
        res.status(200).json(activeCategories);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};