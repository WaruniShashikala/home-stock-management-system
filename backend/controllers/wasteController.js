const Waste = require('../models/Waste');
const multer = require('multer');
const path = require('path');

// Set up multer storage for image uploads
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './public/images');
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});

const upload = multer({ storage: storage }).single('photo');

// Create a new waste record
exports.createWaste = async (req, res) => {
    try {
        upload(req, res, async (err) => {
            if (err) {
                return res.status(400).json({ message: 'Error uploading file' });
            }

            const userId = req.headers['x-user-id'];

            if (!userId) {
                return res.status(403).json({ message: "User ID is required" });
            }


            const { itemName, category, quantity, reason, date } = req.body;
            const imageUrl = req.body.imageUrl ? req.body.imageUrl : null;

            const newWaste = new Waste({
                itemName,
                category,
                quantity,
                reason,
                date,
                imageUrl,
                userId
            });

            const savedWaste = await newWaste.save();
            res.status(201).json(savedWaste);
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get all waste records
exports.getAllWastes = async (req, res) => {
    try {
        const userId = req.headers['x-user-id'];
        
        if (!userId) {
            return res.status(400).json({ error: 'User ID is required in headers' });
        }
        const wastes = await Waste.find({userId: userId}).sort({ createdAt: -1 });
        res.status(200).json(wastes);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get a single waste record by ID
exports.getWasteById = async (req, res) => {
    try {
        const waste = await Waste.findById(req.params.id);
        if (!waste) {
            return res.status(404).json({ message: 'Waste record not found' });
        }
        res.status(200).json(waste);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Update a waste record
exports.updateWaste = async (req, res) => {
    try {
        upload(req, res, async (err) => {
            if (err) {
                return res.status(400).json({ message: 'Error uploading file' });
            }

            const { itemName, category, quantity, reason, date } = req.body;
            console.log(req.body)
            const updateData = {
                itemName,
                category,
                quantity,
                reason,
                date
            };
            if (req.body.imageUrl) {
                updateData.imageUrl = req.body.imageUrl;
            }
            const updatedWaste = await Waste.findByIdAndUpdate(
                req.params.id,
                updateData,
                { new: true }
            );

            if (!updatedWaste) {
                return res.status(404).json({ message: 'Waste record not found' });
            }

            res.status(200).json(updatedWaste);
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Delete a waste record
exports.deleteWaste = async (req, res) => {
    try {
        const deletedWaste = await Waste.findByIdAndDelete(req.params.id);
        if (!deletedWaste) {
            return res.status(404).json({ message: 'Waste record not found' });
        }
        res.status(200).json({ message: 'Waste record deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};