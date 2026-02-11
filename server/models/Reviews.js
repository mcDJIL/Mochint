const { promisePool } = require('../config/database');

class Reviews {
    // Get all reviews
    static async list() {
        const [rows] = await promisePool.query(`
            SELECT * FROM reviews
            ORDER BY created_at DESC
        `);
        return rows;
    }
}

module.exports = Reviews;