// src/pages/ManageBorrows.tsx
import React, { useEffect, useState } from 'react';
import { Container, Table, Alert, Spinner } from 'react-bootstrap';
import axiosInstance from '../api/axiosConfig';
import { toast } from 'react-toastify';

// Định nghĩa kiểu chi tiết hơn
interface BorrowRecord {
  _id: string;
  book: {
    title: string;
    author: string;
  };
  user: {
    name: string;
    email: string;
  };
  borrowDate: string;
  returnDate?: string;
  status: 'borrowed' | 'returned';
}

// Interface for API response
interface BorrowsResponse {
  borrowRecords?: BorrowRecord[];
  totalPages?: number;
  currentPage?: number;
}

const ManageBorrows: React.FC = () => {
  const [borrows, setBorrows] = useState<BorrowRecord[]>([]); 
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({
    totalPages: 1,
    currentPage: 1
  });

  useEffect(() => {
    const fetchBorrows = async () => {
      try {
        setLoading(true);
        // Thêm params để debug
        const response = await axiosInstance.get<BorrowsResponse>('/borrows', {
          params: {
            page: 1,
            limit: 10
          }
        });
        
        // Debug log
        console.log('Full Response:', response);
        console.log('Response Data:', response.data);

        // Xử lý dữ liệu từ response
        const borrowData = response.data.borrowRecords || [];

        setBorrows(borrowData);
        
        // Cập nhật thông tin phân trang
        setPagination({
          totalPages: response.data.totalPages || 1,
          currentPage: response.data.currentPage || 1
        });

        if (borrowData.length === 0) {
          setError('Không có dữ liệu mượn sách');
        }
      } catch (error: any) {
        console.error('Error Details:', {
          message: error.message,
          response: error.response,
          request: error.request
        });

        setError(
          error.response?.data?.message || 
          'Không thể tải danh sách mượn sách'
        );
        toast.error('Không thể tải danh sách mượn sách');
      } finally {
        setLoading(false);
      }
    };

    fetchBorrows();
  }, []);

  if (loading) {
    return (
      <Container className="text-center mt-5">
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Đang tải...</span>
        </Spinner>
      </Container>
    );
  }

  if (error) {
    return (
      <Container>
        <Alert variant="warning">{error}</Alert>
      </Container>
    );
  }

  return (
    <Container>
      <h2 className="mb-4">Quản Lý Mượn Trả</h2>
      {borrows.length === 0 ? (
        <Alert variant="info">Không có dữ liệu mượn sách</Alert>
      ) : (
        <>
          <Table striped bordered hover responsive>
            <thead>
              <tr>
                <th>Tên Sách</th>
                <th>Tác Giả</th>
                <th>Người Mượn</th>
                <th>Ngày Mượn</th>
                <th>Ngày Trả</th>
                <th>Trạng Thái</th>
              </tr>
            </thead>
            <tbody>
              {borrows.map((borrow) => (
                <tr key={borrow._id}>
                  <td>{borrow.book?.title || 'Không rõ'}</td>
                  <td>{borrow.book?.author || 'Không rõ'}</td>
                  <td>{borrow.user?.name || 'Không rõ'}</td>
                  <td>
                    {borrow.borrowDate 
                      ? new Date(borrow.borrowDate).toLocaleDateString() 
                      : 'Chưa xác định'}
                  </td>
                  <td>
                    {borrow.returnDate 
                      ? new Date(borrow.returnDate).toLocaleDateString() 
                      : 'Chưa trả'}
                  </td>
                  <td>
                    {borrow.status === 'returned' 
                      ? 'Đã trả' 
                      : 'Đang mượn'}
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>

          {/* Phân trang */}
          {pagination.totalPages > 1 && (
            <div className="d-flex justify-content-center mt-3">
              <p>
                Trang {pagination.currentPage} / {pagination.totalPages}
              </p>
            </div>
          )}
        </>
      )}
    </Container>
  );
};

export default ManageBorrows;