// src/controllers/borrowController.js
// Điều khiển các chức năng mượn và trả sách

const BorrowRecord = require('../models/BorrowRecord');
const Book = require('../models/Book');

// Lấy danh sách phiếu mượn
exports.getAllBorrowRecords = async (req, res) => {
  try {
    const { 
      status, 
      page = 1, 
      limit = 10 
    } = req.query;

    const query = {};
    
    // Lọc theo trạng thái
    if (status) {
      query.status = status;
    }

    const borrowRecords = await BorrowRecord.find(query)
      .populate('book', 'title author')
      .populate('user', 'name email')
      .limit(Number(limit))
      .skip((page - 1) * limit)
      .sort({ borrowDate: -1 });

    const total = await BorrowRecord.countDocuments(query);

    res.status(200).json({
      borrowRecords,
      totalPages: Math.ceil(total / limit),
      currentPage: Number(page)
    });
  } catch (error) {
    res.status(500).json({ 
      message: 'Lỗi lấy danh sách mượn sách', 
      error: error.message 
    });
  }
};

// Tạo phiếu mượn sách
exports.borrowBook = async (req, res) => {
  const session = await BorrowRecord.startSession();
  session.startTransaction();

  try {
    const { bookId, userId, returnDate } = req.body;

    // Kiểm tra sách
    const book = await Book.findById(bookId);
    if (!book) {
      return res.status(404).json({ message: 'Sách không tồn tại' });
    }

    // Kiểm tra số lượng sách
    if (book.available <= 0) {
      return res.status(400).json({ message: 'Sách đã hết' });
    }

    // Tạo phiếu mượn
    const borrowRecord = new BorrowRecord({
      book: bookId,
      user: userId,
      returnDate: new Date(returnDate)
    });

    // Giảm số lượng sách
    book.available -= 1;

    // Lưu dữ liệu
    await borrowRecord.save({ session });
    await book.save({ session });

    await session.commitTransaction();
    session.endSession();

    res.status(201).json({
      message: 'Mượn sách thành công',
      borrowRecord
    });
  } catch (error) {
    await session.abortTransaction();
    session.endSession();

    res.status(500).json({ 
      message: 'Lỗi mượn sách', 
      error: error.message 
    });
  }
};

// Trả sách
exports.returnBook = async (req, res) => {
  const session = await BorrowRecord.startSession();
  session.startTransaction();

  try {
    const { borrowId } = req.params;

    // Kiểm tra phiếu mượn
    const borrowRecord = await BorrowRecord.findById(borrowId).populate('book');
    if (!borrowRecord) {
      return res.status(404).json({ message: 'Phiếu mượn không tồn tại' });
    }

    // Cập nhật trạng thái phiếu mượn
    borrowRecord.status = 'returned';
    borrowRecord.returnDate = new Date();

    // Tăng số lượng sách
    const book = borrowRecord.book;
    book.available += 1;

    // Lưu dữ liệu
    await borrowRecord.save({ session });
    await book.save({ session });

    await session.commitTransaction();
    session.endSession();

    res.status(200).json({
      message: 'Trả sách thành công',
      borrowRecord
    });
  } catch (error) {
    await session.abortTransaction();
    session.endSession();

    res.status(500).json({ 
      message: 'Lỗi trả sách', 
      error: error.message 
    });
  }
};

// Xóa phiếu mượn
exports.deleteBorrowRecord = async (req, res) => {
  try {
    const { id } = req.params;

    const deletedRecord = await BorrowRecord.findByIdAndDelete(id);
    if (!deletedRecord) {
      return res.status(404).json({ message: 'Không tìm thấy phiếu mượn' });
    }

    res.status(200).json({
      message: 'Xóa phiếu mượn thành công',
      borrowRecord: deletedRecord
    });
  } catch (error) {
    res.status(500).json({ 
      message: 'Lỗi xóa phiếu mượn', 
      error: error.message 
    });
  }
};
