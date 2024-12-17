import React from 'react';
import { Container } from 'react-bootstrap';
import styles from '../styles/pages/Statistics.module.css';

const Statistics: React.FC = () => {
  return (
    <Container className={styles.container}>
      <h2 className={styles.title}>Thống Kê Sách</h2>

      <div className={styles.statistic}>
        <div className={styles.statItem}>
          <span>Số lượng sách đã mượn:</span>
          <span className={styles.statValue}>100</span>
        </div>

        <div className={styles.statItem}>
          <span>Sách phổ biến nhất:</span>
          <span className={styles.statValue}>"Tên sách"</span>
        </div>
      </div>
    </Container>
  );
};

export default Statistics;
