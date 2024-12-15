// src/routes/borrowRoutes.js
const express = require('express');
const router = express.Router();
const borrowController = require('../controllers/borrowController');
const authMiddleware = require('../middleware/authMiddleware');
const roleMiddleware = require('../middleware/roleMiddleware');

// Lấy danh sách phiếu mượn
router.get(
  '/', 
  authMiddleware,
  roleMiddleware(['admin', 'librarian']),
  borrowController.getAllBorrowRecords
);

// Tạo phiếu mượn
router.post(
  '/borrow', 
  authMiddleware,
  roleMiddleware(['admin', 'librarian']),
  borrowController.borrowBook
);

// Trả sách
router.patch(
  '/:borrowId/return', 
  authMiddleware,
  roleMiddleware(['admin', 'librarian']),
  borrowController.returnBook
);

// Xóa phiếu mượn
router.delete(
  '/:id', 
  authMiddleware,
  roleMiddleware(['admin', 'librarian']),
  borrowController.deleteBorrowRecord
);

module.exports = router;