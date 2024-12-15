

// createAdmin.js
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const bcrypt = require('bcryptjs');
const User = require('./src/models/User'); // Đường dẫn đến model User

// Load biến môi trường từ file .env
dotenv.config();

// Kết nối đến MongoDB
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('Kết nối MongoDB thành công');
  } catch (error) {
    console.error('Lỗi kết nối MongoDB:', error.message);
    process.exit(1);
  }
};

// Hàm tạo admin
const createAdmin = async () => {
  const adminData = {
    name: 'Admin',
    email: 'admin@ThuVien.com', // Địa chỉ email admin
    password: 'admin123', // Mật khẩu admin
    role: 'admin', // Vai trò admin
  };

  try {
    // Kiểm tra xem admin đã tồn tại chưa
    const existingAdmin = await User.findOne({ email: adminData.email });
    if (existingAdmin) {
      console.log('Admin đã tồn tại. Vui lòng sử dụng email khác.');
      return;
    }

    // Mã hóa mật khẩu
    const salt = await bcrypt.genSalt(10);
    adminData.password = await bcrypt.hash(adminData.password, salt);

    // Tạo tài khoản admin mới
    const newAdmin = new User(adminData);
    await newAdmin.save();
    console.log('Tạo tài khoản admin thành công:', newAdmin);
  } catch (error) {
    console.error('Lỗi tạo tài khoản admin:', error.message);
  }
};

// Chạy script
const run = async () => {
  await connectDB();
  await createAdmin();
  mongoose.connection.close(); // Đóng kết nối sau khi hoàn thành
};

run();