import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Spinner, Form, InputGroup } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { searchBooks, findBooks, Book } from '../services/bookService';
import { toast } from 'react-toastify';
import { FaSearch } from 'react-icons/fa'; // Import biểu tượng kính lúp

import styles from "../styles/pages/Home.module.css";

const Home: React.FC = () => {
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const navigate = useNavigate();

  const fetchBooks = async (method: 'search' | 'find' = 'search') => {
    try {
      setLoading(true);
      let response;

      if (method === 'search') {
        response = searchQuery 
          ? await findBooks(searchQuery)
          : await searchBooks();
      } else {
        response = await findBooks(searchQuery);
      }

      if (response.docs.length > 0) {
        setBooks(response.docs);
      } else {
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

  useEffect(() => {
    fetchBooks();
  }, []);

  const handleSearch = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    fetchBooks('find');
  };

  const getBookCoverUrl = (book: Book) => {
    return book.cover_i 
      ? `https://covers.openlibrary.org/b/id/${book.cover_i}-M.jpg`
      : '/default-book-cover.png';
  };

  return (
    <Container fluid className={styles.container}>
      <Row className={`${styles.header} mb-4 text-center`}>
        <Col>
          <h1>Thư Viện Sách Trực Tuyến</h1>
          <p>Khám phá kho sách phong phú</p>
        </Col>
      </Row>

      {/* Thanh tìm kiếm với biểu tượng kính lúp */}
      <Row className="mb-4 justify-content-center">
        <Col md={6}>
          <Form onSubmit={handleSearch} className={styles.searchBar}>
            <InputGroup>
              <Form.Control 
                type="text" 
                placeholder="Tìm kiếm sách (tác giả, tiêu đề, chủ đề)..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <InputGroup.Text 
                onClick={handleSearch} 
                style={{ cursor: 'pointer' }} // Thêm con trỏ chuột để thể hiện có thể nhấn
              >
                <FaSearch />
              </InputGroup.Text>
            </InputGroup>
          </Form>
        </Col>
      </Row>

      {loading ? (
        <Row className={styles.spinner}>
          <Spinner animation="border" role="status">
            <span className="visually-hidden">Đang tải...</span>
          </Spinner>
        </Row>
      ) : (
        <Row className={styles.cardsContainer}>
          {books.length > 0 ? (
            books.map((book) => (
              <Col key={book.key} md={3} sm={6} className="mb-4">
                <Card 
                  className={styles.card} 
                  onClick={() => navigate(`/book/${encodeURIComponent(book.key)}`)}
                  style={{ cursor: 'pointer' }}
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
                      height: '200px', 
                      objectFit: 'cover' 
                    }} 
                  />
                  <Card.Body>
                    <Card.Title className={styles.cardTitle}>{book.title}</Card.Title>
                    <Card.Text className={styles.cardText}>
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
