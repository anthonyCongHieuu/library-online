import React, { useState, useEffect } from 'react';
import { Container, Table, Button, Form, Modal } from 'react-bootstrap';
import { toast } from 'react-toastify';
import axios from 'axios';

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
    status: 'active'
  });

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/users');
      setUsers(response.data);
    } catch (error) {
      toast.error('Không thể tải danh sách người dùng');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingUser) {
        await axios.put(`http://localhost:5000/api/users/${editingUser._id}`, formData);
        toast.success('Cập nhật người dùng thành công!');
      } else {
        await axios.post('http://localhost:5000/api/users', formData);
        toast.success('Thêm người dùng mới thành công!');
      }
      setShowModal(false);
      fetchUsers();
      resetForm();
    } catch (error) {
      toast.error('Có lỗi xảy ra. Vui lòng thử lại!');
    }
  };

  const handleEdit = (user: User) => {
    setEditingUser(user);
    setFormData({
      name: user.name,
      email: user.email,
      password: '',
      role: user.role,
      status: user.status
    });
    setShowModal(true);
  };

  const handleToggleStatus = async (user: User) => {
    try {
      const newStatus = user.status === 'active' ? 'inactive' : 'active';
      await axios.put(`http://localhost:5000/api/users/${user._id}/status`, {
        status: newStatus
      });
      toast.success('Cập nhật trạng thái thành công!');
      fetchUsers();
    } catch (error) {
      toast.error('Không thể cập nhật trạng thái người dùng');
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      email: '',
      password: '',
      role: 'user',
      status: 'active'
    });
    setEditingUser(null);
  };

  return (
    <Container>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Quản Lý Người Dùng</h2>
        <Button variant="primary" onClick={() => setShowModal(true)}>
          Thêm Người Dùng
        </Button>
      </div>

      <div className="table-container">
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
                <td>{user.role === 'admin' ? 'Quản trị viên' : 'Người dùng'}</td>
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

      <Modal show={showModal} onHide={() => {
        setShowModal(false);
        resetForm();
      }}>
        <Modal.Header closeButton>
          <Modal.Title>
            {editingUser ? 'Chỉnh Sửa Người Dùng' : 'Thêm Người Dùng Mới'}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>Họ Tên</Form.Label>
              <Form.Control
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                required
              />
            </Form.Group>

            {!editingUser && (
              <Form.Group className="mb-3">
                <Form.Label>Mật khẩu</Form.Label>
                <Form.Control
                  type="password"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  required={!editingUser}
                />
              </Form.Group>
            )}

            <Form.Group className="mb-3">
              <Form.Label>Vai Trò</Form.Label>
              <Form.Select
                value={formData.role}
                onChange={(e) => setFormData({ ...formData, role: e.target.value })}
              >
                <option value="user">Người dùng</option>
                <option value="admin">Quản trị viên</option>
              </Form.Select>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Trạng Thái</Form.Label>
              <Form.Select
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value as 'active' | 'inactive' })}
              >
                <option value="active">Hoạt động</option>
                <option value="inactive">Khóa</option>
              </Form.Select>
            </Form.Group>

            <div className="d-flex justify-content-end">
              <Button variant="secondary" className="me-2" onClick={() => {
                setShowModal(false);
                resetForm();
              }}>
                Hủy
              </Button>
              <Button variant="primary" type="submit">
                {editingUser ? 'Cập Nhật' : 'Thêm Mới'}
              </Button>
            </div>
          </Form>
        </Modal.Body>
      </Modal>
    </Container>
  );
};

export default UserManagement;