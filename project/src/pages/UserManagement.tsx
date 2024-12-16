import React, { useState, useEffect } from 'react';
import { Table, Button, Form, Modal } from 'react-bootstrap';
import { toast } from 'react-toastify';
import axiosInstance from '../api/axiosConfig';
import { useAuth } from '../contexts/AuthContext';
import styles from '../styles/pages/UserManagement.module.css';

interface User {
  _id: string;
  name: string;
  email: string;
  role: string;
  status: 'active' | 'inactive';
}

const UserManagement = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'user',
    status: 'active',
  });
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    if (isAuthenticated) {
      fetchUsers();
    }
  }, [isAuthenticated]);

  const fetchUsers = async () => {
    try {
      const response = await axiosInstance.get<User[]>('/users');
      setUsers(response.data);
    } catch (error: any) {
      toast.error(
        error?.response?.data?.message || 'Không thể tải danh sách người dùng'
      );
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingUser) {
        await axiosInstance.put(`/users/${editingUser._id}`, formData);
        toast.success('Cập nhật người dùng thành công!');
      } else {
        await axiosInstance.post('/users', formData);
        toast.success('Thêm người dùng mới thành công!');
      }
      setShowModal(false);
      fetchUsers();
      resetForm();
    } catch (error: any) {
      toast.error(error?.response?.data?.message || 'Có lỗi xảy ra. Vui lòng thử lại!');
    }
  };

  const handleEdit = (user: User) => {
    setEditingUser(user);
    setFormData({
      name: user.name,
      email: user.email,
      password: '',
      role: user.role,
      status: user.status,
    });
    setShowModal(true);
  };

  const handleToggleStatus = async (user: User) => {
    try {
      const newStatus = user.status === 'active' ? 'inactive' : 'active';
      await axiosInstance.put(`/users/${user._id}/status`, { status: newStatus });
      toast.success('Cập nhật trạng thái thành công!');
      fetchUsers();
    } catch (error: any) {
      toast.error(
        error?.response?.data?.message || 'Không thể cập nhật trạng thái người dùng'
      );
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      email: '',
      password: '',
      role: 'user',
      status: 'active',
    });
    setEditingUser(null);
  };

  const handleChangeRole = async (user: User, newRole: string) => {
    try {
      await axiosInstance.put(`/users/${user._id}/role`, { role: newRole });
      toast.success('Cập nhật vai trò thành công!');
      fetchUsers();
    } catch (error: any) {
      toast.error(error?.response?.data?.message || 'Có lỗi xảy ra. Vui lòng thử lại!');
    }
  };

  return (
    <div className={styles.container}>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className={styles.heading}>Quản Lý Người Dùng</h2>
        <Button
          variant="primary"
          onClick={() => setShowModal(true)}
          className={styles.addButton}
        >
          Thêm Người Dùng
        </Button>
      </div>

      <div className={styles['table-container']}>
        <Table striped bordered hover>
          <thead>
            <tr>
              <th>Họ Tên</th>
              <th>Email</th>
              <th>Vai Trò</th>
              <th>Trạng Thái</th>
              <th>Thao Tác</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user._id}>
                <td>{user.name}</td>
                <td>{user.email}</td>
                <td>
                  <Form.Select
                    value={user.role}
                    onChange={(e) => handleChangeRole(user, e.target.value)}
                    className={styles['form-control']}
                  >
                    <option value="user">Người dùng</option>
                    <option value="admin">Quản trị viên</option>
                    <option value="librarian">Thủ thư</option>
                  </Form.Select>
                </td>
                <td>{user.status === 'active' ? 'Hoạt động' : 'Đã khóa'}</td>
                <td>
                  <Button
                    variant="warning"
                    size="sm"
                    className="me-2"
                    onClick={() => handleEdit(user)}
                  >
                    Sửa
                  </Button>
                  <Button
                    variant={user.status === 'active' ? 'danger' : 'success'}
                    size="sm"
                    onClick={() => handleToggleStatus(user)}
                  >
                    {user.status === 'active' ? 'Khóa' : 'Mở khóa'}
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </div>

      <Modal
        show={showModal}
        onHide={() => {
          setShowModal(false);
          resetForm();
        }}
      >
        <Modal.Header className={styles['modal-header']} closeButton>
          <Modal.Title className={styles['modal-title']}>
            {editingUser ? 'Chỉnh Sửa Người Dùng' : 'Thêm Người Dùng Mới'}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Label className={styles['form-label']}>Họ Tên</Form.Label>
              <Form.Control
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className={styles['form-control']}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label className={styles['form-label']}>Email</Form.Label>
              <Form.Control
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className={styles['form-control']}
                required
              />
            </Form.Group>

            {!editingUser && (
              <Form.Group className="mb-3">
                <Form.Label className={styles['form-label']}>Mật khẩu</Form.Label>
                <Form.Control
                  type="password"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className={styles['form-control']}
                  required={!editingUser}
                />
              </Form.Group>
            )}

            <Form.Group className="mb-3">
              <Form.Label className={styles['form-label']}>Vai Trò</Form.Label>
              <Form.Select
                value={formData.role}
                onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                className={styles['form-control']}
              >
                <option value="user">Người dùng</option>
                <option value="admin">Quản trị viên</option>
                <option value="librarian">Thủ thư</option>
              </Form.Select>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label className={styles['form-label']}>Trạng Thái</Form.Label>
              <Form.Select
                value={formData.status}
                onChange={(e) =>
                  setFormData({ ...formData, status: e.target.value as 'active' | 'inactive' })
                }
                className={styles['form-control']}
              >
                <option value="active">Hoạt động</option>
                <option value="inactive">Khóa</option>
              </Form.Select>
            </Form.Group>

            <div className="d-flex justify-content-end">
              <Button
                variant="secondary"
                className="me-2"
                onClick={() => {
                  setShowModal(false);
                  resetForm();
                }}
              >
                Hủy
              </Button>
              <Button variant="primary" type="submit">
                {editingUser ? 'Cập Nhật' : 'Thêm Mới'}
              </Button>
            </div>
          </Form>
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default UserManagement;
