const express = require('express');
const router = express.Router();
const productController = require('../controllers/productsController');

// GET /api/products - Get all products
router.get('/', productController.listProducts);

module.exports = router;