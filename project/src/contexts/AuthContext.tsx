// import React, { 
//   createContext, 
//   useContext, 
//   useState, 
//   useEffect, 
//   useCallback 
// } from 'react';
// import axiosInstance from '../api/axiosConfig';
// import { toast } from 'react-toastify';
// import { jwtDecode } from 'jwt-decode';

// // Interface User
// export interface User {
//   id: string;
//   name: string;
//   email: string;
//   role: string;
//   status?: 'active' | 'inactive';
// }

// // Interface cho token decode
// interface DecodedToken {
//   userId: string;
//   email: string;
//   role: string;
//   exp: number;
// }

// // Interface cho login data
// interface LoginData {
//   token: string;
//   userId: string;
//   name: string;
//   email: string;
//   role: string;
//   status?: 'active' | 'inactive';
// }

// // Interface cho response verify token
// interface VerifyTokenResponse {
//   isValid: boolean;
//   user: {
//     _id?: string;
//     id?: string;
//     userId?: string;
//     name: string;
//     email: string;
//     role: string;
//     status?: 'active' | 'inactive';
//   };
// }

// // Interface cho response refresh token
// interface RefreshTokenResponse {
//   token: string;
// }

// // Interface AuthContextType
// interface AuthContextType {
//   user: User | null;
//   login: (loginData: LoginData) => Promise<void>;
//   logout: () => void;
//   isAuthenticated: boolean;
//   isLoading: boolean;
//   refreshToken: () => Promise<void>;
// }

// // Tạo Context
// const AuthContext = createContext<AuthContextType | undefined>(undefined);

// // Provider Component
// export function AuthProvider({ children }: { children: React.ReactNode }) {
//   const [user, setUser] = useState<User | null>(null);
//   const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
//   const [isLoading, setIsLoading] = useState<boolean>(true);

//   // Kiểm tra token còn hiệu lực không
//   const isTokenExpired = (token: string): boolean => {
//     try {
//       const decoded = jwtDecode<DecodedToken>(token);
//       return decoded.exp < Date.now() / 1000;
//     } catch (error) {
//       return true;
//     }
//   };

//   // Khởi tạo xác thực
//   const initializeAuth = useCallback(async () => {
//     const token = localStorage.getItem('token');
//     const storedUserString = localStorage.getItem('user');

//     if (token && storedUserString) {
//       try {
//         // Kiểm tra token còn hiệu lực
//         if (isTokenExpired(token)) {
//           throw new Error('Token expired');
//         }

//         const storedUser: User = JSON.parse(storedUserString);
//         await verifyToken(token, storedUser);
//       } catch (error) {
//         console.error('Authentication initialization error:', error);
//         logout();
//       } finally {
//         setIsLoading(false);
//       }
//     } else {
//       setIsLoading(false);
//     }
//   }, []);

//   // Chạy initialization khi component mount
//   useEffect(() => {
//     initializeAuth();
//   }, [initializeAuth]);

//   // Xác thực token
//   const verifyToken = async (token: string, storedUser?: User) => {
//     try {
//       const response = await axiosInstance.get<VerifyTokenResponse>('/auth/verify-token', {
//         headers: { Authorization: `Bearer ${token}` }
//       });
      
//       if (response.data.isValid) {
//         const userData = response.data.user || storedUser;
        
//         const completeUserData: User = {
//           id: userData._id || userData.id || userData.userId || '',
//           name: userData.name,
//           email: userData.email,
//           role: userData.role,
//           status: userData.status || 'active'
//         };

//         // Kiểm tra trạng thái tài khoản
//         if (completeUserData.status === 'inactive') {
//           toast.error('Tài khoản của bạn đã bị khóa');
//           logout();
//           return;
//         }

//         setUser(completeUserData);
//         setIsAuthenticated(true);
        
//         localStorage.setItem('user', JSON.stringify(completeUserData));
//       } else {
//         logout();
//       }
//     } catch (error) {
//       console.error('Token Verification Error:', error);
//       logout();
//     }
//   };

