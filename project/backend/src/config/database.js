// Import thư viện mongoose để quản lý kết nối MongoDB
const mongoose = require('mongoose');

// Hàm kết nối cơ sở dữ liệu
const connectDB = async () => {
  try {
    // Tắt cảnh báo deprecated options
    mongoose.set('strictQuery', false);

    // Cấu hình kết nối chi tiết
    const connectionOptions = {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      authSource: 'admin',  // Quan trọng cho xác thực
      ssl: true,            // Bắt buộc với MongoDB Atlas
      retryWrites: true,
      w: 'majority'
    };

    // Log URI để kiểm tra (che mật khẩu)
    const sanitizedURI = process.env.MONGODB_URI.replace(/:[^:]*@/, ':****@');
    console.log(`🔗 Connecting to: ${sanitizedURI}`);

    // Thực hiện kết nối với MongoDB sử dụng connection string từ .env
    const conn = await mongoose.connect(process.env.MONGODB_URI, connectionOptions);
    
    // Thiết lập các sự kiện kết nối
    mongoose.connection.on('connected', () => {
      console.log(`🟢 MongoDB Connected: ${conn.connection.host}`);
    });

    mongoose.connection.on('error', (err) => {
      console.error(`🔴 MongoDB Connection Error: ${err.message}`);
    });

    mongoose.connection.on('disconnected', () => {
      console.log('🟠 MongoDB Disconnected');
    });

    return conn;
  } catch (error) {
    // Xử lý lỗi kết nối chi tiết
    console.error(`🔴 MongoDB Connection Error: ${error.message}`);
    console.error('Detailed Error:', {
      name: error.name,
      message: error.message,
      code: error.code,
      stack: error.stack
    });

    // Thoát ứng dụng nếu kết nối thất bại
    process.exit(1);
  }
};

// Xuất hàm kết nối để sử dụng ở server chính
module.exports = connectDB;