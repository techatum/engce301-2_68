// student_id_express_routes.js
// รายชื่อไฟล์ที่ต้องส่ง: student_id_express_routes.js หรือ .txt

const express = require('express');
const cors = require('cors');
const db = require('./database/connection'); // อ้างอิงไฟล์ connection ที่สร้างไว้

const app = express();
const PORT = 3000;

// Middleware
app.use(cors()); // อนุญาตให้ HTML เรียก API ได้
app.use(express.json());

// ==========================================
// 1. DATABASE LAYER (SQL Queries)
// ==========================================
class BookingDatabase {
    static getAllRooms() {
        return new Promise((resolve, reject) => {
            const sql = `SELECT * FROM rooms`;
            db.all(sql, [], (err, rows) => {
                if (err) reject(err);
                else {
                    // แปลง facilities string กลับเป็น array เพื่อให้ตรงกับ format JSON
                    const rooms = rows.map(r => ({
                        ...r,
                        facilities: r.facilities ? r.facilities.split(',') : []
                    }));
                    resolve(rooms);
                }
            });
        });
    }

    static getRoomById(id) {
        return new Promise((resolve, reject) => {
            db.get(`SELECT * FROM rooms WHERE id = ?`, [id], (err, row) => {
                if (err) reject(err);
                else resolve(row);
            });
        });
    }

    static findOverlapping(room_id, date, start_time, end_time) {
        // เช็คช่วงเวลาที่ซ้อนทับกัน
        const sql = `
            SELECT * FROM bookings
            WHERE room_id = ?
              AND booking_date = ?
              AND status != 'cancelled'
              AND (
                (start_time < ? AND end_time > ?)
              )
        `;
        // Logic overlaps: (StartA < EndB) AND (EndA > StartB)
        return new Promise((resolve, reject) => {
            db.all(sql, [room_id, date, end_time, start_time], (err, rows) => {
                if (err) reject(err);
                else resolve(rows);
            });
        });
    }

    static createBooking(data) {
        const sql = `
            INSERT INTO bookings (user_id, room_id, booking_date, start_time, end_time, purpose, status)
            VALUES (?, ?, ?, ?, ?, ?, ?)
        `;
        return new Promise((resolve, reject) => {
            // Mock user_id = 1 (Student) สำหรับการสอบ
            const user_id = 1;
            db.run(sql, [user_id, data.room_id, data.booking_date, data.start_time, data.end_time, data.purpose, 'pending'], function (err) {
                if (err) reject(err);
                else resolve({ id: this.lastID, ...data, status: 'pending' });
            });
        });
    }

    static cancelBooking(id) {
        return new Promise((resolve, reject) => {
            const sql = `UPDATE bookings SET status = 'cancelled' WHERE id = ?`;
            db.run(sql, [id], function (err) {
                if (err) reject(err);
                else resolve(this.changes); // จำนวน row ที่ถูก update
            });
        });
    }
}

// ==========================================
// 2. SERVICE LAYER (Business Logic)
// ==========================================
class BookingService {
    static async getRooms() {
        return await BookingDatabase.getAllRooms();
    }

    static async createBooking(bookingData) {
        // 1. ตรวจสอบว่าห้องมีอยู่จริง
        const room = await BookingDatabase.getRoomById(bookingData.room_id);
        if (!room) {
            throw new Error('Room not found');
        }

        // 2. ตรวจสอบเวลา (Start < End)
        if (bookingData.start_time >= bookingData.end_time) {
            throw new Error('Invalid time range');
        }

        // 3. ตรวจสอบว่าห้องว่าง (Availability Check)
        const overlaps = await BookingDatabase.findOverlapping(
            bookingData.room_id,
            bookingData.booking_date,
            bookingData.start_time,
            bookingData.end_time
        );

        if (overlaps.length > 0) {
            throw new Error('Room not available during this time');
        }

        // 4. บันทึก
        return await BookingDatabase.createBooking(bookingData);
    }

    static async cancelBooking(id) {
        const changes = await BookingDatabase.cancelBooking(id);
        if (changes === 0) {
            throw new Error('Booking not found');
        }
        return { message: "Booking cancelled successfully" };
    }
}

// ==========================================
// 3. CONTROLLER LAYER (Request/Response)
// ==========================================
class BookingController {
    static async getAllRooms(req, res) {
        try {
            const rooms = await BookingService.getRooms();
            res.status(200).json(rooms);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    static async createBooking(req, res) {
        try {
            const { room_id, booking_date, start_time, end_time, purpose, attendees } = req.body;

            // Validation ง่ายๆ
            if (!room_id || !booking_date || !start_time || !end_time || !purpose) {
                return res.status(400).json({ error: 'Missing required fields' });
            }

            const booking = await BookingService.createBooking({
                room_id, booking_date, start_time, end_time, purpose, attendees
            });

            res.status(201).json(booking);
        } catch (error) {
            if (error.message === 'Room not available') {
                res.status(409).json({ error: error.message });
            } else if (error.message === 'Room not found') {
                res.status(404).json({ error: error.message });
            } else {
                console.error(error);
                res.status(500).json({ error: 'Internal server error' });
            }
        }
    }

    static async cancelBooking(req, res) {
        try {
            const { id } = req.params;
            const result = await BookingService.cancelBooking(id);
            res.status(200).json(result);
        } catch (error) {
            res.status(404).json({ error: error.message });
        }
    }
}

// ==========================================
// 4. ROUTER LAYER (Express Routes)
// ==========================================
const router = express.Router();

// GET /api/rooms - ดึงรายการห้องทั้งหมด
router.get('/rooms', BookingController.getAllRooms);

// POST /api/bookings - สร้างการจองใหม่
router.post('/bookings', BookingController.createBooking);

// DELETE /api/bookings/:id - ยกเลิกการจอง
router.delete('/bookings/:id', BookingController.cancelBooking);

// Register Routes
app.use('/api', router);

// ให้ Server สามารถอ่านไฟล์ HTML/CSS ในโฟลเดอร์ปัจจุบันได้
app.use(express.static(__dirname));

// เมื่อเข้าหน้าแรก (/) ให้ส่งไฟล์ HTML ไปแสดง
app.get('/', (req, res) => {
    // แก้ชื่อไฟล์ให้ตรงกับไฟล์ HTML ของคุณเป๊ะๆ นะครับ
    res.sendFile(__dirname + '/student_id_booking.html'); 
});

// Start Server
app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
});