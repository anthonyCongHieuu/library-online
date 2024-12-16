import React from 'react';
import { Container } from 'react-bootstrap';
import styles from '../styles/pages/FAQ.module.css'; // Import file CSS

const FAQ: React.FC = () => {
  return (
    <Container className={styles.container}> {/* Áp dụng lớp container */}
      <h2 className={styles.title}>Câu Hỏi Thường Gặp</h2> {/* Áp dụng lớp title */}
      
      <h5 className={styles.question}>Câu hỏi 1: Làm thế nào để mượn sách?</h5>
      <p className={styles.answer}>
        Để mượn sách, bạn cần đăng nhập vào tài khoản của mình và tìm kiếm sách bạn muốn mượn. 
        Sau đó, nhấn nút "Mượn Sách".
      </p>
      
      <h5 className={styles.question}>Câu hỏi 2: Tôi có thể gia hạn thời gian mượn sách không?</h5>
      <p className={styles.answer}>
        Có, bạn có thể gia hạn thời gian mượn sách từ trang Quản Lý Mượn Trả.
      </p>
      
      <h5 className={styles.question}>Làm thế nào để liên hệ với thư viện?</h5>
      <p className={styles.answer}>
        Bạn có thể truy cập trang Liên Hệ để gửi câu hỏi hoặc phản hồi cho chúng tôi.
      </p>
    </Container>
  );
};

export default FAQ;