//   // Refresh token
//   const refreshToken = async () => {
//     try {
//       const token = localStorage.getItem('token');
//       if (!token) {
//         throw new Error('No token available');
//       }

//       const response = await axiosInstance.post<RefreshTokenResponse>('/auth/refresh-token', {
//         token
//       });

//       const newToken = response.data.token;
      
//       // Cập nhật token mới
//       localStorage.setItem('token', newToken);

//       // Verify lại token mới
//       await verifyToken(newToken);
//     } catch (error) {
//       console.error('Token Refresh Error:', error);
//       logout();
//     }
//   };

//   // Đăng nhập
//   const login = async (loginData: LoginData) => {
//     try {
//       // Validate dữ liệu đầu vào
//       if (!loginData.email || !loginData.token) {
//         throw new Error('Thông tin đăng nhập không đầy đủ');
//       }

//       // Tạo đối tượng người dùng
//       const userData: User = {
//         id: loginData.userId,
//         name: loginData.name,
//         email: loginData.email,
//         role: loginData.role,
//         status: loginData.status || 'active'
//       };

//       // Lưu token và thông tin người dùng
//       localStorage.setItem('token', loginData.token);
//       localStorage.setItem('user', JSON.stringify(userData));

//       // Cập nhật trạng thái
//       setUser(userData);
//       setIsAuthenticated(true);

//       toast.success('Đăng nhập thành công');
//     } catch (error: any) {
//       console.error('Login Error in Context:', error);
      
//       logout();
      
//       // Hiển thị thông báo lỗi chi tiết
//       toast.error(error.message || 'Đăng nhập không thành công');
      
//       throw error;
//     }
//   };

//   // Đăng xuất
//   const logout = useCallback(() => {
//     // Xóa dữ liệu local storage
//     localStorage.removeItem('token');
//     localStorage.removeItem('user');

//     // Đặt lại trạng thái
//     setUser(null);
//     setIsAuthenticated(false);

//     // Hiển thị thông báo
//     toast.info('Đã đăng xuất');
    
//     // Chuyển hướng về trang đăng nhập
//     window.location.href = '/login';
//   }, []);

//   // Giá trị context
//   const contextValue: AuthContextType = {
//     user,
//     login,
//     logout,
//     isAuthenticated,
//     isLoading,
//     refreshToken
//   };

//   return (
//     <AuthContext.Provider value={contextValue}>
//       {children}
//     </AuthContext.Provider>
//   );
// }

// // Custom hook để sử dụng AuthContext
// export function useAuth() {
//   const context = useContext(AuthContext);
//   if (context === undefined) {
//     throw new Error('useAuth must be used within an AuthProvider');
//   }
//   return context;
// }



import React, { 
  createContext, 
  useContext, 
  useState, 
  useEffect, 
  useCallback 
} from 'react';
import axiosInstance from '../api/axiosConfig';
import { toast } from 'react-toastify';
import { jwtDecode } from 'jwt-decode';

// Interface User
export interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  avatar?: string; // Thêm avatar
  status?: 'active' | 'inactive';
}

// Interface cho token decode
interface DecodedToken {
  userId: string;
  email: string;
  role: string;
  exp: number;
}

// Interface cho login data
interface LoginData {
  token: string;
  userId: string;
  name: string;
  email: string;
  role: string;
  avatar?: string; // Thêm avatar
  status?: 'active' | 'inactive';
}

// Interface cho response verify token
interface VerifyTokenResponse {
  isValid: boolean;
  user: {
    _id?: string;
    id?: string;
    userId?: string;
    name: string;
    email: string;
    role: string;
    avatar?: string; // Thêm avatar
    status?: 'active' | 'inactive';
  };
}

// Interface cho response refresh token
interface RefreshTokenResponse {
  token: string;
}

// Interface AuthContextType
interface AuthContextType {
  user: User | null;
  login: (loginData: LoginData) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
  isLoading: boolean;
  refreshToken: () => Promise<void>;
}

