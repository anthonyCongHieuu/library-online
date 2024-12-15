// src/pages/ManageBorrows.tsx
import React, { useEffect, useState } from 'react';
import { Container, Table } from 'react-bootstrap';
import axiosInstance from '../api/axiosConfig';
import { toast } from 'react-toastify';

// Định nghĩa kiểu cho dữ liệu mượn sách
interface BorrowRecord {
  _id: string;
  book: {
    title: string;
  };
  user: {
    name: string;
  };
  borrowDate: string;
  returnDate: string;
}

const ManageBorrows: React.FC = () => {
  const [borrows, setBorrows] = useState<BorrowRecord[]>([]); // Sử dụng kiểu BorrowRecord

  useEffect(() => {
    const fetchBorrows = async () => {
      try {
        const response = await axiosInstance.get<BorrowRecord[]>('/borrows'); // Định nghĩa kiểu cho response
        setBorrows(response.data);
      } catch (error) {
        toast.error('Không thể tải danh sách mượn sách');
      }
    };

    fetchBorrows();
  }, []);

  return (
    <Container>
      <h2>Quản Lý Mượn Trả</h2>
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>Tên Sách</th>
            <th>Người Mượn</th>
            <th>Ngày Mượn</th>
            <th>Ngày Trả</th>
          </tr>
        </thead>
        <tbody>
          {borrows.map((borrow) => (
            <tr key={borrow._id}>
              <td>{borrow.book.title}</td>
              <td>{borrow.user.name}</td>
              <td>{new Date(borrow.borrowDate).toLocaleDateString()}</td>
              <td>{new Date(borrow.returnDate).toLocaleDateString()}</td>
            </tr>
          ))}
        </tbody>
      </Table>
    </Container>
  );
};

export default ManageBorrows;