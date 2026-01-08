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
        return new Promise((resolve, reject) => {
            db.get('SELECT * FROM books WHERE id = ?', [id], (err, row) => {
                if (err) reject(err);
                else resolve(row);
            });
        });
    }

    // TODO: นักศึกษาเขียน search (ค้นหาจาก title หรือ author)
    static search(keyword) {
        const sql = `
            SELECT * FROM books 
            WHERE title LIKE ? OR author LIKE ?
        `;
        const searchTerm = `%${keyword}%`; // ใส่ % หน้า-หลัง เพื่อค้นหาบางส่วนของคำ

        return new Promise((resolve, reject) => {
            db.all(sql, [searchTerm, searchTerm], (err, rows) => {
                if (err) reject(err);
                else resolve(rows);
            });
        });
    }

    // TODO: นักศึกษาเขียน create
    static create(bookData) {
        const { title, author, isbn, category, total_copies } = bookData;
        // ตอนสร้างหนังสือใหม่ ให้ available_copies เท่ากับ total_copies เสมอ
        const available_copies = total_copies;

        const sql = `
            INSERT INTO books (title, author, isbn, category, total_copies, available_copies)
            VALUES (?, ?, ?, ?, ?, ?)
        `;

        return new Promise((resolve, reject) => {
            db.run(sql, [title, author, isbn, category, total_copies, available_copies], function (err) {
                if (err) reject(err);
                // ส่งคืน ID ของหนังสือที่เพิ่งสร้าง และข้อมูลที่รับมา
                else resolve({ id: this.lastID, ...bookData, available_copies });
            });
        });
    }

    // TODO: นักศึกษาเขียน update
    static update(id, bookData) {
        const { title, author, isbn, category, total_copies } = bookData;
        // การแก้นี้จะไม่ไปยุ่งกับ available_copies โดยตรง เพื่อความปลอดภัย
        const sql = `
            UPDATE books 
            SET title = ?, author = ?, isbn = ?, category = ?, total_copies = ?
            WHERE id = ?
        `;

        return new Promise((resolve, reject) => {
            db.run(sql, [title, author, isbn, category, total_copies, id], function (err) {
                if (err) reject(err);
                else resolve({ changes: this.changes, id, ...bookData });
            });
        });
    }

    // ✅ ให้โค้ดสมบูรณ์ - ฟังก์ชันสำคัญสำหรับ borrowing
    static decreaseAvailableCopies(bookId) {
        const sql = `
            UPDATE books 
            SET available_copies = available_copies - 1
            WHERE id = ? AND available_copies > 0
        `;

        return new Promise((resolve, reject) => {
            db.run(sql, [bookId], function (err) {
                if (err) reject(err);
                else resolve({ changes: this.changes });
            });
        });
    }

    // TODO: นักศึกษาเขียน increaseAvailableCopies (สำหรับคืนหนังสือ)
    static increaseAvailableCopies(bookId) {
        const sql = `
            UPDATE books 
            SET available_copies = available_copies + 1
            WHERE id = ? AND available_copies < total_copies
        `;
        return new Promise((resolve, reject) => {
            db.run(sql, [bookId], function (err) {
                if (err) reject(err);
                else resolve({ changes: this.changes });
            });
        });
    }

    // [ใหม่] ลบหนังสือ
    static delete(id) {
        return new Promise((resolve, reject) => {
            db.run('DELETE FROM books WHERE id = ?', [id], function (err) {
                if (err) reject(err);
                else resolve({ changes: this.changes });
            });
        });
    }
}

module.exports = BookDatabase;