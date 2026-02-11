const Products = require("../models/Products");

exports.listProducts = async (req, res) => {
    try {
        const products = await Products.list();
        res.json({
            success: true,
            count: products.length,
            data: products
        });
    } catch (error) {
        console.error('Error listing products:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to list products',
            message: error.message
        });
    }
};