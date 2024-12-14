import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Navbar as BsNavbar, Nav, Container, NavDropdown } from 'react-bootstrap';
import { useAuth } from '../contexts/AuthContext';

// Import icons từ react-icons
import { FaBook, FaHome, FaShoppingCart, FaUserCog, FaSignInAlt, FaUserPlus, FaSignOutAlt, FaUser } from 'react-icons/fa';
import { MdLibraryBooks } from 'react-icons/md';

const Navbar = () => {
  const { user, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <BsNavbar expand="lg" bg="primary" variant="dark" className="mb-4">
      <Container>
        <BsNavbar.Brand as={Link} to="/" className="d-flex align-items-center">
          <MdLibraryBooks className="me-2" size={24} />
          Thư Viện Online
        </BsNavbar.Brand>
        <BsNavbar.Toggle aria-controls="responsive-navbar-nav" />
        <BsNavbar.Collapse id="responsive-navbar-nav">
          <Nav className="me-auto">
            <Nav.Link as={Link} to="/" className="d-flex align-items-center">
              <FaHome className="me-2" size={18} /> Trang Chủ
            </Nav.Link>

            {isAuthenticated && (
              <>
                {(user?.role === 'librarian' || user?.role === 'admin') && (
                  <NavDropdown 
                    title={
                      <span className="d-flex align-items-center">
                        <FaShoppingCart className="me-2" size={18} /> Quản Lý
                      </span>
                    } 
                    id="management-dropdown"
                  >
                    <NavDropdown.Item as={Link} to="/manage-books">
                      <FaBook className="me-2" size={18} /> Quản Lý Sách
                    </NavDropdown.Item>
                    <NavDropdown.Item as={Link} to="/borrow-management">
                      <FaShoppingCart className="me-2" size={18} /> Quản Lý Mượn Trả
                    </NavDropdown.Item>
                  </NavDropdown>
                )}

                {user?.role === 'admin' && (
                  <Nav.Link as={Link} to="/user-management" className="d-flex align-items-center">
                    <FaUserCog className="me-2" size={18} /> Quản Lý Người Dùng
                  </Nav.Link>
                )}
              </>
            )}
          </Nav>

          <Nav>
            {!isAuthenticated ? (
              <>
                <Nav.Link as={Link} to="/login" className="d-flex align-items-center">
                  <FaSignInAlt className="me-2" size={18} /> Đăng Nhập
                </Nav.Link>
                <Nav.Link as={Link} to="/register" className="d-flex align-items-center">
                  <FaUserPlus className="me-2" size={18} /> Đăng Ký
                </Nav.Link>
              </>
            ) : (
              <NavDropdown 
                title={
                  <span className="d-flex align-items-center">
                    <FaUser className="me-2" size={18} /> {user?.name}
                  </span>
                } 
                id="user-dropdown"
              >
                <NavDropdown.Item onClick={handleLogout} className="d-flex align-items-center">
                  <FaSignOutAlt className="me-2" size={18} /> Đăng Xuất
                </NavDropdown.Item>
              </NavDropdown>
            )}
          </Nav>
        </BsNavbar.Collapse>
      </Container>
    </BsNavbar>
  );
};

export default Navbar;