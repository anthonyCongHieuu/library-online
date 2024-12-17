import React, { useEffect, useState } from 'react';
import { Container, Table, Alert, Spinner } from 'react-bootstrap';
import axiosInstance from '../api/axiosConfig';
import { toast } from 'react-toastify';
import styles from '../styles/pages/ManageBorrows.module.css';

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
        const response = await axiosInstance.get<BorrowsResponse>('/borrows', {
          params: { page: 1, limit: 10 }
        });

        const borrowData = response.data.borrowRecords || [];
        setBorrows(borrowData);
        setPagination({
          totalPages: response.data.totalPages || 1,
          currentPage: response.data.currentPage || 1
        });

        if (borrowData.length === 0) setError('Không có dữ liệu mượn sách');
      } catch (error: any) {
        setError(error.response?.data?.message || 'Không thể tải danh sách mượn sách');
        toast.error('Không thể tải danh sách mượn sách');
      } finally {
        setLoading(false);
      }
    };

    fetchBorrows();
  }, []);

  if (loading) {
    return (
      <Container className={`${styles.container} text-center mt-5`}>
        <Spinner animation="border" role="status" className={styles.spinner}>
          <span className="visually-hidden">Đang tải...</span>
        </Spinner>
      </Container>
    );
  }

  if (error) {
    return (
      <Container className={styles.container}>
        <Alert variant="warning" className={styles.alert}>
          {error}
        </Alert>
      </Container>
    );
  }

  return (
    <Container className={styles.container}>
      <h2 className={styles.title}>Quản Lý Mượn Trả</h2>

      {borrows.length === 0 ? (
        <Alert variant="info" className={styles.alert}>
          Không có dữ liệu mượn sách
        </Alert>
      ) : (
        <>
          <Table striped bordered hover responsive className={styles.table}>
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
                    <span
                      className={`${styles.status} ${
                        borrow.status === 'borrowed'
                          ? styles.borrowed
                          : styles.returned
                      }`}
                    >
                      {borrow.status === 'returned' ? 'Đã trả' : 'Đang mượn'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>

          {/* Phân trang */}
          {pagination.totalPages > 1 && (
            <div className={`${styles.pagination} mt-3`}>
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
