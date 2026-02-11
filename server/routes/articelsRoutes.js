const express = require('express');
const router = express.Router();
const articlesController = require('../controllers/articelsController');
// GET /api/articles - Get all articles
router.get('/', articlesController.listArticels);
router.get('/:id', articlesController.getArticelById);

module.exports = router;