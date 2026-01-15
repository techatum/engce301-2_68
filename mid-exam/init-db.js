// init-db.js
const db = require('./database/connection');

const createTables = () => {
    const sqlUsers = `
        CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            username TEXT NOT NULL,
            role TEXT DEFAULT 'student'
        );
    `;

    const sqlRooms = `
        CREATE TABLE IF NOT EXISTS rooms (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            building TEXT,
            floor INTEGER,
            capacity INTEGER,
            facilities TEXT
        );
    `;

    const sqlBookings = `
        CREATE TABLE IF NOT EXISTS bookings (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id INTEGER,
            room_id INTEGER,
            booking_date TEXT,
            start_time TEXT,
            end_time TEXT,
            purpose TEXT,
            status TEXT DEFAULT 'pending',
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY(user_id) REFERENCES users(id),
            FOREIGN KEY(room_id) REFERENCES rooms(id)
        );
    `;

    return new Promise((resolve, reject) => {
        db.serialize(() => {
            db.run("DROP TABLE IF EXISTS bookings");
            db.run("DROP TABLE IF EXISTS rooms");
            db.run("DROP TABLE IF EXISTS users");

            db.run(sqlUsers);
            db.run(sqlRooms);
            db.run(sqlBookings, (err) => {
                if (err) reject(err);
                else resolve();
            });
        });
    });
};

const seedData = () => {
    return new Promise((resolve, reject) => {
        db.serialize(() => {
            // 1. Insert Users
            const stmtUser = db.prepare("INSERT INTO users (username, role) VALUES (?, ?)");
            stmtUser.run("student01", "student");
            stmtUser.run("teacher01", "teacher");
            stmtUser.run("admin01", "staff");
            stmtUser.finalize();

            // 2. Insert Rooms (ข้อมูลตรงกับ HTML Part 4)
            const stmtRoom = db.prepare("INSERT INTO rooms (id, name, building, floor, capacity, facilities) VALUES (?, ?, ?, ?, ?, ?)");

            // Note: facilities เก็บเป็น String คั่นด้วย comma เพื่อความง่ายใน SQLite
            stmtRoom.run(101, "ห้อง A301", "อาคาร A", 3, 20, "โปรเจคเตอร์,ไวท์บอร์ด,ระบบเสียง");
            stmtRoom.run(102, "ห้อง A302", "อาคาร A", 3, 10, "ไวท์บอร์ด");
            stmtRoom.run(201, "ห้อง B101 Auditorium", "อาคาร B", 1, 100, "โปรเจคเตอร์,ระบบเสียง,Video Conference");
            stmtRoom.run(202, "ห้อง B201", "อาคาร B", 2, 30, "โปรเจคเตอร์,ไวท์บอร์ด");
            stmtRoom.run(301, "Meeting Room C", "อาคาร C", 5, 8, "TV Screen,ไวท์บอร์ด");

            stmtRoom.finalize();

            // 3. Insert Mock Booking
            const stmtBooking = db.prepare(`
                INSERT INTO bookings (user_id, room_id, booking_date, start_time, end_time, purpose, status) 
                VALUES (?, ?, ?, ?, ?, ?, ?)
            `);

            // จองวันนี้ เวลา 09:00 - 12:00
            const today = new Date().toISOString().split('T')[0];
            stmtBooking.run(1, 101, today, "09:00", "12:00", "ติวหนังสือสอบ Midterm", "approved");

            stmtBooking.finalize((err) => {
                if (err) reject(err);
                else resolve();
            });
        });
    });
};

// Main Execution
(async () => {
    try {
        console.log("🔄 Initializing Database...");
        await createTables();
        console.log("✅ Tables created.");
        await seedData();
        console.log("✅ Seed data inserted.");
        console.log("🎉 Database setup complete!");
        db.close();
    } catch (err) {
        console.error("❌ Error initializing database:", err);
    }
})();