const { promisePool } = require('../config/database');

class Products {
    static async list() {
        const [rows] = await promisePool.query(`
            SELECT * FROM products
            ORDER BY created_at DESC
        `);
        return rows;
    }
}

module.exports = Products;