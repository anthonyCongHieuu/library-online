import React, { useState, useEffect } from 'react';
import { Container, Table, Button, Form, Modal } from 'react-bootstrap';
import { toast } from 'react-toastify';
import axiosInstance from '../api/axiosConfig';
import { useAuth } from '../contexts/AuthContext';

interface Book {
  _id: string;
  title: string;
  author: string;
  available: number;
}

interface BorrowRecord {
  _id: string;
  bookId: string;
  userId: string;
  borrowDate: string;
  returnDate: string;
  status: 'borrowed' | 'returned';
  book: Book;
  user: {
    name: string;
    email: string;
  };
}

// Định nghĩa kiểu dữ liệu trả về từ API
interface BorrowRecordsResponse {
  borrowRecords: BorrowRecord[];
}

interface BooksResponse {
  books: Book[];
}

const BorrowReturn = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const [borrowRecords, setBorrowRecords] = useState<BorrowRecord[]>([]);
  const [books, setBooks] = useState<Book[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    bookId: '',
    userId: user?.id || '',
    returnDate: ''
  });

  useEffect(() => {
    if (isAuthenticated) {
      fetchBorrowRecords();
      fetchBooks();
    }
  }, [isAuthenticated]);

  const fetchBorrowRecords = async () => {
    try {
      const response = await axiosInstance.get<BorrowRecordsResponse>('/borrows');
      setBorrowRecords(response.data.borrowRecords);
    } catch (error: any) {
      console.error('Fetch Borrow Records Error:', error.response);
      if (error.response?.status === 403) {
        toast.error('Bạn không có quyền truy cập danh sách mượn sách');
      } else if (error.response?.status === 401) {
        logout();
        window.location.href = '/login';
      } else {
        toast.error('Không thể tải danh sách mượn sách');
      }
    }
  };

  const fetchBooks = async () => {
    try {
      const response = await axiosInstance.get<BooksResponse>('/books');
      setBooks(response.data.books);
    } catch (error: any) {
      console.error('Fetch Books Error:', error.response);
      if (error.response?.status === 403) {
        toast.error('Bạn không có quyền truy cập danh sách sách');
      } else if (error.response?.status === 401) {
        logout();
        window.location.href = '/login';
      } else {
        toast.error('Không thể tải danh sách sách');
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await axiosInstance.post('/borrows/borrow', {
        ...formData,
        userId: user?.id // Đảm bảo userId được gửi
      });
      toast.success('Đăng ký mượn sách thành công!');
      setShowModal(false);
      fetchBorrowRecords();
      resetForm();
    } catch (error: any) {
      console.error('Submit Borrow Error:', error.response);
      const errorMessage = error.response?.data?.message || 'Có lỗi xảy ra. Vui lòng thử lại!';
      toast.error(errorMessage);
    }
  };

  const handleReturn = async (id: string) => {
    try {
      await axiosInstance.patch(`/borrows/${id}/return`);
      toast.success('Trả sách thành công!');
      fetchBorrowRecords();
    } catch (error: any) {
      console.error('Return Book Error:', error.response);
      const errorMessage = error.response?.data?.message || 'Không thể trả sách. Vui lòng thử lại!';
      toast.error(errorMessage);
    }
  };

  const resetForm = () => {
    setFormData({
      bookId: '',
      userId: user?.id || '',
      returnDate: ''
    });
  };

  return (
    <Container>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Quản Lý Mượn/Trả Sách</h2>
        <Button variant="primary" onClick={() => setShowModal(true)}>
          Đăng Ký Mượn Sách
        </Button>
      </div>

      <div className="table-container">
        <Table striped bordered hover>
          <thead>
            <tr>
              <th>Tên Sách</th>
              <th>Người Mượn</th>
              <th>Ngày Mượn</th>
              <th>Ngày Trả</th>
              <th>Trạng Thái</th>
              <th>Thao Tác</th>
            </tr>
          </thead>
          <tbody>
            {borrowRecords.map((record) => (
              <tr key={record._id}>
                <td>{record.book?.title || 'Không xác định'}</td>
                <td>{record.user?.name || 'Không xác định'}</td>
                <td>{record.borrowDate ? new Date(record.borrowDate).toLocaleDateString() : 'Chưa xác định'}</td>
                <td>{record.returnDate ? new Date(record.returnDate).toLocaleDateString() : 'Chưa trả'}</td>
                <td>{record.status === 'borrowed' ? 'Đang mượn' : 'Đã trả'}</td>
                <td>
                  {record.status === 'borrowed' && (
                    <Button variant="danger" onClick={() => handleReturn(record._id)}>
                      Trả Sách
                    </Button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </div>

      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Đăng Ký Mượn Sách</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSubmit}>
            <Form.Group controlId="formBookId">
              <Form.Label>Chọn Sách</Form.Label>
              <Form.Control
                as="select"
                value={formData.bookId}
                onChange={(e) => setFormData({ ...formData, bookId: e.target.value })}
                required
              >
                <option value="">Chọn sách...</option>
                {books.map((book) => (
                  <option 
                    key={book._id} 
                    value={book._id}
                    disabled={book.available === 0}
                  >
                    {book.title}
                  </option>
                ))}
              </Form.Control>
            </Form.Group>
            <Form.Group controlId="formReturnDate">
              <Form.Label>Ngày Trả</Form.Label>
              <Form.Control
                type="date"
                value={formData.returnDate}
                onChange={(e) => setFormData({ ...formData, returnDate: e.target.value })}
                required
              />
            </Form.Group>
            <Button variant="primary" type="submit">
              Gửi
            </Button>
          </Form>
        </Modal.Body>
      </Modal>
    </Container>
  );
};

export default BorrowReturn;
