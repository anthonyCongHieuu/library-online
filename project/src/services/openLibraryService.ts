import axios from 'axios';
import { BookDetail } from '../types/book';

class OpenLibraryService {
  private baseUrl: string;

  constructor() {
    this.baseUrl = process.env.OPEN_LIBRARY_BASE_URL || 'https://openlibrary.org';
  }

  async getBookDetails(key: string): Promise<BookDetail> {
    try {
      const url = `${this.baseUrl}/works/${key}.json`;
      const response = await axios.get(url);
      return this.processBookDetails(response.data);
    } catch (error) {
      console.error('Error fetching book details:', error);
      throw new Error('Không thể tải thông tin sách');
    }
  }

  private processBookDetails(data: any): BookDetail {
    return {
      key: data.key || '',
      title: data.title || 'Không rõ tiêu đề',
      authors: data.authors?.map((author: any) => ({
        name: author.name || 'Không rõ tác giả',
        key: author.key || ''
      })) || [],
      description: this.extractDescription(data.description),
      subjects: data.subjects || [],
      first_publish_year: data.first_publish_year,
      covers: data.covers || []
    };
  }

  private extractDescription(description?: string | { value: string }): string {
    if (!description) return 'Không có mô tả';
    
    if (typeof description === 'string') {
      return description;
    }
    
    return description.value || 'Không có mô tả';
  }

  async searchBooks(query?: string, limit: number = 20) {
    try {
      const url = `${this.baseUrl}/search.json`;
      const response = await axios.get(url, {
        params: {
          q: query,
          limit: limit,
          has_fulltext: true
        }
      });

      return response.data;
    } catch (error) {
      console.error('Error searching books:', error);
      throw new Error('Không thể tìm kiếm sách');
    }
  }
}

export default new OpenLibraryService();