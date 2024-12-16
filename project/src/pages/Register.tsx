import React, { useState } from 'react';
import { Form, Button } from 'react-bootstrap';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import axiosInstance from '../api/axiosConfig';
import styles from '../styles/pages/Register.module.css'; // Import CSS module

// Validation schema
const schema = yup.object().shape({
  name: yup.string()
    .required('Họ tên là bắt buộc')
    .min(2, 'Họ tên phải có ít nhất 2 ký tự'),
  email: yup.string()
    .email('Email không hợp lệ')
    .required('Email là bắt buộc'),
  password: yup.string()
    .required('Mật khẩu là bắt buộc')
    .min(6, 'Mật khẩu phải có ít nhất 6 ký tự'),
  confirmPassword: yup.string()
    .oneOf([yup.ref('password')], 'Mật khẩu không khớp')
    .required('Xác nhận mật khẩu là bắt buộc'),
});

interface RegisterForm {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

const Register = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  const { 
    register, 
    handleSubmit, 
    formState: { errors } 
  } = useForm<RegisterForm>({
    resolver: yupResolver(schema),
  });

  const onSubmit = async (data: RegisterForm) => {
    setIsLoading(true);
    try {
      const { confirmPassword, ...submitData } = data;
      await axiosInstance.post('/auth/register', {
        ...submitData,
        role: 'user',
      });

      toast.success('Đăng ký thành công! Vui lòng đăng nhập.');
      navigate('/login');
    } catch (error: any) {
      const errorMessage = error.response?.data?.message 
        || error.response?.data?.errors?.[0] 
        || 'Đăng ký thất bại. Vui lòng thử lại!';
      
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={styles.registerPage}>
      <div className={styles.formContainer}>
        <h2 className={styles.formTitle}>Đăng Ký Tài Khoản</h2>
        <Form onSubmit={handleSubmit(onSubmit)}>
          <div className={styles.inputGroup}>
            <Form.Label>Họ tên</Form.Label>
            <Form.Control
              type="text"
              className={styles.formControl}
              {...register('name')}
              isInvalid={!!errors.name}
            />
            {errors.name && (
              <Form.Control.Feedback type="invalid">
                {errors.name.message}
              </Form.Control.Feedback>
            )}
          </div>

          <div className={styles.inputGroup}>
            <Form.Label>Email</Form.Label>
            <Form.Control
              type="email"
              className={styles.formControl}
              {...register('email')}
              isInvalid={!!errors.email}
            />
            {errors.email && (
              <Form.Control.Feedback type="invalid">
                {errors.email.message}
              </Form.Control.Feedback>
            )}
          </div>

          <div className={styles.inputGroup}>
            <Form.Label>Mật khẩu</Form.Label>
            <Form.Control
              type="password"
              className={styles.formControl}
              {...register('password')}
              isInvalid={!!errors.password}
            />
            {errors.password && (
              <Form.Control.Feedback type="invalid">
                {errors.password.message}
              </Form.Control.Feedback>
            )}
          </div>

          <div className={styles.inputGroup}>
            <Form.Label>Xác nhận mật khẩu</Form.Label>
            <Form.Control
              type="password"
              className={styles.formControl}
              {...register('confirmPassword')}
              isInvalid={!!errors.confirmPassword}
            />
            {errors.confirmPassword && (
              <Form.Control.Feedback type="invalid">
                {errors.confirmPassword.message}
              </Form.Control.Feedback>
            )}
          </div>

          <Button 
            type="submit" 
            className={styles.submitButton} 
            disabled={isLoading}
          >
            {isLoading ? 'Đang đăng ký...' : 'Đăng Ký'}
          </Button>
        </Form>
      </div>
    </div>
  );
};

export default Register;
