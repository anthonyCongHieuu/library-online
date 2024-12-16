import React, { useEffect, useState } from 'react';
import { Container, Grid, Typography, Paper, Chip, Button, Skeleton, Box } from '@mui/material';
import { Book as BookIcon, Person as AuthorIcon, Description as DescriptionIcon, Category as CategoryIcon, Error as ErrorIcon } from '@mui/icons-material';
import { useParams } from 'react-router-dom';
import { getBookDetails, BookDetail } from '../services/bookService';
import { toast } from 'react-toastify';

const BookDetailPage: React.FC = () => {
  const { key } = useParams<{ key: string }>();
  const [book, setBook] = useState<BookDetail | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchBookDetails = async () => {
    if (!key) {
      setError('Không có mã sách');
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const data = await getBookDetails(key);
      setBook(data);
      setError(null);
    } catch (error) {
      console.error('Error fetching book details:', error);
      const errorMessage = error instanceof Error ? error.message : 'Lỗi không xác định khi tải sách';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookDetails();
  }, [key]);

  // Component hiển thị skeleton loading
  const BookDetailSkeleton = () => (
    <Container>
      <Grid container spacing={3}>
        <Grid item xs={12} md={4}>
          <Skeleton
            variant="rectangular"
            width="100%"
            height={400}
            sx={{ borderRadius: 2 }}
          />
        </Grid>
        <Grid item xs={12} md={8}>
          <Skeleton variant="text" width="70%" height={60} />
          <Skeleton variant="text" width="50%" height={40} />
          <Skeleton variant="text" width="100%" height={200} />
        </Grid>
      </Grid>
    </Container>
  );

  // Component hiển thị lỗi
  const ErrorDisplay = () => (
    <Container>
      <Paper
        elevation={3}
        sx={{
          p: 4,
          textAlign: 'center',
          bgcolor: 'error.light',
          color: 'error.contrastText'
        }}
      >
        <ErrorIcon sx={{ fontSize: 80, mb: 2 }} />
        <Typography variant="h5">
          {error || 'Đã xảy ra lỗi'}
        </Typography>
        <Button
          variant="contained"
          color="primary"
          onClick={fetchBookDetails}
          sx={{ mt: 2 }}
        >
          Thử Lại
        </Button>
      </Paper>
    </Container>
  );

  // Component hiển thị ảnh bìa sách
  const BookCover = ({ book }: { book: BookDetail }) => {
    const coverUrl = book.covers && book.covers.length > 0
      ? `https://covers.openlibrary.org/b/id/${book.covers[0]}-L.jpg`
      : '/default-book-cover.png';

    return (
      <Box
        component="img"
        sx={{
          width: '100%',
          maxHeight: 500,
          objectFit: 'cover',
          borderRadius: 2,
          boxShadow: 3
        }}
        src={coverUrl}
        alt={book.title}
        onError={(e) => {
          (e.target as HTMLImageElement).src = '/default-book-cover.png';
        }}
      />
    );
  };

  // Render chi tiết sách
  const BookDetails = ({ book }: { book: BookDetail }) => (
    <Paper elevation={3} sx={{ p: 3, height: '100%' }}>
      <Typography variant="h4" gutterBottom>
        <BookIcon sx={{ mr: 2, verticalAlign: 'middle' }} />
        {book.title}
      </Typography>

      <Typography variant="subtitle1" color="text.secondary" sx={{ mb: 2 }}>
        <AuthorIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
        {book.authors.map(author => author.name).join(', ') || 'Không rõ tác giả'}
      </Typography>

      <Typography variant="body1" sx={{ mb: 2 }}>
        <DescriptionIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
        <strong>Mô tả:</strong>{' '}
        {typeof book.description === 'string'
          ? book.description
          : book.description?.value || 'Không có mô tả'}
      </Typography>

      <Typography variant="body2" sx={{ mb: 2 }}>
        <strong>Năm xuất bản:</strong> {book.first_publish_year || 'Không rõ'}
      </Typography>

      {/* Thêm đoạn code về chủ đề */}
      {book.subjects && book.subjects.length > 0 && (
        <Box sx={{ mt: 2 }}>
          <Typography variant="subtitle2">
            <CategoryIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
            Chủ đề:
          </Typography>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
            {book.subjects.map((subject, index) => (
              <Chip
                key={index}
                label={subject}
                color="primary"
                variant="outlined"
                size="small"
                sx={{ mb: 1 }}
              />
            ))}
          </Box>
        </Box>
      )}
    </Paper>
  );

  // Render chính
  return (
    <Container sx={{ py: 4 }}>
      {loading ? (
        <BookDetailSkeleton />
      ) : error ? (
        <ErrorDisplay />
      ) : book ? (
        <Grid container spacing={3}>
          <Grid item xs={12} md={4}>
            <BookCover book={book} />
          </Grid>
          <Grid item xs={12} md={8}>
            <BookDetails book={book} />
          </Grid>
        </Grid>
      ) : null}
    </Container>
  );
};

export default BookDetailPage;