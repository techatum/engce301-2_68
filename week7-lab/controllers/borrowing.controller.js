// file: controllers/borrowing.controller.js
const BorrowingService = require('../services/borrowing.service');

// 1. ยืมหนังสือ (Borrow Book)
exports.borrowBook = async (req, res) => {
    try {
        const result = await BorrowingService.borrowBook(req.body);
        res.status(201).json({
            success: true,
            message: "Book borrowed successfully",
            data: result
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            error: error.message
        });
    }
};

// 2. คืนหนังสือ (Return Book)
exports.returnBook = async (req, res) => {
    try {
        const { id } = req.params;
        const result = await BorrowingService.returnBook(id);
        res.status(200).json({
            success: true,
            message: "Book returned successfully",
            data: result
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            error: error.message
        });
    }
};

// 3. ดูรายการยืมทั้งหมด (Get All Borrowings)
exports.getAll = async (req, res) => {
    try {
        const borrowings = await BorrowingService.getAllBorrowings();
        res.json(borrowings);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// 4. ดูรายการยืมตาม ID (Get Borrowing By ID)
exports.getById = async (req, res) => {
    try {
        const borrowing = await BorrowingService.getBorrowingById(req.params.id);
        res.json(borrowing);
    } catch (error) {
        res.status(404).json({ error: error.message });
    }
};

// 5. ดูประวัติการยืมของสมาชิก (Get Borrowings By Member ID)
exports.getByMember = async (req, res) => {
    try {
        const { memberId } = req.params;
        const borrowings = await BorrowingService.getBorrowingsByMember(memberId);
        res.json(borrowings);
    } catch (error) {
        res.status(404).json({ error: error.message });
    }
};

// 6. ดูรายการที่เกินกำหนดคืน (Get Overdue Borrowings)
exports.getOverdue = async (req, res) => {
    try {
        const overdueList = await BorrowingService.getOverdueBorrowings();
        res.json(overdueList);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// [เพิ่มต่อท้าย]
exports.delete = async (req, res) => {
    try {
        await BorrowingService.deleteBorrowing(req.params.id);
        res.json({ message: 'Borrowing record deleted successfully' });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};