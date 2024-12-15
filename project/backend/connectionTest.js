const mongoose = require('mongoose');
require('dotenv').config();

const connectDB = async () => {
  try {
    // Tắt cảnh báo strictQuery
    mongoose.set('strictQuery', false);

    // Cấu hình kết nối chi tiết
    const connectionOptions = {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      authSource: 'admin', // Quan trọng cho xác thực
    };

    // Log URI để kiểm tra (che mật khẩu)
    const sanitizedURI = process.env.MONGODB_URI.replace(/:[^:]*@/, ':****@');
    console.log(`🔗 Connecting to: ${sanitizedURI}`);

    // Kết nối MongoDB
    await mongoose.connect(process.env.MONGODB_URI, connectionOptions);

    console.log('✅ MongoDB connection established successfully');
  } catch (error) {
    console.error('❌ MongoDB connection error:', error.message);
    
    // Chi tiết lỗi
    console.error('Detailed Error:', {
      name: error.name,
      message: error.message,
      stack: error.stack
    });

    process.exit(1);
  }
};

// Kiểm tra kết nối
const testConnection = async () => {
  try {
    await connectDB();
    
    // Kiểm tra kết nối thành công
    const connection = mongoose.connection;
    console.log('📦 Database Information:');
    console.log(`🔗 Host: ${connection.host}`);
    console.log(`📂 Database Name: ${connection.db.databaseName}`);

  } catch (error) {
    console.error('Test connection failed:', error);
  }
};

testConnection();

module.exports = connectDB;