const articels = require('../models/Articles');

exports.listArticels = async (req, res) => {
    try {
        const articles = await articels.listPublished();
        res.json({
            success: true,
            count: articles.length,
            data: articles
        });
    } catch (error) {
        console.error('Error listing articles:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to list articles',
            message: error.message
        });
    }
};

exports.getArticelById = async (req, res) => {
    try {
        const { id } = req.params;
        const article = await articels.getById(id);
        if (!article) {
            return res.status(404).json({
                success: false,
                error: 'Article not found'
            });
        }
        res.json({
            success: true,
            data: article
        });
    } catch (error) {
        console.error('Error getting article by ID:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to get article',
            message: error.message
        });
    }
};