const db = require('./connection');

class MemberDatabase {
    // 1. ดึงสมาชิกทั้งหมด (มีอยู่แล้ว)
    static findAll() {
        return new Promise((resolve, reject) => {
            db.all('SELECT * FROM members', [], (err, rows) => {
                if (err) reject(err);
                else resolve(rows);
            });
        });
    }

    // 2. หาตาม ID (มีอยู่แล้ว)
    static findById(id) {
        return new Promise((resolve, reject) => {
            db.get('SELECT * FROM members WHERE id = ?', [id], (err, row) => {
                if (err) reject(err);
                else resolve(row);
            });
        });
    }

    // 3. [ใหม่] เพิ่มสมาชิก
    static create(memberData) {
        const { name, email, phone } = memberData;
        const sql = `INSERT INTO members (name, email, phone) VALUES (?, ?, ?)`;

        return new Promise((resolve, reject) => {
            db.run(sql, [name, email, phone], function (err) {
                if (err) reject(err);
                else resolve({ id: this.lastID, ...memberData, status: 'active' });
            });
        });
    }

    // 4. [ใหม่] แก้ไขข้อมูลสมาชิก
    static update(id, memberData) {
        const { name, email, phone, status } = memberData;
        const sql = `
            UPDATE members 
            SET name = ?, email = ?, phone = ?, status = ?
            WHERE id = ?
        `;

        return new Promise((resolve, reject) => {
            db.run(sql, [name, email, phone, status, id], function (err) {
                if (err) reject(err);
                else resolve({ changes: this.changes, id, ...memberData });
            });
        });
    }

    // [เพิ่มต่อท้าย]
    static delete(id) {
        return new Promise((resolve, reject) => {
            db.run('DELETE FROM members WHERE id = ?', [id], function (err) {
                if (err) reject(err);
                else resolve({ changes: this.changes });
            });
        });
    }
}

module.exports = MemberDatabase;