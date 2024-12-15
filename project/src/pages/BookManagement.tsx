import React, { useState, useEffect } from 'react';
import { Container, Table, Button, Form, Modal } from 'react-bootstrap';
import { toast } from 'react-toastify';
import axiosInstance from '../api/axiosConfig';
import { useAuth } from '../contexts/AuthContext';

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
      const response = await axiosInstance.get<{ books: Book[] }>('/books'); // Chỉ định kiểu cho response
      
      const booksData = response.data.books || response.data;
      setBooks(Array.isArray(booksData) ? booksData : []);
      
      setIsLoading(false);
    } catch (error: any) {
      setIsLoading(false);
      const errorMessage = error.response?.data?.message 
        || 'Không thể tải danh sách sách';
      
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

  // Kiểm tra quyền quản trị
  const canManageBooks = user?.role === 'librarian' || user?.role === 'admin';

  return (
    <Container>
      {canManageBooks ? (
        <>
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h2>Quản Lý Sách</h2>
            <Button 
              variant="primary" 
              onClick={() => setShowModal(true)} 
              disabled={isLoading}
            >
              Thêm Sách Mới
            </Button>
          </div>

          {isLoading ? (
            <div className="text-center">
              <p>Đang tải...</p>
            </div>
          ) : (
            <div className="table-container">
              <Table striped bordered hover responsive>
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
                      <td>
                        <Button
                          variant="warning"
                          size="sm"
                          className="me-2"
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
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    required
                    placeholder="Nhập tên sách"
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Tác Giả</Form.Label>
                  <Form.Control
                    type="text"
                    value={formData.author}
                    onChange={(e) => setFormData({ ...formData, author: e.target.value })}
                    required
                    placeholder="Nhập tên tác giả"
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>ISBN</Form.Label>
                  <Form.Control
                    type="text"
                    value={formData.isbn}
                    onChange={(e) => setFormData({ ...formData, isbn: e.target.value })}
                    required
                    placeholder ="Nhập ISBN"
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Thể Loại</Form.Label>
                  <Form.Control
                    type="text"
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    required
                    placeholder="Nhập thể loại"
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Số Lượng</Form.Label>
                  <Form.Control
                    type="number"
                    min="1"
                    value={formData.quantity}
                    onChange={(e) => setFormData({ 
                      ...formData, 
                      quantity: parseInt(e.target.value) 
                    })}
                    required
                    placeholder="Nhập số lượng"
                  />
                </Form.Group>

                <div className="d-flex justify-content-end">
                  <Button 
                    variant="secondary" 
                    className="me-2" 
                    onClick={() => {
                      setShowModal(false);
                      resetForm();
                    }}
                  >
                    Hủy
                  </Button>
                  <Button 
                    variant="primary" 
                    type="submit" 
                    disabled={isLoading}
                  >
                    {editingBook ? 'Cập Nhật' : 'Thêm Mới'}
                  </Button>
                </div>
              </Form>
            </Modal.Body>
          </Modal>
        </>
      ) : (
        <div className="text-center">
          <p>Bạn không có quyền quản lý sách.</p>
        </div>
      )}
    </Container>
  );
};

export default BookManagement;