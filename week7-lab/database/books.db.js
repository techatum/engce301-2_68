const db = require('./connection');

class BookDatabase {
    // ✅ ให้โค้ดสมบูรณ์
    static findAll() {
        const sql = 'SELECT * FROM books ORDER BY id DESC';
        
        return new Promise((resolve, reject) => {
            db.all(sql, [], (err, rows) => {
                if (err) reject(err);
                else resolve(rows);
            });
        });
    }

    // TODO: นักศึกษาเขียน findById
    static findById(id) {
        // เขียนโค้ดตรงนี้
    }

    // TODO: นักศึกษาเขียน search (ค้นหาจาก title หรือ author)
    static search(keyword) {
        // เขียนโค้ดตรงนี้
    }

    // TODO: นักศึกษาเขียน create
    static create(bookData) {
        // เขียนโค้ดตรงนี้
    }

    // TODO: นักศึกษาเขียน update
    static update(id, bookData) {
        // เขียนโค้ดตรงนี้
    }

    // ✅ ให้โค้ดสมบูรณ์ - ฟังก์ชันสำคัญสำหรับ borrowing
    static decreaseAvailableCopies(bookId) {
        const sql = `
            UPDATE books 
            SET available_copies = available_copies - 1
            WHERE id = ? AND available_copies > 0
        `;
        
        return new Promise((resolve, reject) => {
            db.run(sql, [bookId], function(err) {
                if (err) reject(err);
                else resolve({ changes: this.changes });
            });
        });
    }

    // TODO: นักศึกษาเขียน increaseAvailableCopies (สำหรับคืนหนังสือ)
    static increaseAvailableCopies(bookId) {
        // เขียนโค้ดตรงนี้
    }
}

module.exports = BookDatabase;