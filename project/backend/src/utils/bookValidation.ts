// Định nghĩa interface chi tiết
export interface BookValidationData {
  title: string;
  author: string;
  isbn?: string;
  category?: string;
  description?: string;
  pageCount?: number;
  quantity?: number;
  available?: number;
  imageLinks?: {
    thumbnail?: string;
  };
}

// Hàm kiểm tra tính hợp lệ của dữ liệu sách
export const validateBookData = (book: BookValidationData) => {
  const errors: string[] = [];

  // Kiểm tra tiêu đề
  if (!book.title || book.title.trim() === '') {
    errors.push('Tiêu đề sách không được để trống');
  }

  // Kiểm tra tác giả
  if (!book.author || book.author.trim() === '') {
    errors.push('Tác giả không được để trống');
  }

  // Kiểm tra số trang (nếu có)
  if (book.pageCount && book.pageCount <= 0) {
    errors.push('Số trang phải lớn hơn 0');
  }

  return {
    isValid: errors.length === 0,
    errors
  };
};

// Hàm chuẩn hóa dữ liệu sách
export const normalizeBookData = (book: any): BookValidationData => {
  return {
    title: book.title?.trim() || 'Không rõ',
    author: Array.isArray(book.authors) 
      ? book.authors.join(', ') 
      : (book.author || 'Không rõ'),
    isbn: extractISBN(book) || '',
    category: book.categories?.[0] || 'Chưa phân loại',
    description: book.description?.trim() || '',
    pageCount: book.pageCount || 0,
    quantity: 1,
    available: 1,
    imageLinks: {
      thumbnail: book.imageLinks?.thumbnail || book.coverImage
    }
  };
};

// Trích xuất ISBN
const extractISBN = (book: any): string | null => {
  if (!book.industryIdentifiers) return null;
  
  const isbn13 = book.industryIdentifiers.find(
    (id: any) => id.type === 'ISBN_13'
  );
  const isbn10 = book.industryIdentifiers.find(
    (id: any) => id.type === 'ISBN_10'
  );
  
  return isbn13?.identifier || isbn10?.identifier || null;
};