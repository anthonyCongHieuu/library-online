// src/pages/AdvancedSearch.tsx
import React, { useState } from 'react';
import { Container, Form, Button, ListGroup, Spinner } from 'react-bootstrap';
import axiosInstance from '../api/axiosConfig';
import { toast } from 'react-toastify';

// Interface để định nghĩa kiểu cho sách
interface Book {
  _id: string;
  title: string;
  author: string;
  category: string;
}

// Interface cho các tham số tìm kiếm
interface SearchQuery {
  title: string;
  author: string;
  category: string;
}

const AdvancedSearch: React.FC = () => {
  // Sử dụng interface cho state
  const [query, setQuery] = useState<SearchQuery>({
    title: '',
    author: '',
    category: ''
  });

  // State để lưu kết quả tìm kiếm
  const [results, setResults] = useState<Book[]>([]);
  
  // State để theo dõi trạng thái loading
  const [loading, setLoading] = useState<boolean>(false);

  // Hàm xử lý tìm kiếm
  const handleSearch = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Gửi request tìm kiếm với các tham số
      const response = await axiosInstance.get<Book[]>('/books/search', { 
        params: query 
      });

      // Cập nhật kết quả
      setResults(response.data);

      // Hiển thị thông báo nếu không tìm thấy kết quả
      if (response.data.length === 0) {
        toast.info('Không tìm thấy sách phù hợp');
      }
    } catch (error) {
      // Xử lý lỗi
      toast.error('Tìm kiếm thất bại');
      console.error('Search error:', error);
    } finally {
      // Dừng trạng thái loading
      setLoading(false);
    }
  };

  return (
    <Container>
      <h2 className="my-4">Tìm Kiếm Nâng Cao</h2>
      
      {/* Form tìm kiếm */}
      <Form onSubmit={handleSearch}>
        <Form.Group className="mb-3">
          <Form.Label>Tên Sách</Form.Label>
          <Form.Control
            type="text"
            placeholder="Nhập tên sách"
            value={query.title}
            onChange={(e) => setQuery(prev => ({
              ...prev, 
              title: e.target.value 
            }))}
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Tác Giả</Form.Label>
          <Form.Control
            type="text"
            placeholder="Nhập tên tác giả"
            value={query.author}
            onChange={(e) => setQuery(prev => ({
              ...prev, 
              author: e.target.value 
            }))}
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Thể Loại</Form.Label>
          <Form.Control
            type="text"
            placeholder="Nhập thể loại"
            value={query.category}
            onChange={(e) => setQuery(prev => ({
              ...prev, 
              category: e.target.value 
            }))}
          />
        </Form.Group>

        <Button 
          variant="primary" 
          type="submit" 
          disabled={loading}
        >
          {loading ? (
            <>
              <Spinner 
                as="span"
                animation="border"
                size="sm"
                role="status"
                aria-hidden="true"
                className="me-2"
              />
              Đang tìm kiếm...
            </>
          ) : (
            'Tìm Kiếm'
          )}
        </Button>
      </Form>

      {/* Hiển thị kết quả tìm kiếm */}
      {results.length > 0 && (
        <div className="mt-4">
          <h3>Kết Quả Tìm Kiếm</h3>
          <ListGroup>
            {results.map((book) => (
              <ListGroup.Item key={book._id}>
                <div className="d-flex justify-content-between">
                  <div>
                    <h5>{book.title}</h5>
                    <p className="text-muted">Tác giả: {book.author}</p>
                    <p className="text-muted">Thể loại: {book.category}</p>
                  </div>
                  <div>
                    <Button 
                      variant="outline-primary"
                      size="sm"
                      onClick={() => {
                        // Chuyển đến trang chi tiết sách
                        // navigate(`/book/${book._id}`)
                      }}
                    >
                      Chi Tiết
                    </Button>
                  </div>
                </div>
              </ListGroup.Item>
            ))}
          </ListGroup>
        </div>
      )}
    </Container>
  );
};

export default AdvancedSearch;