import React, { useState, useEffect } from 'react';
import { Form, Button } from 'react-bootstrap';
import { FaCamera, FaUser, FaEnvelope } from 'react-icons/fa';
import { toast } from 'react-toastify';
import axiosInstance from '../api/axiosConfig';
import { useAuth } from '../contexts/AuthContext';
import styles from '../styles/pages/Profile.module.css';

// Mở rộng interface User để bao gồm avatar
interface ExtendedUser {
  _id?: string;
  name: string;
  email: string;
  role: string;
  avatar?: string; // Đảm bảo avatar có thể tồn tại
}

interface AvatarUploadResponse {
  avatarUrl?: string;
}

const Profile: React.FC = () => {
  const { user } = useAuth();
  const [profile, setProfile] = useState<ExtendedUser>({
    name: '',
    email: '',
    role: '',
    avatar: '/default-avatar.png' // Đặt ảnh mặc định nếu không có avatar
  });

  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [passwordFields, setPasswordFields] = useState({
    currentPassword: '',
    newPassword: ''
  });
  const [loading, setLoading] = useState(false);

  // Load user data on component mount
  useEffect(() => {
    if (user) {
      setProfile({
        name: user.name || '',
        email: user.email || '',
        role: user.role || '',
        avatar: user.avatar || '/default-avatar.png' // Sử dụng ảnh mặc định nếu không có avatar
      });
    }
  }, [user]);

  const handleProfileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setProfile(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPasswordFields(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setAvatarFile(file);
      setAvatarPreview(URL.createObjectURL(file)); // Tạo preview cho ảnh
    }
  };

  const handleAvatarUpload = async () => {
    if (!avatarFile) {
      toast.error('Vui lòng chọn ảnh');
      return;
    }

    const formData = new FormData();
    formData.append('avatar', avatarFile);

    try {
      setLoading(true);
      const response = await axiosInstance.post<AvatarUploadResponse>('/auth/upload-avatar', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      
      // Cập nhật URL avatar từ response
      const newAvatarUrl = response.data.avatarUrl || '/default-avatar.png';
      setProfile(prev => ({
        ...prev,
        avatar: newAvatarUrl
      }));

      toast.success('Cập nhật ảnh đại diện thành công');
      setAvatarFile(null);
    } catch (error: any) {
      toast.error(
        error.response?.data?.message || 'Cập nhật ảnh thất bại'
      );
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    if (!profile.name || !profile.email) {
      toast.error('Vui lòng điền đầy đủ thông tin');
      setLoading(false);
      return;
    }

    try {
      const updateData = {
        name: profile.name,
        email: profile.email,
        ...(passwordFields.newPassword ? { 
          currentPassword: passwordFields.currentPassword,
          newPassword: passwordFields.newPassword 
        } : {})
      };

      await axiosInstance.put('/auth/profile', updateData);
      
      toast.success('Cập nhật thông tin thành công');
      
      // Reset password fields
      setPasswordFields({
        currentPassword: '',
        newPassword: ''
      });
    } catch (error: any) {
      toast.error(
        error.response?.data?.message || 'Cập nhật thông tin thất bại'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.profileContainer}>
      <h2 className={styles.title}>Hồ Sơ Cá Nhân</h2>
      <div className={styles.card}>
        <div className="text-center mb-4">
          <div className="position-relative d-inline-block">
            <img 
              src={avatarPreview || profile.avatar || '/default-avatar.png'}
              alt="Avatar" 
              className="rounded-circle"
              style={{ 
                width: '150px', 
                height: '150px', 
                objectFit: 'cover' 
              }}
            />
            <input 
              type="file" 
              id="avatarUpload"
              accept="image/*"
              onChange={handleAvatarChange}
              style={{ display: 'none' }}
            />
            <label 
              htmlFor="avatarUpload" 
              className="btn btn-primary position-absolute bottom-0 end-0 rounded-circle"
              style={{ 
                padding: '10px', 
                transform: 'translate(-50%, -50%)' 
              }}
            >
              <FaCamera />
            </label>
          </div>
          {avatarFile && (
            <Button 
              variant="success" 
              onClick={handleAvatarUpload}
              disabled={loading}
              className="mt-2"
            >
              {loading ? 'Đang tải...' : 'Lưu Ảnh'}
            </Button>
          )}
        </div>

        <Form onSubmit={handleSubmit}>
          <Form.Group className={styles.formGroup}>
            <Form.Label className={styles.label}>
              <FaUser className="me-2" /> Tên
            </Form.Label>
            <Form.Control
              type="text"
              name="name"
              className={styles.input}
              value={profile.name}
              onChange={handleProfileChange}
              placeholder="Nhập tên"
              required
            />
          </Form.Group>

          <Form.Group className={styles.formGroup}>
            <Form.Label className={styles.label}>
              <FaEnvelope className="me-2" /> Email
            </Form.Label>
            <Form.Control
              type="email"
              name="email"
              className={styles.input}
              value={profile.email}
              onChange={handleProfileChange}
              placeholder="Nhập email"
              required
            />
          </Form.Group>

          <Form.Group className={styles.formGroup}>
            <Form.Label className={styles.label}>Vai trò</Form.Label>
            <Form.Control
              type="text"
              value={profile.role}
              className={styles.input}
              readOnly
            />
          </Form.Group>

          <Form.Group className={styles.formGroup}>
            <Form.Label className={styles.label}>Mật khẩu hiện tại</Form.Label>
            <Form.Control
              type="password"
              name="currentPassword"
              className={styles.input}
              value={passwordFields.currentPassword}
              onChange={handlePasswordChange}
              placeholder="Mật khẩu hiện tại"
            />
          </Form.Group>

          <Form.Group className={styles.formGroup}>
            <Form.Label className={styles.label}>Mật khẩu mới</Form.Label>
            <Form.Control
              type="password"
              name="newPassword"
              className={styles.input}
              value={passwordFields.newPassword}
              onChange={handlePasswordChange}
              placeholder="Mật khẩu mới"
            />
          </Form.Group>

          <Button 
            variant="primary" 
            type="submit" 
            disabled={loading}
            className={styles.button}
          >
            {loading ? 'Đang cập nhật...' : 'Cập nhật'}
          </Button>
        </Form>
      </div>
    </div>
  );
};

export default Profile;