// Tạo Context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Provider Component
export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Kiểm tra token còn hiệu lực không
  const isTokenExpired = (token: string): boolean => {
    try {
      const decoded = jwtDecode<DecodedToken>(token);
      return decoded.exp < Date.now() / 1000;
    } catch (error) {
      return true;
    }
  };

  // Khởi tạo xác thực
  const initializeAuth = useCallback(async () => {
    const token = localStorage.getItem('token');
    const storedUserString = localStorage.getItem('user');

    if (token && storedUserString) {
      try {
        // Kiểm tra token còn hiệu lực
        if (isTokenExpired(token)) {
          throw new Error('Token expired');
        }

        const storedUser: User = JSON.parse(storedUserString);
        await verifyToken(token, storedUser);
      } catch (error) {
        console.error('Authentication initialization error:', error);
        logout();
      } finally {
        setIsLoading(false);
      }
    } else {
      setIsLoading(false);
    }
  }, []);

  // Chạy initialization khi component mount
  useEffect(() => {
    initializeAuth();
  }, [initializeAuth]);

  // Xác thực token
  const verifyToken = async (token: string, storedUser?: User) => {
    try {
      const response = await axiosInstance.get<VerifyTokenResponse>('/auth/verify-token', {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      if (response.data.isValid) {
        const userData = response.data.user || storedUser;
        
        const completeUserData: User = {
          id: userData._id || userData.id || userData.userId || '',
          name: userData.name,
          email: userData.email,
          role: userData.role,
          avatar: userData.avatar || '/default-avatar.png', // Đảm bảo có avatar
          status: userData.status || 'active'
        };

        // Kiểm tra trạng thái tài khoản
        if (completeUserData.status === 'inactive') {
          toast.error('Tài khoản của bạn đã bị khóa');
          logout();
          return;
        }

        setUser(completeUserData);
        setIsAuthenticated(true);
        
        localStorage.setItem('user', JSON.stringify(completeUserData));
      } else {
        logout();
      }
    } catch (error) {
      console.error('Token Verification Error:', error);
      logout();
    }
  };

  // Refresh token
  const refreshToken = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No token available');
      }

      const response = await axiosInstance.post<RefreshTokenResponse>('/auth/refresh-token', {
        token
      });

      const newToken = response.data.token;
      
      // Cập nhật token mới
      localStorage.setItem('token', newToken);

      // Verify lại token mới
      await verifyToken(newToken);
    } catch (error) {
      console.error('Token Refresh Error:', error);
      logout();
    }
  };

  // Đăng nhập
  const login = async (loginData: LoginData) => {
    try {
      // Validate dữ liệu đầu vào
      if (!loginData.email || !loginData.token) {
        throw new Error('Thông tin đăng nhập không đầy đủ');
      }

      // Tạo đối tượng người dùng
      const userData: User = {
        id: loginData.userId,
        name: loginData.name,
        email: loginData.email,
        role: loginData.role,
        avatar: loginData.avatar || '/default-avatar.png', // Lưu avatar
        status: loginData.status || 'active'
      };

      // Lưu token và thông tin người dùng
      localStorage.setItem('token', loginData.token);
      localStorage.setItem('user', JSON.stringify(userData));

      // Cập nhật trạng thái
      setUser(userData);
      setIsAuthenticated(true);

      toast.success('Đăng nhập thành công');
    } catch (error: any) {
      console.error('Login Error in Context:', error);
      
      logout();
      
      // Hiển thị thông báo lỗi chi tiết
      toast.error(error.message || 'Đăng nhập không thành công');
      
      throw error;
    }
  };

  // Đăng xuất
  const logout = useCallback(() => {
    // Xóa dữ liệu local storage
    localStorage.removeItem('token');
    localStorage.removeItem('user');

    // Đặt lại trạng thái
    setUser(null);
    setIsAuthenticated(false);

    // Hiển thị thông báo
    toast.info('Đã đăng xuất');
    
    // Chuyển hướng về trang đăng nhập
    window.location.href = '/login';
  }, []);

  // Giá trị context
  const contextValue: AuthContextType = {
    user,
    login,
    logout,
    isAuthenticated,
    isLoading,
    refreshToken
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
}

// Custom hook để sử dụng AuthContext
export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
