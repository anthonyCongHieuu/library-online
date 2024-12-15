import React, { useState } from 'react';
import { Container, Form, Button, Row, Col } from 'react-bootstrap';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import axiosInstance from '../api/axiosConfig';
import styles from '../styles/pages/Register.module.css';


// Schema xác thực
const schema = yup.object().shape({
  name: yup.string().required('Họ tên là bắt buộc'),
  email: yup.string().email('Email không hợp lệ').required('Email là bắt buộc'),
  password: yup.string().required('Mật khẩu là bắt buộc').min(6, 'Mật khẩu phải có ít nhất 6 ký tự'),
  confirmPassword: yup
    .string()
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
  const { register, handleSubmit, formState: { errors } } = useForm<RegisterForm>({
    resolver: yupResolver(schema),
  });

  // State để điều khiển ẩn/hiện mật khẩu
  const [showPassword, setShowPassword] = useState(false);
  const togglePasswordVisibility = () => setShowPassword((prev) => !prev);

  const onSubmit = async (data: RegisterForm) => {
    try {
      await axiosInstance.post('/auth/register', {
        name: data.name,
        email: data.email,
        password: data.password,
      });
      toast.success('Đăng ký thành công! Vui lòng đăng nhập.');
      navigate('/login');
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Đăng ký thất bại. Vui lòng thử lại!';
      toast.error(errorMessage);
    }
  };

  return (
<Container className={styles.registerPage}>
  <div className={styles.formContainer}>
    <h2 className={styles.formTitle}>Đăng ký tài khoản</h2>

    <Form onSubmit={handleSubmit(onSubmit)}>
      {/* Họ và tên */}
      <Form.Group className="mb-3">
        <Form.Label className={styles.formLabel}>Họ và tên</Form.Label>
        <Form.Control
          type="text"
          placeholder="Nhập tên của bạn"
          {...register('name')}
          className={styles.formControl}
          isInvalid={!!errors.name}
        />
      </Form.Group>

      {/* Email */}
      <Form.Group className="mb-3">
        <Form.Label className={styles.formLabel}>Địa chỉ email</Form.Label>
        <Form.Control
          type="email"
          placeholder="Nhập email"
          {...register('email')}
          className={styles.formControl}
          isInvalid={!!errors.email}
        />
      </Form.Group>

      {/* Mật khẩu */}
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
          </Form.Group>
        </Col>
      </Row>

      {/* Ô hiện mật khẩu */}
      <Form.Group className={styles.formCheck}>
        <Form.Check
          type="checkbox"
          label="Hiện mật khẩu"
          onChange={togglePasswordVisibility}
        />
      </Form.Group>

      {/* Nút Đăng ký */}
      <Button type="submit" className={styles.submitButton}>
        Đăng ký tài khoản
      </Button>
    </Form>

    <div className={styles.registerLink}>
      <p>Đã có tài khoản? <a href="/login">Đăng nhập ngay</a></p>
    </div>
  </div>
</Container>
  );
};

export default Register;
