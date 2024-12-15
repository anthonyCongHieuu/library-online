// src/pages/Statistics.tsx
import React from 'react';
import { Container } from 'react-bootstrap';

const Statistics: React.FC = () => {
  return (
    <Container>
      <h2>Thống Kê Sách</h2>
      {/* Thêm biểu đồ hoặc thống kê ở đây */}
      <p>Số lượng sách đã mượn: 100</p>
      <p>Sách phổ biến nhất: "Tên sách"</p>
    </Container>
  );
};

export default Statistics;