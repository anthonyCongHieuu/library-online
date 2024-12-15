// src/pages/Home.tsx
import React, { useState, useEffect } from 'react';
import { 
  Container, 
  Row, 
  Col, 
  Card, 
  Button, 
  Spinner,
  Form
} from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { searchBooks, findBooks, Book } from '../services/bookService';
import { toast } from 'react-toastify';

const Home: React.FC = () => {
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const navigate = useNavigate();

  // Danh sách chủ đề để random
  const bookSubjects = [
    'fiction', 
    'science', 
    'history', 
    'philosophy', 
    'technology'
  ];

  // Hàm lấy sách
  const fetchBooks = async (method: 'search' | 'find' = 'search') => {
    try {
      setLoading(true);
      let response;

      if (method === 'search') {
        // Chọn chủ đề ngẫu nhiên nếu không có truy vấn
        response = searchQuery 
          ? await findBooks(searchQuery)
          : await searchBooks();
      } else {
        response = await findBooks(searchQuery);
      }

      // Kiểm tra và set sách
      if (response.docs.length > 0) {
        setBooks(response.docs);
      } else {
        // Nếu không có sách, thử phương pháp khác
        const fallbackResponse = await findBooks();
        setBooks(fallbackResponse.docs);
      }
    } catch (error) {
      console.error('Error fetching books:', error);
      toast.error('Không thể tải sách. Vui lòng thử lại.');
    } finally {
      setLoading(false);
    }
  };

  // Tìm sách khi component mount
  useEffect(() => {
    fetchBooks();
  }, []);

  // Hàm xử lý tìm kiếm
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchBooks('find');
  };

  // Hàm lấy URL ảnh bìa
  const getBookCoverUrl = (book: Book) => {
    return book.cover_i 
      ? `https://covers.openlibrary.org/b/id/${book.cover_i}-M.jpg`
      : '/default-book-cover.png';
  };

  return (
    <Container fluid>
      <Row className="mb-4 text-center">
        <Col>
          <h1>Thư Viện Sách Trực Tuyến</h1>
          <p>Khám phá kho sách phong phú</p>
        </Col>
      </Row>

      {/* Thanh tìm kiếm */}
      <Row className="mb-4 justify-content-center">
        <Col md={6}>
          <Form onSubmit={handleSearch}>
            <Form.Control 
              type="text" 
              placeholder="Tìm kiếm sách (tác giả, tiêu đề, chủ đề)..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </Form>
        </Col>
      </Row>

      {loading ? (
        <Row className="justify-content-center">
          <Spinner animation="border" role="status">
            <span className="visually-hidden">Đang tải...</span>
          </Spinner>
        </Row>
      ) : (
        <Row>
          {books.length > 0 ? (
            books.map((book) => (
              <Col key={book.key} md={3} sm={6} className="mb-4">
                <Card 
                  className="h-100" 
                  onClick={() => navigate(`/book/${encodeURIComponent(book.key)}`)}
                  style={{ 
                    cursor: 'pointer', 
                    transition: 'transform 0.2s',
                    boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
                  }}
                  onMouseOver={(e) => {
                    e.currentTarget.style.transform = 'scale(1.05)';
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.style.transform = 'scale(1)';
                  }}
                >
                  <Card.Img 
                    variant="top" 
                    src={getBookCoverUrl(book)} 
                    style={{ 
                      height: '300px', 
                      objectFit:  'cover' 
                    }} 
                  />
                  <Card.Body>
                    <Card.Title className="text-truncate">{book.title}</Card.Title>
                    <Card.Text className="text-muted">
                      {book.author_name ? book.author_name.join(', ') : 'Không rõ tác giả'}
                    </Card.Text>
                    <Card.Text>
                      <small className="text-muted">
                        Xuất bản: {book.first_publish_year || 'Chưa có thông tin'}
                      </small>
                    </Card.Text>
                  </Card.Body>
                </Card>
              </Col>
            ))
          ) : (
            <Col>
              <p>Không có sách nào để hiển thị.</p>
            </Col>
          )}
        </Row>
      )}
    </Container>
  );
};

export default Home;