const Reviews = require('../models/Reviews');

exports.listReviews = async (req, res) => {
    try {
        const reviews = await Reviews.list();  
        res.json({
            success: true,
            count: reviews.length,
            data: reviews
        });
    } catch (error) {
        console.error('Error listing reviews:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to list reviews',
            message: error.message
        });
    }
};

