import React, { useEffect, useState } from 'react';
import { Container, Form, Button } from 'react-bootstrap';
import axiosInstance from '../api/axiosConfig';
import { toast } from 'react-toastify';

interface User {
  name: string;
  email: string;
}

interface ErrorResponse {
  message?: string;
}

// Tự định nghĩa kiểu AxiosError nếu import không hoạt động
interface CustomAxiosError extends Error {
  response?: {
    data?: ErrorResponse;
    status?: number;
  };
  isAxiosError?: boolean;
}

const Profile: React.FC = () => {
  const [user, setUser] = useState<User>({ name: '', email: '' });
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    const fetchUserProfile = async (): Promise<void> => {
      setLoading(true);
      try {
        const response = await axiosInstance.get<User>('/profile');
        setUser(response.data);
      } catch (error: unknown) {
        // Kiểm tra nếu error là AxiosError
        if (isAxiosError(error)) {
          const errorMessage = 
            error.response?.data?.message || 
            'Không thể tải thông tin cá nhân';
          toast.error(errorMessage);
        } else {
          toast.error('Đã xảy ra lỗi không xác định');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, []);

  const handleUpdateProfile = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await axiosInstance.put<User>('/profile', user);
      toast.success('Cập nhật thông tin thành công');
      // Đảm bảo response.data có kiểu User
      setUser((prevUser) => ({
        ...prevUser,
        ...response.data
      }));
    } catch (error: unknown) {
      // Kiểm tra nếu error là AxiosError
      if (isAxiosError(error)) {
        const errorMessage = 
          error.response?.data?.message || 
          'Cập nhật thông tin thất bại';
        toast.error(errorMessage);
      } else {
        toast.error('Đã xảy ra lỗi không xác định');
      }
    } finally {
      setLoading(false);
    }
  };

  // Hàm kiểm tra Axios Error
  function isAxiosError(error: unknown): error is CustomAxiosError {
    return (
      typeof error === 'object' && 
      error !== null && 
      'isAxiosError' in error && 
      (error as CustomAxiosError).isAxiosError === true
    );
  }

  return (
    <Container>
      <h2>Thông Tin Cá Nhân</h2>
      <Form onSubmit={handleUpdateProfile}>
        <Form.Group controlId="formName">
          <Form.Label>Tên</Form.Label>
          <Form.Control
            type="text"
            value={user.name}
            onChange={(e) => setUser((prevUser) => ({
              ...prevUser,
              name: e.target.value
            }))}
            required
          />
        </Form.Group>
        <Form.Group controlId="formEmail">
          <Form.Label>Email</Form.Label>
          <Form.Control
            type="email"
            value={user.email}
            onChange={(e) => setUser((prevUser) => ({
              ...prevUser,
              email: e.target.value
            }))}
            required
          />
        </Form.Group>
        <Button variant="primary" type="submit" disabled={loading}>
          {loading ? 'Đang cập nhật...' : 'Cập Nhật'}
        </Button>
      </Form>
    </Container>
  );
};

export default Profile;