import React, { useState, useEffect } from 'react';
import { Container, Table, Button, Form, Modal } from 'react-bootstrap';
import { toast } from 'react-toastify';
import axios from 'axios';

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

const BorrowReturn = () => {
  const [borrowRecords, setBorrowRecords] = useState<BorrowRecord[]>([]);
  const [books, setBooks] = useState<Book[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    bookId: '',
    userId: '',
    returnDate: ''
  });

  useEffect(() => {
    fetchBorrowRecords();
    fetchBooks();
  }, []);

  const fetchBorrowRecords = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/borrows');
      setBorrowRecords(response.data);
    } catch (error) {
      toast.error('Không thể tải danh sách mượn sách');
    }
  };

  const fetchBooks = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/books');
      setBooks(response.data);
    } catch (error) {
      toast.error('Không thể tải danh sách sách');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:5000/api/borrows', formData);
      toast.success('Đăng ký mượn sách thành công!');
      setShowModal(false);
      fetchBorrowRecords();
      resetForm();
    } catch (error) {
      toast.error('Có lỗi xảy ra. Vui lòng thử lại!');
    }
  };

  const handleReturn = async (id: string) => {
    try {
      await axios.put(`http://localhost:5000/api/borrows/${id}/return`);
      toast.success('Trả sách thành công!');
      fetchBorrowRecords();
    } catch (error) {
      toast.error('Không thể trả sách. Vui lòng thử lại!');
    }
  };

  const resetForm = () => {
    setFormData({
      bookId: '',
      userId: '',
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
                <td>{record.book.title}</td>
                <td>{record.user.name}</td>
                <td>{new Date(record.borrowDate).toLocaleDateString('vi-VN')}</td>
                <td>{new Date(record.returnDate).toLocaleDateString('vi-VN')}</td>
                <td>
                  {record.status === 'borrowed' ? 'Đang mượn' : 'Đã trả'}
                </td>
                <td>
                  {record.status === 'borrowed' && (
                    <Button
                      variant="success"
                      size="sm"
                      onClick={() => handleReturn(record._id)}
                    >
                      Trả Sách
                    </Button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </div>

      <Modal show={showModal} onHide={() => {
        setShowModal(false);
        resetForm();
      }}>
        <Modal.Header closeButton>
          <Modal.Title>Đăng Ký Mượn Sách</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>Chọn Sách</Form.Label>
              <Form.Select
                value={formData.bookId}
                onChange={(e) => setFormData({ ...formData, bookId: e.target.value })}
                required
              >
                <option value="">Chọn sách...</option>
                {books.map((book) => (
                  <option key={book._id} value={book._id} disabled={book.available === 0}>
                    {book.title} ({book.available} cuốn có sẵn)
                  </option>
                ))}
              </Form.Select>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Ngày Trả</Form.Label>
              <Form.Control
                type="date"
                value={formData.returnDate}
                onChange={(e) => setFormData({ ...formData, returnDate: e.target.value })}
                min={new Date().toISOString().split('T')[0]}
                required
              />
            </Form.Group>

            <div className="d-flex justify-content-end">
              <Button variant="secondary" className="me-2" onClick={() => {
                setShowModal(false);
                resetForm();
              }}>
                Hủy
              </Button>
              <Button variant="primary" type="submit">
                Đăng Ký Mượn
              </Button>
            </div>
          </Form>
        </Modal.Body>
      </Modal>
    </Container>
  );
};

export default BorrowReturn;