const express = require('express');
const router = express.Router();
const reviewsController = require('../controllers/reviewsController');

// GET /api/reviews - Get all reviews
router.get('/', reviewsController.listReviews);
module.exports = router;
