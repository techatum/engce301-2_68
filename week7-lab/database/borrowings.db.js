const db = require('./connection');

class BorrowingDatabase {
    // สร้างรายการยืมใหม่
    static create(data) {
        const sql = `INSERT INTO borrowings (book_id, member_id, borrow_date, due_date, status) 
                     VALUES (?, ?, ?, ?, 'borrowed')`;
        return new Promise((resolve, reject) => {
            db.run(sql, [data.book_id, data.member_id, data.borrow_date, data.due_date], function (err) {
                if (err) reject(err);
                else resolve({ id: this.lastID, ...data });
            });
        });
    }

    // นับจำนวนหนังสือที่สมาชิกคนนี้ยืมอยู่และยังไม่คืน (status = 'borrowed')
    static countActiveBorrowings(memberId) {
        const sql = "SELECT COUNT(*) as count FROM borrowings WHERE member_id = ? AND status = 'borrowed'";
        return new Promise((resolve, reject) => {
            db.get(sql, [memberId], (err, row) => {
                if (err) reject(err);
                else resolve(row.count);
            });
        });
    }

    // หาข้อมูลการยืมจาก ID
    static findById(id) {
        return new Promise((resolve, reject) => {
            db.get('SELECT * FROM borrowings WHERE id = ?', [id], (err, row) => {
                if (err) reject(err);
                else resolve(row);
            });
        });
    }

    // อัปเดตการคืนหนังสือ
    static updateReturn(id, returnData) {
        const { return_date, status } = returnData;
        const sql = `
            UPDATE borrowings 
            SET return_date = ?, status = ?
            WHERE id = ?
        `;
        return new Promise((resolve, reject) => {
            db.run(sql, [return_date, status, id], function (err) {
                if (err) reject(err);
                else resolve({ changes: this.changes });
            });
        });
    }

    // ดึงรายการยืมทั้งหมด (อาจจะ Join table เพื่อให้เห็นชื่อหนังสือ/คนยืมด้วยก็ได้)
    static findAll() {
        const sql = `
            SELECT b.*, bk.title as book_title, m.name as member_name 
            FROM borrowings b
            JOIN books bk ON b.book_id = bk.id
            JOIN members m ON b.member_id = m.id
            ORDER BY b.borrow_date DESC
        `;
        return new Promise((resolve, reject) => {
            db.all(sql, [], (err, rows) => {
                if (err) reject(err);
                else resolve(rows);
            });
        });
    }

    // ดึงรายการยืมของสมาชิกคนหนึ่ง
    static findByMemberId(memberId) {
        const sql = `
            SELECT b.*, bk.title as book_title 
            FROM borrowings b
            JOIN books bk ON b.book_id = bk.id
            WHERE b.member_id = ?
            ORDER BY b.borrow_date DESC
        `;
        return new Promise((resolve, reject) => {
            db.all(sql, [memberId], (err, rows) => {
                if (err) reject(err);
                else resolve(rows);
            });
        });
    }

    // หาหนังสือที่เกินกำหนด (Overdue)
    static findOverdue() {
        const sql = `
            SELECT b.*, bk.title as book_title, m.name as member_name
            FROM borrowings b
            JOIN books bk ON b.book_id = bk.id
            JOIN members m ON b.member_id = m.id
            WHERE b.status = 'borrowed' AND b.due_date < date('now')
        `;
        return new Promise((resolve, reject) => {
            db.all(sql, [], (err, rows) => {
                if (err) reject(err);
                else resolve(rows);
            });
        });
    }

    // ลบรายการยืม
    static delete(id) {
        return new Promise((resolve, reject) => {
            db.run('DELETE FROM borrowings WHERE id = ?', [id], function (err) {
                if (err) reject(err);
                else resolve({ changes: this.changes });
            });
        });
    }
}

module.exports = BorrowingDatabase;