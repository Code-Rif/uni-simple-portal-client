// Library Module Types

export interface Book {
  _id: string;
  title: string;
  author: string;
  isbn: string;
  category: string;
  availableCopies: number;
  totalCopies: number;
  shelfLocation: string;
  status: 'available' | 'issued' | 'out-of-stock';
  description?: string;
  publishYear?: number;
  coverImage?: string;
  createdAt: string;
  updatedAt: string;
}

export interface LibraryCard {
  _id: string;
  studentId: string;
  studentName: string;
  department: string;
  issueDate: string;
  expiryDate: string;
  cardNumber: string;
  qrCode: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface BookIssueRecord {
  _id: string;
  bookId: string;
  studentId: string;
  issueDate: string;
  dueDate: string;
  returnDate?: string;
  status: 'issued' | 'returned' | 'overdue';
  fine?: number;
}

export interface BookFormData {
  title: string;
  author: string;
  isbn: string;
  category: string;
  availableCopies: number;
  totalCopies: number;
  shelfLocation: string;
  description?: string;
  publishYear?: number;
  coverImage?: string;
}

export interface BookFilters {
  search?: string;
  category?: string;
  status?: string;
  author?: string;
}

export interface PaginatedBooksResponse {
  books: Book[];
  total: number;
  page: number;
  totalPages: number;
}

export const BOOK_CATEGORIES = [
  'Computer Science',
  'Engineering',
  'Mathematics',
  'Physics',
  'Chemistry',
  'Biology',
  'Literature',
  'History',
  'Economics',
  'Business',
  'Psychology',
  'Philosophy',
  'Other',
] as const;

export type BookCategory = typeof BOOK_CATEGORIES[number];
