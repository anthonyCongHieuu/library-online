import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'react-toastify/dist/ReactToastify.css';
import './styles/global.css';

// Components
import Navbar from './components/Navbar';
import PrivateRoute from './components/PrivateRoute';

// Pages
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import BookManagement from './pages/BookManagement';
import BorrowReturn from './pages/BorrowReturn';
import UserManagement from './pages/UserManagement';

// Context
import { AuthProvider } from './contexts/AuthContext';

function App() {
  return (
    <Router>
      <AuthProvider>
        <div className="app-container">
          <Navbar />
          <main className="main-content">
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />

              {/* Protected Routes */}
              <Route 
                path="/manage-books" 
                element={
                  <PrivateRoute>
                    <BookManagement />
                  </PrivateRoute>
                } 
              />
              <Route 
                path="/borrow-management" 
                element={
                  <PrivateRoute>
                    <BorrowReturn />
                  </PrivateRoute>
                } 
              />
              <Route 
                path="/user-management" 
                element={
                  <PrivateRoute>
                    <UserManagement />
                  </PrivateRoute>
                } 
              />

              {/* Optional: Add a catch-all route */}
              <Route 
                path="*" 
                element={<h1>Trang không tồn tại</h1>} 
              />
            </Routes>
          </main>
          <ToastContainer />
        </div>
      </AuthProvider>
    </Router>
  );
}

export default App;