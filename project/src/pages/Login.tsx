import React, { useState } from 'react';
import { Container, Form, Button, Row, Col } from 'react-bootstrap';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { toast } from 'react-toastify';
import axiosInstance from '../api/axiosConfig';
import { Eye, EyeOff } from 'lucide-react';
import styles from '../styles/pages/Login.module.css'; // Import CSS module

// Schema validation for login form
const loginSchema = yup.object().shape({
  email: yup.string()
    .email('Email không hợp lệ')
    .required('Email là bắt buộc')
    .trim(),
  password: yup.string()
    .required('Mật khẩu là bắt buộc')
    .min(6, 'Mật khẩu phải có ít nhất 6 ký tự')
});

// Interface for form data
interface LoginFormData {
  email: string;
  password: string;
}

const Login: React.FC = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const { 
    register, 
    handleSubmit, 
    formState: { errors } 
  } = useForm<LoginFormData>({
    resolver: yupResolver(loginSchema),
    mode: 'onBlur'
  });

  const onSubmit = async (data: LoginFormData) => {
    setIsLoading(true);

    try {
      const response = await axiosInstance.post('/auth/login', {
        email: data.email,
        password: data.password
      });

      const { 
        token, 
        userId, 
        name, 
        role 
      } = response.data;

      await login({
        token,
        userId,
        name,
        email: data.email,
        role
      });
      
      toast.success('Đăng nhập thành công!');
      navigate('/');
    } catch (error: any) {
      const errorMessage = 
        error.response?.data?.message || 
        error.response?.data?.errors?.[0] || 
        'Đăng nhập thất bại. Vui lòng kiểm tra lại thông tin!';
      
      console.error('Login Error:', error.response?.data);
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(prev => !prev);
  };

  return (
    <div className={styles.loginPage}> {/* Sử dụng class từ CSS module */}
      <Container>
        <Row className="justify-content-center align-items-center vh-100">
          <Col md={6} lg={4}>
            <div className={styles.formContainer}> {/* Sử dụng class từ CSS module */}
              <h2 className={styles.formTitle}>Đăng Nhập</h2>
              <Form onSubmit={handleSubmit(onSubmit)}>
                {/* Email Input */}
                <Form.Group className="mb-3">
                  <Form.Label>Email</Form.Label>
                  <Form.Control
                    type="email"
                    placeholder="Nhập email của bạn"
                    {...register('email')}
                    isInvalid={!!errors.email}
                    className={styles.formControl} // Sử dụng class từ CSS module
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.email?.message}
                  </Form.Control.Feedback>
                </Form.Group>

                {/* Password Input */}
                <Form.Group className="mb-3 position-relative">
                  <Form.Label>Mật khẩu</Form.Label>
                  <Form.Control
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Nhập mật khẩu"
                    {...register('password')}
                    isInvalid={!!errors.password}
                    className={styles.formControl} // Sử dụng class từ CSS module
                  />
                  <Button 
                    variant="link" 
                    onClick={togglePasswordVisibility}
                    className="position-absolute end-0 top-50 translate-middle-y border-0 bg-transparent"
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </Button>
                  <Form.Control.Feedback type="invalid">
                    {errors.password?.message}
                  </Form.Control.Feedback>
                </Form.Group>

                {/* Submit Button */}
                < Button 
                  variant="primary" 
                  type="submit" 
                  className={styles.submitButton} // Sử dụng class từ CSS module
                  disabled={isLoading}
                >
                  {isLoading ? 'Đang đăng nhập...' : 'Đăng Nhập'}
                </Button>

                {/* Register Link */}
                <div className={styles.registerLink}> {/* Sử dụng class từ CSS module */}
                  <p>
                    Chưa có tài khoản? {' '}
                    <Link to="/register" className="text-primary">
                      Đăng ký ngay
                    </Link>
                  </p>
                </div>
              </Form>
            </div>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default Login; 