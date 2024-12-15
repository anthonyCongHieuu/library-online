export interface BookDetail {
    key: string;
    title: string;
    authors?: { name: string; key: string }[];
    description?: string | { value: string };
    subjects?: string[];
    first_publish_year?: number;
    covers?: number[];
  }