// server.js
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
require('dotenv').config();

// Import Routes
const authRoutes = require('./src/routes/authRoutes');
const userRoutes = require('./src/routes/userRoutes');
const bookRoutes = require('./src/routes/bookRoutes');
const borrowRoutes = require('./src/routes/borrowRoutes');

mongoose.set('strictQuery', false); // Chuyển về hành vi mới

// Khởi tạo ứng dụng
const app = express();

// Middleware cơ bản
app.use(cors({
  origin: process.env.CORS_ORIGIN,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(helmet()); // Bảo mật HTTP headers
app.use(morgan('combined')); // Logging
app.use(express.json()); // Parse JSON bodies
app.use(express.urlencoded({ extended: true })); // Parse URL-encoded bodies

// Kết nối MongoDB
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('Kết nối MongoDB thành công'))
.catch((err) => console.error('Lỗi kết nối MongoDB:', err));

// Đăng ký Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/books', bookRoutes);
app.use('/api/borrows', borrowRoutes);

// Middleware xử lý lỗi toàn cục
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    message: 'Đã xảy ra lỗi hệ thống',
    error: process.env.NODE_ENV === 'development' ? err.message : {}
  });
});

// Xử lý route không tồn tại
app.use((req, res) => {
  res.status(404).json({ message: 'Đường dẫn không tồn tại' });
});

// Khởi động server
const PORT = process.env.PORT || 5000;
const server = app.listen(PORT, () => {
  console.log(`Server đang chạy trên cổng ${PORT}`);
});

// Xử lý các trường hợp đóng server
process.on('SIGINT', () => {
  console.log('Đóng kết nối server...');
  server.close(() => {
    mongoose.connection.close(false, () => {
      console.log('Kết nối MongoDB đã đóng');
      process.exit(0);
    });
  });
});

