export interface BookDetail {
    key: string;
    title: string;
    description?: string | { value: string };
    authors?: Array<{
      name: string;
      key: string;
    }>;
    subjects?: string[];
    first_publish_date?: string;
    number_of_pages?: number;
    covers?: number[];
    isbn_10?: string[];
    isbn_13?: string[];
  }
  
  export interface AuthorDetail {
    name: string;
    bio?: string;
    personal_name?: string;
  }