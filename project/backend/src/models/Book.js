// src/models/Book.js
// Mô hình dữ liệu sách

const mongoose = require('mongoose');

const BookSchema = new mongoose.Schema({
  // Tiêu đề sách
  title: {
    type: String,
    required: true,
    trim: true
  },
  // Tác giả
  author: {
    type: String,
    required: true,
    trim: true
  },
  // Mã ISBN
  isbn: {
    type: String,
    unique: true,
    required: true
  },
  // Thể loại sách
  category: {
    type: String,
    required: true
  },
  // Tổng số lượng sách
  quantity: {
    type: Number,
    required: true,
    min: 0
  },
  // Số lượng sách có sẵn
  available: {
    type: Number,
    required: true,
    min: 0
  },
  // Ngày nhập sách
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Book', BookSchema);