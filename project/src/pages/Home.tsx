import { Container, Row, Col, Card } from 'react-bootstrap';
import { Book, Users, BookOpen, Library } from 'lucide-react';
import '../styles/dynamic-background.css';
import styles from '../styles/pages/Home.module.css';
const Home = () => {
  return (
    <Container>
      <Row className="mb-4">
        <Col>
          <h1 className="text-center mb-4">Chào mừng đến với Thư Viện Online</h1>
          <p className="text-center lead">
            Hệ thống quản lý thư viện hiện đại, tiện lợi và dễ sử dụng
          </p>
        </Col>
      </Row>

      <Row>
        <Col md={3} sm={6} className="mb-4">
          <Card className="h-100 text-center p-3">
            <Card.Body>
              <Book size={48} className="mb-3 text-primary" />
              <Card.Title>Quản Lý Sách</Card.Title>
              <Card.Text>
                Dễ dàng quản lý kho sách với đầy đủ thông tin chi tiết
              </Card.Text>
            </Card.Body>
          </Card>
        </Col>

        <Col md={3} sm={6} className="mb-4">
          <Card className="h-100 text-center p-3">
            <Card.Body>
              <Users size={48} className="mb-3 text-success" />
              <Card.Title>Quản Lý Độc Giả</Card.Title>
              <Card.Text>
                Theo dõi thông tin và hoạt động của độc giả
              </Card.Text>
            </Card.Body>
          </Card>
        </Col>

        <Col md={3} sm={6} className="mb-4">
          <Card className="h-100 text-center p-3">
            <Card.Body>
              <BookOpen size={48} className="mb-3 text-warning" />
              <Card.Title>Mượn/Trả Sách</Card.Title>
              <Card.Text>
                Quy trình mượn trả sách đơn giản và hiệu quả
              </Card.Text>
            </Card.Body>
          </Card>
        </Col>

        <Col md={3} sm={6} className="mb-4">
          <Card className="h-100 text-center p-3">
            <Card.Body>
              <Library size={48} className="mb-3 text-danger" />
              <Card.Title>Thống Kê</Card.Title>
              <Card.Text>
                Báo cáo và thống kê chi tiết hoạt động thư viện
              </Card.Text>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default Home;