import React, { useState, useEffect } from 'react';
import { Container, Table, Button, Form, Modal } from 'react-bootstrap';
import { toast } from 'react-toastify';
import axiosInstance from '../api/axiosConfig';
import { useAuth } from '../contexts/AuthContext';
import styles from '../styles/pages/BookManagement.module.css';

interface Book {
  _id: string;
  title: string;
  author: string;
  isbn: string;
  category: string;
  quantity: number;
  available: number;
}

const BookManagement = () => {
  const { user, isAuthenticated } = useAuth();
  const [books, setBooks] = useState<Book[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [editingBook, setEditingBook] = useState<Book | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    author: '',
    isbn: '',
    category: '',
    quantity: 1
  });
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (isAuthenticated) {
      fetchBooks();
    }
  }, [isAuthenticated]);

  const fetchBooks = async () => {
    try {
      setIsLoading(true);
      const response = await axiosInstance.get<{ books: Book[] }>('/books');
      const booksData = response.data.books || response.data;
      setBooks(Array.isArray(booksData) ? booksData : []);
      setIsLoading(false);
    } catch (error: any) {
      setIsLoading(false);
      const errorMessage = error.response?.data?.message || 'Không thể tải danh sách sách';
      console.error('Fetch Books Error:', error);
      toast.error(errorMessage);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setIsLoading(true);
      if (editingBook) {
        await axiosInstance.put(`/books/${editingBook._id}`, formData);
        toast.success('Cập nhật sách thành công!');
      } else {
        await axiosInstance.post('/books', formData);
        toast.success('Thêm sách mới thành công!');
      }
      setShowModal(false);
      fetchBooks();
      resetForm();
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Có lỗi xảy ra. Vui lòng thử lại!';
      toast.error(errorMessage);
      console.error('Submit Book Error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleEdit = (book: Book) => {
    setEditingBook(book);
    setFormData({
      title: book.title,
      author: book.author,
      isbn: book.isbn,
      category: book.category,
      quantity: book.quantity
    });
    setShowModal(true);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Bạn có chắc muốn xóa sách này?')) {
      try {
        setIsLoading(true);
        await axiosInstance.delete(`/books/${id}`);
        toast.success('Xóa sách thành công!');
        fetchBooks();
      } catch (error: any) {
        const errorMessage = error.response?.data?.message || 'Không thể xóa sách';
        toast.error(errorMessage);
        console.error('Delete Book Error:', error);
      } finally {
        setIsLoading(false);
      }
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      author: '',
      isbn: '',
      category: '',
      quantity: 1
    });
    setEditingBook(null);
  };

  const canManageBooks = user?.role === 'librarian' || user?.role === 'admin';

  return (
    <Container className={styles.container}>
      {canManageBooks ? (
        <>
          {/* Header */}
          <div className={styles.header}>
            <h2>Quản Lý Sách</h2>
            <Button 
              variant="primary" 
              onClick={() => setShowModal(true)} 
              disabled={isLoading}
            >
              Thêm Sách Mới
            </Button>
          </div>

          {/* Loading */}
          {isLoading ? (
            <div className={styles.loadingMessage}>
              <p>Đang tải...</p>
            </div>
          ) : (
            <div className={styles.tableContainer}>
              <Table className={styles.table} bordered hover responsive>
                <thead>
                  <tr>
                    <th>Tên Sách</th>
                    <th>Tác Giả</th>
                    <th>ISBN</th>
                    <th>Thể Loại</th>
                    <th>Số Lượng</th>
                    <th>Còn Lại</th>
                    <th>Thao Tác</th>
                  </tr>
                </thead>
                <tbody>
                  {books.map((book) => (
                    <tr key={book._id}>
                      <td>{book.title}</td>
                      <td>{book.author}</td>
                      <td>{book.isbn}</td>
                      <td>{book.category}</td>
                      <td>{book.quantity}</td>
                      <td>{book.available}</td>
                      <td className={styles.actionButtons}>
                        <Button
                          variant="warning"
                          size="sm"
                          onClick={() => handleEdit(book)}
                        >
                          Sửa
                        </Button>
                        <Button
                          variant="danger"
                          size="sm"
                          onClick={() => handleDelete(book._id)}
                        >
                          Xóa
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </div>
          )}

          {/* Modal */}
          <Modal 
            show={showModal} 
            onHide={() => {
              setShowModal(false);
              resetForm();
            }}
          >
            <Modal.Header closeButton>
              <Modal.Title>
                {editingBook ? 'Chỉnh Sửa Sách' : 'Thêm Sách Mới'}
              </Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <Form onSubmit={handleSubmit}>
                <Form.Group className="mb-3">
                  <Form.Label>Tên Sách</Form.Label>
                  <Form.Control
                    className={styles.formControl}
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    required
                  />
                </Form.Group>
                {/* Các trường Form khác tương tự */}
                <div className="d-flex justify-content-end">
                  <Button 
                    variant="secondary" 
                    className="me-2" 
                    onClick={() => setShowModal(false)}
                  >
                    Hủy
                  </Button>
                  <Button variant="primary" type="submit" disabled={isLoading}>
                    {editingBook ? 'Cập Nhật' : 'Thêm Mới'}
                  </Button>
                </div>
              </Form>
            </Modal.Body>
          </Modal>
        </>
      ) : (
        <div className={styles.permissionDenied}>
          <p>Bạn không có quyền quản lý sách.</p>
        </div>
      )}
    </Container>
  );
};

export default BookManagement;
