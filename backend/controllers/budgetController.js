const Budget = require('../models/Budget');

// Create a new budget
exports.createBudget = async (req, res) => {
    try {
        const { budgetName, totalAmount, startDate, endDate, category, paymentMethod } = req.body;
        const userId = req.headers['x-user-id'];

        if (!userId) {
            return res.status(403).json({ message: "User ID is required" });
        }
        const newBudget = new Budget({
            budgetName,
            totalAmount,
            startDate, // Stored as string
            endDate,   // Stored as string
            category,
            paymentMethod,
            userId
        });

        const savedBudget = await newBudget.save();
        res.status(201).json(savedBudget);
    } catch (error) {
        res.status(500).json({
            message: 'Failed to create budget',
            error: error.message
        });
    }
};

// Get all budgets for the current user
exports.getAllBudgets = async (req, res) => {
    try {
        const userId = req.headers['x-user-id'];

        if (!userId) {
            return res.status(400).json({
                message: 'User ID is required in headers'
            });
        }

        // Find budgets only for this user, sorted by creation date
        const budgets = await Budget.find({ userId: userId }).sort({ createdAt: -1 });

        // Format dates as strings in response
        const formattedBudgets = budgets.map(budget => ({
            ...budget._doc,
            startDate: budget.startDate || null,
            endDate: budget.endDate || null
        }));

        res.status(200).json(formattedBudgets);
    } catch (error) {
        res.status(500).json({
            message: 'Failed to fetch budgets',
            error: error.message
        });
    }
};

// Get single budget
exports.getBudgetById = async (req, res) => {
    try {
        const budget = await Budget.findById(req.params.id);
        if (!budget) {
            return res.status(404).json({ message: 'Budget not found' });
        }

        res.status(200).json({
            ...budget._doc,
            startDate: budget.startDate || null,
            endDate: budget.endDate || null
        });
    } catch (error) {
        res.status(500).json({
            message: 'Failed to fetch budget',
            error: error.message
        });
    }
};

// Update budget
exports.updateBudget = async (req, res) => {
    try {
        const { budgetName, totalAmount, startDate, endDate, category, paymentMethod } = req.body;

        const updatedBudget = await Budget.findByIdAndUpdate(
            req.params.id,
            {
                budgetName,
                totalAmount,
                startDate, // Stored as string
                endDate,   // Stored as string
                category,
                paymentMethod
            },
            { new: true }
        );

        if (!updatedBudget) {
            return res.status(404).json({ message: 'Budget not found' });
        }

        res.status(200).json({
            ...updatedBudget._doc,
            startDate: updatedBudget.startDate || null,
            endDate: updatedBudget.endDate || null
        });
    } catch (error) {
        res.status(500).json({
            message: 'Failed to update budget',
            error: error.message
        });
    }
};

// Delete budget
exports.deleteBudget = async (req, res) => {
    try {
        const deletedBudget = await Budget.findByIdAndDelete(req.params.id);
        if (!deletedBudget) {
            return res.status(404).json({ message: 'Budget not found' });
        }
        res.status(200).json({
            message: 'Budget deleted successfully',
            deletedBudget: {
                ...deletedBudget._doc,
                startDate: deletedBudget.startDate || null,
                endDate: deletedBudget.endDate || null
            }
        });
    } catch (error) {
        res.status(500).json({
            message: 'Failed to delete budget',
            error: error.message
        });
    }
};