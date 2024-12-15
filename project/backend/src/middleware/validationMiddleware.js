// src/middleware/validationMiddleware.js
const { body, validationResult } = require('express-validator');

// Validation cho đăng ký
exports.validateRegister = [
  body('name')
    .trim()
    .isLength({ min: 2 }).withMessage('Tên phải có ít nhất 2 ký tự'),
  body('email')
    .trim()
    .isEmail().withMessage('Email không hợp lệ'),
  body('password')
    .isLength({ min: 6 }).withMessage('Mật khẩu phải có ít nhất 6 ký tự')
];

// Validation cho đăng nhập
exports.validateLogin = [
  body('email')
    .trim()
    .isEmail().withMessage('Email không hợp lệ'),
  body('password')
    .notEmpty().withMessage('Mật khẩu không được để trống')
];

// Middleware kiểm tra validation
exports.validationMiddleware = (req, res, next) => {
  const errors = validationResult(req);
  
  if (!errors.isEmpty()) {
    return res.status(400).json({ 
      errors: errors.array().map(err => err.msg) 
    });
  }
  
  next();
};