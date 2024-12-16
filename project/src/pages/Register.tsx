import React, { useState } from 'react';
import { Container, Form, Button, Row, Col } from 'react-bootstrap';
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
  const [showPassword, setShowPassword] = useState(false);
  const togglePasswordVisibility = () => setShowPassword((prev) => !prev);

  return (
    <div className={styles.registerPage}>
      <div className={styles.formContainer}>
        <h2 className={styles.formTitle}>Đăng Ký Tài Khoản</h2>
        <Form onSubmit={handleSubmit(onSubmit)}>
          <div className={styles.inputGroup}>
            <Form.Label>Họ tên</Form.Label>
            <Form.Control
              type="text"
              placeholder="Nhập họ tên của bạn"
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
              placeholder="Nhập email của bạn"
              isInvalid={!!errors.email}
            />
            {errors.email && (
              <Form.Control.Feedback type="invalid">
                {errors.email.message}
              </Form.Control.Feedback>
            )}
          </div>

          <Row>
            <Col md={6} className="position-relative">
              <Form.Group className="mb-3">
                <Form.Label className={styles.formLabel}>Mật khẩu</Form.Label>
                <Form.Control
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Nhập mật khẩu"
                  {...register('password')}
                  className={styles.formControl}
                  isInvalid={!!errors.password}
                />
                {errors.password && (
                  <Form.Control.Feedback type="invalid">
                    {errors.password.message}
                  </Form.Control.Feedback>
                )}
              </Form.Group>
            </Col>

            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label className={styles.formLabel}>Xác nhận mật khẩu</Form.Label>
                <Form.Control
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Nhập lại mật khẩu"
                  {...register('confirmPassword')}
                  className={styles.formControl}
                  isInvalid={!!errors.confirmPassword}
                />
                {errors.confirmPassword && (
                  <Form.Control.Feedback type="invalid">
                    {errors.confirmPassword.message}
                  </Form.Control.Feedback>
                )}
              </Form.Group>
            </Col>
          </Row>
          <Form.Group className={styles.formCheck}>
            <Form.Check
              type="checkbox"
              label="Hiện mật khẩu"
              onChange={togglePasswordVisibility}
            />
          </Form.Group>

          <Button type="submit" className={styles.submitButton}>
            Đăng ký tài khoản
            {isLoading ? 'Đang đăng ký...' : ''}
          </Button>
        </Form>
        <div className={styles.registerLink}>
          <p>Đã có tài khoản? <a href="/login">Đăng nhập ngay</a></p>
        </div>
      </div>
    </div>
  );
};

export default Register;
