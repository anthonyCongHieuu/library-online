// src/controllers/bookController.js
// Điều khiển các chức năng quản lý sách

const Book = require('../models/Book');
const BorrowRecord = require('../models/BorrowRecord');

// Lấy danh sách sách
exports.getAllBooks = async (req, res) => {
  try {
    // Hỗ trợ tìm kiếm và phân trang
    const { 
      search = '', 
      page = 1, 
      limit = 10, 
      category 
    } = req.query;

    const query = {};
    
    // Tìm kiếm theo tên sách hoặc tác giả
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { author: { $regex: search, $options: 'i' } }
      ];
    }

    // Lọc theo thể loại
    if (category) {
      query.category = category;
    }

    const books = await Book.find(query)
      .limit(Number(limit))
      .skip((page - 1) * limit);

    const total = await Book.countDocuments(query);

    res.status(200).json({
      books,
      totalPages: Math.ceil(total / limit),
      currentPage: Number(page)
    });
  } catch (error) {
    res.status(500).json({ 
      message: 'Lỗi lấy danh sách sách', 
      error: error.message 
    });
  }
};

// Thêm sách mới
exports.createBook = async (req, res) => {
  try {
    const { title, author, isbn, category, quantity } = req.body;

    // Kiểm tra ISBN đã tồn tại
    const existingBook = await Book.findOne({ isbn });
    if (existingBook) {
      return res.status(400).json({ message: 'Sách với ISBN này đã tồn tại' });
    }

    const newBook = new Book({
      title,
      author,
      isbn,
      category,
      quantity,
      available: quantity
    });

    await newBook.save();

    res.status(201).json({
      message: 'Thêm sách thành công',
      book: newBook
    });
  } catch (error) {
    res.status(500).json({ 
      message: 'Lỗi thêm sách', 
      error: error.message 
    });
  }
};

// Cập nhật thông tin sách
exports.updateBook = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    // Không cho phép cập nhật số lượng ở đây
    delete updateData.quantity;
    delete updateData.available;

    const updatedBook = await Book.findByIdAndUpdate(
      id, 
      updateData, 
      { new: true, runValidators: true }
    );

    if (!updatedBook) {
      return res.status(404).json({ message: 'Không tìm thấy sách' });
    }

    res.status(200).json({
      message: 'Cập nhật sách thành công',
      book: updatedBook
    });
  } catch (error) {
    res.status(500).json({ 
      message: 'Lỗi cập nhật sách', 
      error: error.message 
    });
  }
};
exports.searchBooks = async (req, res) => {
  try {
    const { 
      query = '', 
      category = '', 
      author = '',
      page = 1, 
      limit = 10 
    } = req.query;

    // Xây dựng điều kiện tìm kiếm
    const searchCondition = {
      $or: [
        { title: { $regex: query, $options: 'i' } },
        { author: { $regex: query, $options: 'i' } },
        { isbn: { $regex: query, $options: 'i' } }
      ]
    };

    // Thêm điều kiện thể loại nếu có
    if (category) {
      searchCondition.category = category;
    }

    // Thêm điều kiện tác giả nếu có
    if (author) {
      searchCondition.author = { $regex: author, $options: 'i' };
    }

    // Thực hiện tìm kiếm
    const books = await Book.find(searchCondition)
      .limit(Number(limit))
      .skip((page - 1) * limit);

    const total = await Book.countDocuments(searchCondition);

    res.status(200).json({
      books,
      totalPages: Math.ceil(total / limit),
      currentPage: Number(page)
    });
  } catch (error) {
    res.status(500).json({ 
      message: 'Lỗi tìm kiếm sách', 
      error: error.message 
    });
  }
};
// Xóa sách
exports.deleteBook = async (req, res) => {
  try {
    const { id } = req.params;

    // Kiểm tra sách có đang được mượn không
    const activeBorrows = await BorrowRecord.countDocuments({
      book: id,
      status: 'borrowed'
    });

    if (activeBorrows > 0) {
      return res.status(400).json({ 
        message: 'Không thể xóa sách đang được mượn' 
      });
    }

    const deletedBook = await Book.findByIdAndDelete(id);

    if (!deletedBook) {
      return res.status(404).json({ message: 'Không tìm thấy sách' });
    }

    res.status(200).json({
      message: 'Xóa sách thành công',
      book: deletedBook
    });
  } catch (error) {
    res.status(500).json({ 
      message: 'Lỗi xóa sách', 
      error: error.message 
    });
  }


  
};