import { Link, useNavigate } from 'react-router-dom';
import { Navbar as BsNavbar, Nav, Container, NavDropdown } from 'react-bootstrap';
import { useAuth } from '../contexts/AuthContext';
import { 
  FaBook, 
  FaHome, 
  FaShoppingCart, 
  FaUserCog, 
  FaSignInAlt, 
  FaUserPlus, 
  FaSignOutAlt, 
  FaUser, 
  FaSearch, 
  FaCog,
  FaQuestionCircle,
  FaChartBar
} from 'react-icons/fa';
import { MdLibraryBooks } from 'react-icons/md';

// Import CSS module
import styles from '../styles/components/Navbar.module.css';
import { useEffect, useState } from 'react';

const Navbar = () => {
  const { user, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [scrolled, setScrolled] = useState(false);

  // Xử lý hiệu ứng cuộn
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <BsNavbar
      expand="lg"
      className={`${styles.navbar} ${scrolled ? 'scrolled' : ''} mb-4`}
      variant="dark"
    >
      <Container>
        <BsNavbar.Brand as={Link} to="/" className={`${styles.navbarBrand} d-flex align-items-center`}>
          <MdLibraryBooks className="me-2" size={24} />
          Thư Viện Online
        </BsNavbar.Brand>
        <BsNavbar.Toggle aria-controls="responsive-navbar-nav" />
        <BsNavbar.Collapse id="responsive-navbar-nav">
          <Nav className="me-auto">
            <Nav.Link as={Link} to="/" className={`${styles.navLink} d-flex align-items-center`}>
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
                    className={styles.navDropdown}
                  >
                    <div className={styles.navDropdownMenu}>
                      <NavDropdown.Item as={Link} to="/manage-books" className={styles.navDropdownItem}>
                        <FaBook className="me-2" size={18} /> Quản Lý Sách
                      </NavDropdown.Item>
                      <NavDropdown.Item as={Link} to="/manage-borrows" className={styles.navDropdownItem}>
                        <FaShoppingCart className="me-2" size={18} /> Quản Lý Mượn Sách
                      </NavDropdown.Item>
                      <NavDropdown.Item as={Link} to="/statistics" className={styles.navDropdownItem}>
                        <FaChartBar className="me-2" size={18} /> Thống Kê
                      </NavDropdown.Item>
                    </div>
                  </NavDropdown>
                )}

                <Nav.Link as={Link} to="/advanced-search" className={`${styles.navLink} d-flex align-items-center`}>
                  <FaSearch className="me-2" size={18} /> Tìm Kiếm Nâng Cao
                </Nav.Link>

                <NavDropdown
                  title={
                    <span className="d-flex align-items-center">
                      <FaUser className="me-2" size={18} /> Cá Nhân
                    </span>
                  }
                  id="user-dropdown"
                  className={styles.navDropdown}
                >
                  <div className={styles.navDropdownMenu}>
                    <NavDropdown.Item as={Link} to="/profile" className={styles.navDropdownItem}>
                      <FaCog className="me-2" size={18} /> Thông Tin Cá Nhân
                    </NavDropdown.Item>
                    <NavDropdown.Item as={Link} to="/borrow-management" className={styles.navDropdownItem}>
                      <FaBook className="me-2" size={18} /> Sách Đã Mượn
                    </NavDropdown.Item>
                  </div>
                </NavDropdown>

                <Nav.Link as={Link} to="/faq" className={`${styles.navLink} d-flex align-items-center`}>
                  <FaQuestionCircle className="me-2" size={18} /> Câu Hỏi Thường Gặp
                </Nav.Link>
              </>
            )}

            {user?.role === 'admin' && (
              <Nav.Link as={Link} to="/user-management" className={`${styles.navLink} d-flex align-items-center`}>
                <FaUserCog className="me-2" size={18} /> Quản Lý Người Dùng
              </Nav.Link>
            )}
          </Nav>

          <Nav>
            {!isAuthenticated ? (
              <>
                <Nav.Link as={Link} to="/login" className={`${styles.navLink} d-flex align-items-center`}>
                  <FaSignInAlt className="me-2" size={18} /> Đăng Nhập
                </Nav.Link>
                <Nav.Link as={Link} to="/register" className={`${styles.navLink} d-flex align-items-center`}>
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
                className={styles.navDropdown}
              >
                <div className={styles.navDropdownMenu}>
                  <NavDropdown.Item onClick={handleLogout} className={`${styles.navDropdownItem} d-flex align-items-center`}>
                    <FaSignOutAlt className="me-2" size={18} /> Đăng Xuất
                  </NavDropdown.Item>
                </div>
              </NavDropdown>
            )}
          </Nav>
        </BsNavbar.Collapse>
      </Container>
    </BsNavbar>
  );
};

export default Navbar;
