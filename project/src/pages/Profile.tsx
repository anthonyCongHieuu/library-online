// Profile.tsx
import React, { useEffect, useState } from 'react';
import { Form, Button, Spinner, Alert } from 'react-bootstrap';
import axiosInstance from '../api/axiosConfig';
import { toast } from 'react-toastify';
import { useAuth } from '../contexts/AuthContext'; // Sử dụng AuthContext
import styles from '../styles/pages/Profile.module.css';
import * as Yup from 'yup'; // Thêm validation

// Interface nâng cấp
interface UserProfile {
  name: string;
  email: string;
  currentPassword?: string; // Mật khẩu hiện tại
  newPassword?: string;     // Mật khẩu mới
  confirmPassword?: string; // Xác nhận mật khẩu
}

// Validation Schema
const profileValidationSchema = Yup.object().shape({
  name: Yup.string()
    .required('Tên không được để trống')
    .min(3, 'Tên phải có ít nhất 3 ký tự'),
  email: Yup.string()
    .email('Email không hợp lệ')
    .required('Email không được để trống'),
  currentPassword: Yup.string()
    .when('newPassword', {
      is: (newPassword: string) => newPassword && newPassword.length > 0,
      then: Yup.string().required('Vui lòng nhập mật khẩu hiện tại')
    }),
  newPassword: Yup.string()
    .min(6, 'Mật khẩu mới phải có ít nhất 6 ký tự')
    .notOneOf([Yup.ref('currentPassword')], 'Mật khẩu mới phải khác mật khẩu hiện tại'),
  confirmPassword: Yup.string()
    .when('newPassword', {
      is: (newPassword: string) => newPassword && newPassword.length > 0,
      then: Yup.string()
        .required('Vui lòng xác nhận mật khẩu mới')
        .oneOf([Yup.ref('newPassword')], 'Mật khẩu xác nhận không khớp')
    })
});

const Profile: React.FC = () => {
  const { user } = useAuth(); // Lấy thông tin người dùng từ AuthContext
  const [profile, setProfile] = useState<UserProfile>({
    name: '',
    email: '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [loading, setLoading] = useState<boolean>(false);
  const [validationErrors, setValidationErrors] = useState<{ [key: string]: string }>({});

  // Fetch profile khi component mount
  useEffect(() => {
    const fetchUserProfile = async () => {
      if (!user) return; // Ngăn chặn fetch nếu chưa đăng nhập

      setLoading(true);
      try {
        const response = await axiosInstance.get<UserProfile>('/user/profile');
        setProfile(prev => ({
          ...prev,
          name: response.data.name,
          email: response.data.email
        }));
      } catch (error: any) {
        toast.error(
          error.response?.data?.message || 'Không thể tải thông tin cá nhân'
        );
      } finally {
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, [user]);

  // Validate form trước khi submit
  const validateForm = async () => {
    try {
      await profileValidationSchema.validate(profile, { abortEarly: false });
      setValidationErrors({});
      return true;
    } catch (error: any) {
      const errors: { [key: string]: string } = {};
      error.inner.forEach((err: any) => {
        errors[err.path] = err.message;
      });
      setValidationErrors(errors);
      return false;
    }
  };

  // Xử lý cập nhật profile
  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate form
    const isValid = await validateForm();
    if (!isValid) return;

    setLoading(true);
    try {
      // Chuẩn bị dữ liệu gửi đi
      const updateData = {
        name: profile.name,
        email: profile.email,
        ...(profile.newPassword ? { 
          currentPassword: profile.currentPassword,
          newPassword: profile.newPassword 
        } : {})
      };

      const response = await axiosInstance.put('/user/profile', updateData);
      
      toast.success('Cập nhật thông tin thành công');
      
      // Reset password fields sau khi cập nhật
      setProfile(prev => ({
        ...prev,
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      }));
    } catch (error: any) {
      toast.error(
        error.response?.data?.message || 'Cập nhật thông tin thất bại'
      );
    } finally {
      setLoading(false);
    }
  };

  // Nếu chưa đăng nhập
  if (!user) {
    return <Alert variant="warning">Vui lòng đăng nhập</Alert>;
  }

  return (
    <div className={styles.profileContainer}>
      <h2 className={styles.title}>Thông Tin Cá Nhân</h2>
      <Form onSubmit={handleUpdateProfile}>
        {/* Các trường thông tin */}
        <Form.Group>
          <Form.Label>Tên</Form.Label>
          <Form.Control
            type="text"
            value={profile.name}
            onChange={(e) => setProfile(prev => ({ ...prev, name: e.target.value }))}
            isInvalid={!!validationErrors.name}
          />
          <Form.Control.Feedback type="invalid">
            {validationErrors.name}
          </Form.Control.Feedback>
        </Form.Group>

        {/* Tương tự cho email */}
        
        {/* Các trường mật khẩu */}
        <Form.Group>
          <Form.Label>Mật Khẩu Hiện Tại (Nếu muốn đổi mật khẩu)</Form.Label>
          <Form.Control
            type="password"
            value={profile.currentPassword}
            onChange={(e) => setProfile(prev => ({ ...prev, currentPassword: e.target.value }))}
            isInvalid={!!validationErrors.currentPassword}
          />
          <Form.Control.Feedback type="invalid">
            {validationErrors.currentPassword}
          </Form.Control.Feedback>
        </Form.Group>

        <Form.Group>
          <Form.Label>Mật Khẩu Mới</Form.Label>
          <Form.Control
            type="password"
            value={profile.newPassword}
            onChange={(e) => setProfile(prev => ({ ...prev, newPassword: e.target.value }))}
            isInvalid={!!validationErrors.newPassword}
          />
          <Form.Control.Feedback type="invalid">
            {validationErrors.newPassword}
          </Form.Control.Feedback>
        </Form.Group>

        <Form.Group>
          <Form.Label>Xác Nhận Mật Khẩu Mới</Form.Label>
          <Form.Control
            type="password"
            value={profile.confirmPassword}
            onChange={(e) => setProfile(prev => ({ ...prev, confirmPassword: e.target.value }))}
            isInvalid={!!validationErrors.confirmPassword}
          />
          <Form.Control.Feedback type="invalid">
            {validationErrors.confirmPassword}
          </Form.Control.Feedback>
        </Form.Group>

        <Button
          variant="primary"
          type="submit"
          disabled={loading}
        >
          {loading ? (
            <Spinner
              animation="border"
              role="status"
              size="sm"
              className={styles.spinner}
            >
              <span className="visually-hidden">Đang cập nhật...</span>
            </Spinner>
          ) : (
            'Cập Nhật'
          )}
        </Button>
      </Form>
    </div>
  );
};

export default Profile;