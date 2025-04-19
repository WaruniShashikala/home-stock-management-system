const Product = require('../models/Product');

// Create a new product (with string dates)
exports.createProduct = async (req, res) => {
    try {
        const { name, category, quantity, price, manufactureDate, expiryDate, image } = req.body;
        const userId = req.headers['x-user-id'];

        if (!userId) {
            return res.status(403).json({ message: "User ID is required" });
        }
        const newProduct = new Product({
            name,
            category,
            quantity,
            price,
            manufactureDate, // Stored as string
            expiryDate,     // Stored as string
            image,
            userId
        });

        const savedProduct = await newProduct.save();
        res.status(201).json(savedProduct);
    } catch (error) {
        res.status(500).json({ 
            message: 'Failed to create product',
            error: error.message 
        });
    }
};

// Get all products (with string dates)
exports.getAllProducts = async (req, res) => {
    try {
        const userId = req.headers['x-user-id'];
        
        if (!userId) {
            return res.status(400).json({ 
                message: 'User ID is required in headers' 
            });
        }

        const products = await Product.find({ userId: userId }).sort({ createdAt: -1 });
        // Format dates as strings in response
        const formattedProducts = products.map(product => ({
            ...product._doc,
            manufactureDate: product.manufactureDate || null,
            expiryDate: product.expiryDate || null
        }));
        
        res.status(200).json(formattedProducts);
    } catch (error) {
        res.status(500).json({ 
            message: 'Failed to fetch products',
            error: error.message 
        });
    }
};

// Get single product (with string date)
exports.getProductById = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }
        
        res.status(200).json({
            ...product._doc,
            manufactureDate: product.manufactureDate || null,
            expiryDate: product.expiryDate || null
        });
    } catch (error) {
        res.status(500).json({ 
            message: 'Failed to fetch product',
            error: error.message 
        });
    }
};

// Update product (with string dates)
exports.updateProduct = async (req, res) => {
    try {
        const { name, category, quantity, price, manufactureDate, expiryDate, image } = req.body;
        
        const updatedProduct = await Product.findByIdAndUpdate(
            req.params.id,
            {
                name,
                category,
                quantity,
                price,
                manufactureDate, // Stored as string
                expiryDate,     // Stored as string
                image
            },
            { new: true }
        );

        if (!updatedProduct) {
            return res.status(404).json({ message: 'Product not found' });
        }

        res.status(200).json({
            ...updatedProduct._doc,
            manufactureDate: updatedProduct.manufactureDate || null,
            expiryDate: updatedProduct.expiryDate || null
        });
    } catch (error) {
        res.status(500).json({ 
            message: 'Failed to update product',
            error: error.message 
        });
    }
};

// Delete product
exports.deleteProduct = async (req, res) => {
    try {
        const deletedProduct = await Product.findByIdAndDelete(req.params.id);
        if (!deletedProduct) {
            return res.status(404).json({ message: 'Product not found' });
        }
        res.status(200).json({ 
            message: 'Product deleted successfully',
            deletedProduct: {
                ...deletedProduct._doc,
                manufactureDate: deletedProduct.manufactureDate || null,
                expiryDate: deletedProduct.expiryDate || null
            }
        });
    } catch (error) {
        res.status(500).json({ 
            message: 'Failed to delete product',
            error: error.message 
        });
    }
};