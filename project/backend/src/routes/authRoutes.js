// src/routes/authRoutes.js
const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { 
  validateRegister, 
  validateLogin,
  validationMiddleware 
} = require('../middleware/validationMiddleware');
// Thêm import cho authMiddleware và roleMiddleware
const authMiddleware = require('../middleware/authMiddleware');
const roleMiddleware = require('../middleware/roleMiddleware');

// Đăng ký
router.post(
  '/register', 
  validateRegister,
  validationMiddleware,
  authController.register
);

// Đăng nhập
router.post(
  '/login', 
  validateLogin,
  validationMiddleware,
  authController.login
);

// Xác minh token
router.get(
  '/verify-token', 
  authController.verifyToken
);

// Thêm route đăng ký admin với middleware xác thực
router.post(
  '/register-admin', 
  authMiddleware, 
  roleMiddleware(['admin']), 
  authController.register
);

module.exports = router;