// src/pages/FAQ.tsx
import React from 'react';
import { Container } from 'react-bootstrap';

const FAQ: React.FC = () => {
  return (
    <Container>
      <h2>Câu Hỏi Thường Gặp</h2>
      <h5>Câu hỏi 1: Làm thế nào để mượn sách?</h5>
      <p>Để mượn sách, bạn cần đăng nhập vào tài khoản của mình và tìm kiếm sách bạn muốn mượn. Sau đó, nh ấn nút "Mượn Sách".</p>

      <h5>Câu hỏi 2: Tôi có thể gia hạn thời gian mượn sách không?</h5>
      <p>Có, bạn có thể gia hạn thời gian mượn sách từ trang Quản Lý Mượn Trả.</p>

      <h5>Câu hỏi 3: Làm thế nào để liên hệ với thư viện?</h5>
      <p>Bạn có thể truy cập trang Liên Hệ để gửi câu hỏi hoặc phản hồi cho chúng tôi.</p>
    </Container>
  );
};

export default FAQ;