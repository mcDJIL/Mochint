const { promisePool } = require('../config/database');

class Articles {
    // Get all articles
    static async listPublished() {
        const [rows] = await promisePool.query(`
            SELECT * FROM articles
            WHERE status = 'Published'
            ORDER BY published_date DESC
        `);
        return rows;
    }

    static async getById(id) {
        const [rows] = await promisePool.query(
            'SELECT * FROM articles WHERE id = ? AND status = ?',
            [id, 'Published']
        );
        return rows[0]; 
    }
}

module.exports = Articles;