import React from 'react';
import { Container, Form, Button, Alert } from 'react-bootstrap';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { toast } from 'react-toastify';
import axiosInstance from '../api/axiosConfig'; // Thêm import axiosInstance

const schema = yup.object().shape({
  email: yup.string().email('Email không hợp lệ').required('Email là bắt buộc'),
  password: yup.string().required('Mật khẩu là bắt buộc').min(6, 'Mật khẩu phải có ít nhất 6 ký tự'),
});

interface LoginForm {
  email: string;
  password: string;
}

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const { register, handleSubmit, formState: { errors } } = useForm<LoginForm>({
    resolver: yupResolver(schema),
  });

  const onSubmit = async (data: LoginForm) => { console.log(data);
    try {
      // Sử dụng axiosInstance để login
      const response = await axiosInstance.post('/auth/login', {
        email: data.email,
        password: data.password
      });

      // Lưu token và thông tin user
      const { token, userId, name, role } = response.data;
      localStorage.setItem('token', token);
      
      // Gọi hàm login từ AuthContext để cập nhật state
      await login(data.email, data.password);
      
      toast.success('Đăng nhập thành công!');
      navigate('/');
    } catch (error: any) {
      // Xử lý lỗi chi tiết hơn
      const errorMessage = error.response?.data?.message || 'Đăng nhập thất bại. Vui lòng kiểm tra lại thông tin!';
      toast.error(errorMessage);
    }
  };

  return (
    <Container>
      <div className="form-container">
        <h2 className="form-title">Đăng Nhập</h2>
        <Form onSubmit={handleSubmit(onSubmit)}>
          <Form.Group className="mb-3">
            <Form.Label>Email</Form.Label>
            <Form.Control
              type="email"
              {...register('email')}
              isInvalid={!!errors.email}
            />
            {errors.email && (
              <Form.Control.Feedback type="invalid">
                {errors.email.message}
              </Form.Control.Feedback>
            )}
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Mật khẩu</Form.Label>
            <Form.Control
              type="password"
              {...register('password')}
              isInvalid={!!errors.password}
            />
            {errors.password && (
              <Form.Control.Feedback type="invalid">
                {errors.password.message}
              </Form.Control.Feedback>
            )}
          </Form.Group>

          <Button variant="primary" type="submit" className="w-100">
            Đăng Nhập
          </Button>
        </Form>
      </div>
    </Container>
  );
};

export default Login;