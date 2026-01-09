const express = require('express');
const router = express.Router();
const borrowingController = require('../controllers/borrowing.controller');

// 1. Action Routes (POST/PUT)
router.post('/borrow', borrowingController.borrowBook);
router.put('/:id/return', borrowingController.returnBook);

// 2. Specific Query Routes (วางไว้ก่อน /:id)
router.get('/overdue', borrowingController.getOverdue);       // /api/borrowings/overdue
router.get('/member/:memberId', borrowingController.getByMember); // /api/borrowings/member/1

// 3. General Routes
router.get('/', borrowingController.getAll);                  // /api/borrowings
router.get('/:id', borrowingController.getById);              // /api/borrowings/1

// 4. Delete Route
router.delete('/:id', borrowingController.delete);

module.exports = router;