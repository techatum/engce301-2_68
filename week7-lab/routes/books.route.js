const express = require('express');
const router = express.Router();
const bookController = require('../controllers/book.controller');

// เรียงลำดับสำคัญมาก! เอา search ไว้ก่อน :id ไม่งั้นระบบจะนึกว่า "search" คือ id ของหนังสือ
router.get('/search', bookController.search); 

router.get('/', bookController.getAll);
router.get('/:id', bookController.getById);
router.post('/', bookController.create);
router.put('/:id', bookController.update);

router.delete('/:id', bookController.delete);

module.exports = router;