import React, { useState } from 'react';
import { searchBooks } from '../services/bookService';
import { Form, Button, ListGroup, Spinner } from 'react-bootstrap';
import { toast } from 'react-toastify';

interface Book {
  key: string;
  title: string;
  author_name?: string[];
  first_publish_year?: number;
}

const BookSearch: React.FC = () => {
  const [query, setQuery] = useState<string>('');
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  const handleSearch = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    try {
      const data = await searchBooks(query);
      setBooks(data.docs);
      if (data.docs.length === 0) {
        toast.info('No books found.');
      }
    } catch (error) {
      toast.error('Failed to fetch books.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <Form onSubmit={handleSearch}>
        <Form.Group controlId="searchQuery">
          <Form.Label>Search Books</Form.Label>
          <Form.Control
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Enter book title or author"
            required
          />
        </Form.Group>
        <Button variant="primary" type="submit" disabled={loading}>
          {loading ? <Spinner animation="border" size="sm" /> : 'Search'}
        </Button>
      </Form>
      <ListGroup className="mt-4">
        {books.map((book) => (
          <ListGroup.Item key={book.key}>
            <h5>{book.title}</h5>
            <p>Author: {book.author_name?.join(', ') || 'Unknown'}</p>
            <p>First Published: {book.first_publish_year || 'N/A'}</p>
          </ListGroup.Item>
        ))}
      </ListGroup>
    </div>
  );
};

export default BookSearch;
