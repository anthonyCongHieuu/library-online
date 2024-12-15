// src/controllers/authController.js
// Điều khiển các chức năng xác thực người dùng

const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Đăng ký người dùng mới
exports.register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Kiểm tra người dùng đã tồn tại
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'Người dùng đã tồn tại' });
    }

    // Mã hóa mật khẩu
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Tạo người dùng mới
    const newUser = new User({
      name,
      email,
      password: hashedPassword
    });

    await newUser.save();

    res.status(201).json({ 
      message: 'Đăng ký thành công',
      userId: newUser._id 
    });
  } catch (error) {
    res.status(500).json({ message: 'Lỗi đăng ký', error: error.message });
  }
};

// Đăng nhập
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Kiểm tra người dùng
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Người dùng không tồn tại' });
    }

    // Kiểm tra mật khẩu
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Mật khẩu không chính xác' });
    }

    // Tạo token
    const token = jwt.sign(
      { 
        userId: user._id, 
        email: user.email,
        role: user.role 
      },
      process.env.JWT_SECRET,  // Sử dụng secret từ .env
      { 
        expiresIn: process.env.JWT_EXPIRES_IN || '30d' 
      }
    );

    console.log('Generated Token:', token);
    console.log('Used Secret:', process.env.JWT_SECRET);

    res.status(200).json({ 
      token, 
      userId: user._id,
      name: user.name,
      role: user.role
    });
  } catch (error) {
    res.status(500).json({ message: 'Lỗi đăng nhập', error: error.message });
  }
};
// Xác minh token
exports.verifyToken = async (req, res) => {
  try {
    const token = req.headers.authorization.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    const user = await User.findById(decoded.userId).select('-password');
    
    if (!user) {
      return res.status(401).json({ message: 'Không tìm thấy người dùng' });
    }

    res.status(200).json({ 
      user,
      isValid: true 
    });
  } catch (error) {
    res.status(401).json({ 
      message: 'Token không hợp lệ',
      isValid: false 
    });
  }
};