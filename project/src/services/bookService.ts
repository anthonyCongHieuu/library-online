import axios from 'axios';

// --- Interfaces ---
export interface BookDetail {
  key: string;
  title: string;
  authors: { name: string; key?: string }[];
  covers?: number[];
  description?: string | { value: string };
  first_publish_year?: number;
  subjects?: string[];
  number_of_pages?: number;
  cover_i?: number;
  isbn?: string | null;
}

export interface Book {
  key: string;
  title: string;
  author_name?: string[];
  cover_i?: number;
  first_publish_year?: number;
  subject?: string[];
}

export interface BookSearchResponse {
  docs: Book[];
  num_found: number;
}

// Danh sách chủ đề để tìm kiếm sách
const BOOK_SUBJECTS = [
  'fiction', 
  'science', 
  'history', 
  'philosophy', 
  'technology', 
  'romance', 
  'mystery',
  'adventure'
];

// Hàm kiểm tra kết nối internet
export const checkInternetConnection = (): boolean => navigator.onLine;

// Hàm trích xuất mô tả
const extractDescription = (description?: string | { value: string }): string => {
  if (!description) return 'Không có mô tả';
  return typeof description === 'string' ? description : description.value || 'Không có mô tả';
};

// Hàm xử lý chi tiết sách
const processBookDetails = (data: any): BookDetail => ({
  key: data.key || '',
  title: data.title || 'Không rõ tiêu đề',
  authors: data.authors?.map((author: any) => ({
    name: author.name || 'Không rõ tác giả',
    key: author.key || ''
  })) || [],
  description: extractDescription(data.description),
  first_publish_year: data.first_publish_year || 'Không rõ',
  subjects: data.subjects || [],
  covers: data.covers || [],
  number_of_pages: data.number_of_pages || 0,
  cover_i: data.covers?.[0],
  isbn: extractISBN(data),
});

// Hàm trích xuất ISBN
const extractISBN = (book: any): string | null => {
  if (book.isbn_13?.length > 0) return book.isbn_13[0];
  if (book.isbn_10?.length > 0) return book.isbn_10[0];
  return null;
};

// Hàm fetch dữ liệu sách từ API
const fetchBookData = async (url: string): Promise<any> => {
  try {
    const response = await axios.get(url, {
      headers: {
        'Content-Type': 'application/json',
      },
    });
    return response.data;
  } catch (error) {
    console.error('Fetch error:', error);
    throw new Error('Không thể tải dữ liệu. Vui lòng kiểm tra URL hoặc thử lại sau.');
  }
};

// Hàm lấy chi tiết sách từ OpenLibrary
export const getBookDetails = async (key: string): Promise<BookDetail> => {
  if (!checkInternetConnection()) throw new Error('Không có kết nối internet. Vui lòng kiểm tra đường truyền.');

  const cleanKey = key.replace(/\/+/g, '/');
  const url = `https://openlibrary.org${cleanKey}.json`;

  try {
    const data = await fetchBookData(url);
    return processBookDetails(data);
  } catch (error) {
    console.error('Detailed fetch error:', error);
    throw new Error('Lỗi không xác định khi tải sách');
  }
};

// Hàm tìm kiếm sách theo chủ đề
export const searchBooks = async (subject?: string): Promise<BookSearchResponse> => {
  const searchSubject = subject || BOOK_SUBJECTS[Math.floor(Math.random() * BOOK_SUBJECTS.length)];

  try {
    const response = await axios.get<BookSearchResponse>('https://openlibrary.org/search.json', {
      params: { subject: searchSubject, limit: 20, has_fulltext: true, sort: 'random' }
    });

    const booksWithCovers = response.data.docs.filter(book => book.cover_i && book.title && book.author_name);
    return { ...response.data, docs: booksWithCovers };
  } catch (error) {
    console.error('Error fetching books:', error);
    throw new Error('Không thể tải sách. Vui lòng thử lại.');
  }
};

// Hàm tìm kiếm sách với từ khóa
export const findBooks = async (query?: string): Promise<BookSearchResponse> => {
  try {
    const response = await axios.get<BookSearchResponse>('https://openlibrary.org/search.json', {
 params: { q: query || BOOK_SUBJECTS[Math.floor(Math.random() * BOOK_SUBJECTS.length)], limit: 20, has_fulltext: true }
    });

    const booksWithCovers = response.data.docs.filter(book => book.cover_i && book.title && book.author_name);
    return { ...response.data, docs: booksWithCovers };
  } catch (error) {
    console.error('Error finding books:', error);
    throw new Error('Không thể tìm kiếm sách. Vui lòng thử lại.');
  }
};

// Hàm lấy URL ảnh bìa sách
export const getBookCoverUrl = (book: BookDetail | Book, size: 'S' | 'M' | 'L' = 'M') => {
  const coverId = (book as BookDetail).covers?.[0] || (book as Book).cover_i;
  return coverId ? `https://covers.openlibrary.org/b/id/${coverId}-${size}.jpg` : '/default-book-cover.png';
};