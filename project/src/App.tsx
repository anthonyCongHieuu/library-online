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
import Profile from './pages/Profile';
import UserManagement from './pages/UserManagement';

// Các trang mới
import BookDetail from './pages/BookDetail';
import Statistics from './pages/Statistics';
import AdvancedSearch from './pages/advanced-search';
import FAQ from './pages/FAQ';
import ManageBorrows from './pages/ManageBorrows';

// Context
import { AuthProvider } from './contexts/AuthContext';

const App: React.FC = () => {
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
              <Route path="/faq" element={<FAQ />} />
              <Route path="/advanced-search" element={<AdvancedSearch />} />

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
                path="/book/:key" 
                element={
                  <PrivateRoute>
                    <BookDetail />
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
                path="/manage-borrows" 
                element={
                  <PrivateRoute>
                    <ManageBorrows />
                  </PrivateRoute>
                } 
              />
              <Route 
                path="/statistics" 
                element={
                  <PrivateRoute>
                    <Statistics />
                  </PrivateRoute>
                } 
              />
              <Route 
                path="/profile" 
                element={
                  <PrivateRoute>
                    <Profile />
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

              {/* Catch-All Route */}
              <Route 
                path="*" 
                element={<h1 className="text-center">404 - Trang Không Tồn Tại</h1>} 
              />
            </Routes>
          </main>
          <ToastContainer />
        </div>
      </AuthProvider>
    </Router>
  );
};

export default App;
