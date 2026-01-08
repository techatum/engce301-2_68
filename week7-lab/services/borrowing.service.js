const BorrowingDB = require('../database/borrowings.db');
const BookDB = require('../database/books.db');
const MemberDB = require('../database/members.db');

class BorrowingService {
    // ===== BORROW BOOK =====
    static async borrowBook(borrowData) {
        try {
            const { book_id, member_id } = borrowData;

            // TODO: 1. ตรวจสอบว่า book มีอยู่จริงและมีเล่มว่าง
            

            // TODO: 2. ตรวจสอบว่า member มีอยู่จริงและ status = 'active'
            

            // TODO: 3. ตรวจสอบว่า member ยืมไม่เกิน 3 เล่ม
            

            // TODO: 4. คำนวณ due_date (14 วันจากวันนี้)
            const borrowDate = new Date();
            const dueDate = new Date();
            // เติมโค้ดคำนวณ due_date
            

            // TODO: 5. สร้าง borrowing record
            

            // TODO: 6. ลด available_copies
            

            return /* ส่งข้อมูลการยืมกลับ */;
        } catch (error) {
            throw error;
        }
    }

    // ===== RETURN BOOK =====
    static async returnBook(borrowingId) {
        try {
            // TODO: 1. ดึงข้อมูล borrowing
            

            // TODO: 2. ตรวจสอบว่ายังไม่คืน
            

            // TODO: 3. บันทึก return_date และเปลี่ยน status
            

            // TODO: 4. เพิ่ม available_copies
            

            // TODO: 5. คำนวณค่าปรับ (ถ้าเกิน due_date)
            // ค่าปรับ = 20 บาท/วัน
            

            return /* ส่งข้อมูลการคืนพร้อมค่าปรับ */;
        } catch (error) {
            throw error;
        }
    }

    // TODO: เขียน getOverdueBorrowings
    static async getOverdueBorrowings() {
        // เขียนโค้ดตรงนี้
    }
}

module.exports = BorrowingService;