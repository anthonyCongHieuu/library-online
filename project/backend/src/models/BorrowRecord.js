// src/models/BorrowRecord.js
// Mô hình dữ liệu phiếu mượn sách

const mongoose = require('mongoose');

const BorrowRecordSchema = new mongoose.Schema({
  // Tham chiếu đến sách
  book: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Book',
    required: true
  },
  // Tham chiếu đến người dùng
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  // Ngày mượn sách
  borrowDate: {
    type: Date,
    default: Date.now
  },
  // Ngày trả sách
  returnDate: {
    type: Date,
    required: true
  },
  // Trạng thái mượn sách
  status: {
    type: String,
    enum: ['borrowed', 'returned'],
    default: 'borrowed'
  }
});

module.exports = mongoose.model('BorrowRecord', BorrowRecordSchema);