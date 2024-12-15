// src/routes/userRoutes.js
const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const authMiddleware = require('../middleware/authMiddleware');
const roleMiddleware = require('../middleware/roleMiddleware');

// Lấy danh sách người dùng (Chỉ admin)
router.get(
  '/', 
  authMiddleware,
  roleMiddleware(['admin', 'librarian']),
  userController.getAllUsers
);


// Cập nhật thông tin người dùng
router.put(
  '/:id/role', 
  authMiddleware,
  roleMiddleware(['admin']), // Chỉ admin được đổi vai trò
  userController.updateUserRole // Đảm bảo method này tồn tại
);

// Thay đổi trạng thái người dùng (Chỉ admin)
router.patch(
  '/:id/status', 
  authMiddleware,
  roleMiddleware(['admin']),
  userController.changeUserStatus
);

// Cập nhật vai trò người dùng (Chỉ admin)
router.patch(
  '/:id/role', 
  authMiddleware,
  roleMiddleware(['admin']),
  userController.updateUserRole // Đảm bảo method này tồn tại trong userController
);

module.exports = router;