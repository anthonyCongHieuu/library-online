const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const jwt = require('jsonwebtoken');
const path = require('path');
require('dotenv').config();

// Import Routes
const authRoutes = require('./src/routes/authRoutes');
const userRoutes = require('./src/routes/userRoutes');
const bookRoutes = require('./src/routes/bookRoutes');
const borrowRoutes = require('./src/routes/borrowRoutes');

// Middleware xác thực JWT
const authenticateJWT = (req, res, next) => {
  try {
    console.log('Full Request Headers:', req.headers);

    const authHeader = req.headers.authorization;
    
    if (!authHeader) {
      console.log('No Authorization Header');
      return res.status(401).json({ 
        message: 'Không có token',
        details: 'Authorization header is missing' 
      });
    }

    const tokenParts = authHeader.split(' ');
    
    if (tokenParts.length !== 2 || tokenParts[0] !== 'Bearer') {
      console.log('Invalid Token Format');
      return res.status(401).json({ 
        message: 'Định dạng token không hợp lệ',
        details: 'Token must be in "Bearer <token>" format' 
      });
    }

    const token = tokenParts[1];
    
    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
      if (err) {
        console.error('Authentication Error:', {
          name: err.name,
          message: err.message,
          stack: err.stack
        });

        if (err.name === 'JsonWebTokenError') {
          return res.status(401).json({ 
            message: 'Token không hợp lệ',
            error: err.message 
          });
        }

        if (err.name === 'TokenExpiredError') {
          return res.status(401).json({ 
            message: 'Token đã hết hạn',
            error: err.message 
          });
        }

        return res.status(401).json({ 
          message: 'Xác thực không thành công',
          error: err.message 
        });
      }

      req.user = decoded;
      next();
    });
  } catch (error) {
    console.error('Unexpected Error:', error);
    return res.status(500).json({ 
      message: 'Đã xảy ra lỗi hệ thống',
      error: error.message 
    });
  }
};

mongoose.set('strictQuery', false); // Chuyển về hành vi mới

// Khởi tạo ứng dụng Express
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

// Phục vụ các file tĩnh cho avatar
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Route gốc
app.get('/', (req, res) => {
  res.status(200).json({ message: "Welcome to the Library Management API!" });
});

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
