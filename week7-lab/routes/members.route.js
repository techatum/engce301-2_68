const express = require('express');
const router = express.Router();
const memberController = require('../controllers/member.controller');

router.get('/', memberController.getAll);
router.get('/:id', memberController.getById);
router.post('/', memberController.create);
router.put('/:id', memberController.update);

// [เพิ่มต่อท้าย]
router.delete('/:id', memberController.delete);

module.exports = router;