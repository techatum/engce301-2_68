-- schema.sql

-- 1. Users Table
DROP TABLE IF EXISTS users;
CREATE TABLE users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT NOT NULL,
    role TEXT DEFAULT 'student', -- 'student', 'teacher', 'staff'
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 2. Rooms Table
DROP TABLE IF EXISTS rooms;
CREATE TABLE rooms (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    building TEXT,
    floor INTEGER,
    capacity INTEGER,
    facilities TEXT -- Store as comma-separated string (e.g., "Projector,Whiteboard")
);

-- 3. Bookings Table
DROP TABLE IF EXISTS bookings;
CREATE TABLE bookings (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER,
    room_id INTEGER,
    booking_date TEXT, -- Format: YYYY-MM-DD
    start_time TEXT,   -- Format: HH:MM
    end_time TEXT,     -- Format: HH:MM
    purpose TEXT,
    status TEXT DEFAULT 'pending', -- 'pending', 'approved', 'rejected', 'cancelled'
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY(user_id) REFERENCES users(id),
    FOREIGN KEY(room_id) REFERENCES rooms(id)
);

-- =============================================
-- SEED DATA (ข้อมูลตัวอย่าง)
-- =============================================

-- Users
INSERT INTO users (username, role) VALUES ('student01', 'student');
INSERT INTO users (username, role) VALUES ('teacher01', 'teacher');
INSERT INTO users (username, role) VALUES ('admin_staff', 'staff');

-- Rooms
INSERT INTO rooms (id, name, building, floor, capacity, facilities) VALUES 
(101, 'ห้อง A301', 'อาคาร A', 3, 20, 'โปรเจคเตอร์,ไวท์บอร์ด,ระบบเสียง'),
(102, 'ห้อง A302', 'อาคาร A', 3, 10, 'ไวท์บอร์ด'),
(201, 'ห้อง B101 Auditorium', 'อาคาร B', 1, 100, 'โปรเจคเตอร์,ระบบเสียง,Video Conference'),
(202, 'ห้อง B201', 'อาคาร B', 2, 30, 'โปรเจคเตอร์,ไวท์บอร์ด'),
(301, 'Meeting Room C', 'อาคาร C', 5, 8, 'TV Screen,ไวท์บอร์ด');

-- Bookings (ตัวอย่างการจอง)
INSERT INTO bookings (user_id, room_id, booking_date, start_time, end_time, purpose, status) 
VALUES 
(1, 101, '2026-02-15', '09:00', '12:00', 'ติวหนังสือสอบ Midterm', 'pending'),
(2, 201, '2026-02-16', '13:00', '16:00', 'อบรมพิเศษ AI', 'approved');