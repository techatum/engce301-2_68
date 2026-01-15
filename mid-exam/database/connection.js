// database/connection.js
const sqlite3 = require('sqlite3').verbose();
const path = require('path');

// สร้างไฟล์ database ชื่อ meeting_room.db
const dbPath = path.resolve(__dirname, 'meeting_room.db');

const db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
        console.error('❌ Error opening database:', err.message);
    } else {
        console.log('✅ Connected to SQLite database.');
    }
});

module.exports = db;