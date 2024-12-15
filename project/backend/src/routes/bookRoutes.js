// src/routes/bookRoutes.js
const express = require('express');
const router = express.Router();
const bookController = require('../controllers/bookController');
const authMiddleware = require('../middleware/authMiddleware');
const { requirePermission } = require('../middleware/permissionMiddleware'); // Đảm bảo import đúng

// Lấy danh sách sách (Ai cũng được)
router.get(
  '/', 
  authMiddleware,
  bookController.getAllBooks
);

// Thêm sách (Chỉ admin và thủ thư)
router.post(
  '/', 
  authMiddleware,
  requirePermission('manage_books'), // Sử dụng requirePermission
  bookController.createBook
);

// Cập nhật sách
router.put(
  '/:id', 
  authMiddleware,
  requirePermission('manage_books'),
  bookController.updateBook
);

// Xóa sách
router.delete(
  '/:id', 
  authMiddleware,
  requirePermission('manage_books'),
  bookController.deleteBook
);

module.exports = router;