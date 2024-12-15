// src/api/axiosConfig.ts
import axios from 'axios';
import { toast } from 'react-toastify';

// // Tạo instance Axios với web chạy online 
// const axiosInstance = axios.create({
//   baseURL: process.env.REACT_APP_API_URL || 'https://your-backend-url.railway.app/api',
//   headers: {
//     'Content-Type': 'application/json'
//   }
// });

// Tạo instance Axios với cấu hình local
const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
  headers: {
    'Content-Type': 'application/json'
  }
});

// Biến để theo dõi trạng thái chuyển hướng
let isRedirecting = false;

// Hàm làm mới token
const refreshToken = async () => {
  try {
    const token = localStorage.getItem('token');
    if (!token) throw new Error('No token');

    const response = await axios.post(`${axiosInstance.defaults.baseURL}/auth/refresh-token`, { token });
    
    if (response.data.token) {
      localStorage.setItem('token', response.data.token);
      return response.data.token;
    }
    
    throw new Error('Refresh token failed');
  } catch (error) {
    // Xóa token cũ
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    
    // Chuyển hướng đăng nhập
    window.location.href = '/login';
    
    throw error;
  }
};

// Interceptor request
axiosInstance.interceptors.request.use(
  async (config) => {
    // Lấy token từ localStorage
    let token = localStorage.getItem('token');
    
    // Nếu không có token, không chuyển hướng ngay
    if (!token) {
      // Kiểm tra nếu không phải là route đăng nhập
      if (!config.url?.includes('/login')) {
        console.warn('No authentication token found');
      }
      return config;
    }
    
    // Thêm token vào header
    config.headers['Authorization'] = `Bearer ${token}`;
    
    return config;
  },
  (error) => Promise.reject(error)
);

// Interceptor response
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Nếu lỗi 401 và chưa thử làm mới token
    if (error.response?.status === 401 && !originalRequest._retry) {
      // Đánh dấu đang thử làm mới token
      originalRequest._retry = true;

      // Nếu không đang chuyển hướng
      if (!isRedirecting) {
        isRedirecting = true;

        try {
          // Thử làm mới token
          const newToken = await refreshToken();
          
          // Cập nhật token mới cho request gốc
          originalRequest.headers['Authorization'] = `Bearer ${newToken}`;
          
          // Thử lại request ban đầu
          return axiosInstance(originalRequest);
        } catch (refreshError) {
          // Nếu làm mới token thất bại
          toast.error('Phiên đăng nhập đã hết hạn');
          
          // Chuyển hướng đăng nhập
          window.location.href = '/login';
          
          return Promise.reject(refreshError);
        } finally {
          // Đặt lại cờ chuyển hướng
          isRedirecting = false;
        }
      }
    }

    // Xử lý các lỗi khác
    return Promise.reject(error);
  }
);

export default axiosInstance;