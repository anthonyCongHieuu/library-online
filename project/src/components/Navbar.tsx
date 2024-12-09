import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Navbar as BsNavbar, Nav, Container } from 'react-bootstrap';
import { useAuth } from '../contexts/AuthContext';
import { BookOpen } from 'lucide-react';

const Navbar = () => {
  const { user, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <BsNavbar expand="lg" variant="dark">
      <Container>
        <BsNavbar.Brand as={Link} to="/">
          <BookOpen className="me-2" />
          Thư Viện Online
        </BsNavbar.Brand>
        <BsNavbar.Toggle aria-controls="basic-navbar-nav" />
        <BsNavbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            <Nav.Link as={Link} to="/">Trang Chủ</Nav.Link>
            {isAuthenticated && (
              <>
                <Nav.Link as={Link} to="/books">Quản Lý Sách</Nav.Link>
                <Nav.Link as={Link} to="/borrow-return">Mượn/Trả Sách</Nav.Link>
                {user?.role === 'admin' && (
                  <Nav.Link as={Link} to="/users">Quản Lý Người Dùng</Nav.Link>
                )}
              </>
            )}
          </Nav>
          <Nav>
            {!isAuthenticated ? (
              <>
                <Nav.Link as={Link} to="/login">Đăng Nhập</Nav.Link>
                <Nav.Link as={Link} to="/register">Đăng Ký</Nav.Link>
              </>
            ) : (
              <>
                <Nav.Link>Xin chào, {user?.name}</Nav.Link>
                <Nav.Link onClick={handleLogout}>Đăng Xuất</Nav.Link>
              </>
            )}
          </Nav>
        </BsNavbar.Collapse>
      </Container>
    </BsNavbar>
  );
};

export default Navbar;