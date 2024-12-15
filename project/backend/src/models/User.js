// src/models/User.js
// Mô hình dữ liệu người dùng

const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  // Tên người dùng
  name: {
    type: String,
    required: true,
    trim: true
  },
  // Email đăng nhập
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  // Mật khẩu đã được mã hóa
  password: {
    type: String,
    required: true
  },
  // Vai trò người dùng
  role: {
    type: String,
    enum: ['user', 'librarian', 'admin'], // Thêm 'admin' vào enum
    default: 'user'
  },
  // Trạng thái tài khoản
  status: {
    type: String,
    enum: ['active', 'inactive'],
    default: 'active'
  },
  // Ngày tạo tài khoản
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('User', UserSchema);