// src/controllers/userController.js
// Điều khiển các chức năng quản lý người dùng

const User = require('../models/User');

// Lấy danh sách người dùng
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select('-password');
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: 'Lỗi lấy danh sách người dùng', error: error.message });
  }
};

exports.getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.userId)
      .select('-password')
      .populate('borrowRecords');
    
    if (!user) {
      return res.status(404).json({ message: 'Không tìm thấy người dùng' });
    }

    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ 
      message: 'Lỗi lấy thông tin cá nhân', 
      error: error.message 
    });
  }
};

exports.updateUserProfile = async (req, res) => {
  try {
    const { name, email } = req.body;
    
    const updatedUser = await User.findByIdAndUpdate(
      req.user.userId, 
      { name, email }, 
      { new: true }
    );

    res.status(200).json(updatedUser );
  } catch (error) {
    res.status(500).json({ 
      message: 'Lỗi cập nhật thông tin cá nhân', 
      error: error.message 
    });
  }
};



// Cập nhật thông tin người dùng
exports.updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    const updatedUser = await User.findByIdAndUpdate(
      id, 
      updateData, 
      { new: true, runValidators: true }
    ).select('-password');

    if (!updatedUser) {
      return res.status(404).json({ message: 'Không tìm thấy người dùng' });
    }

    res.status(200).json(updatedUser);
  } catch (error) {
    res.status(500).json({ message: 'Lỗi cập nhật người dùng', error: error.message });
  }
};
exports.updateUserRole = async (req, res) => {
  try {
    const { id } = req.params;
    const { role } = req.body;

    // Kiểm tra vai trò hợp lệ
    const validRoles = ['user', 'librarian', 'admin'];
    if (!validRoles.includes(role)) {
      return res.status(400).json({ message: 'Vai trò không hợp lệ' });
    }

    const updatedUser = await User.findByIdAndUpdate(
      id, 
      { role }, 
      { new: true, runValidators: true }
    ).select('-password');

    if (!updatedUser) {
      return res.status(404).json({ message: 'Không tìm thấy người dùng' });
    }

    res.status(200).json({
      message: 'Cập nhật vai trò thành công',
      user: updatedUser
    });
  } catch (error) {
    res.status(500).json({ 
      message: 'Lỗi cập nhật vai trò người dùng', 
      error: error.message 
    });
  }
};
// Thay đổi trạng thái người dùng
exports.changeUserStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const updatedUser = await User.findByIdAndUpdate(
      id, 
      { status }, 
      { new: true, runValidators: true }
    ).select('-password');

    if (!updatedUser) {
      return res.status(404).json({ message: 'Không tìm thấy người dùng' });
    }

    res.status(200).json(updatedUser);
  } catch (error) {
    res.status(500).json({ message: 'Lỗi thay đổi trạng thái', error: error.message });
  }
};