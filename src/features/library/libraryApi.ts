import api from "@/lib/axios";
import {
  Book,
  BookFormData,
  BookFilters,
  PaginatedBooksResponse,
  LibraryCard,
} from "./libraryTypes";

// ============ BOOK APIs ============

// Get all books with filters
export const getAllBooks = async (
  filters?: BookFilters,
  page: number = 1,
  limit: number = 10
): Promise<PaginatedBooksResponse> => {
  const params = new URLSearchParams();
  if (filters?.search) params.append("search", filters.search);
  if (filters?.category) params.append("category", filters.category);
  if (filters?.status) params.append("status", filters.status);
  if (filters?.author) params.append("author", filters.author);
  params.append("page", page.toString());
  params.append("limit", limit.toString());

  const response = await api.get(`/library/books?${params.toString()}`);
  return response.data;
};

// Get single book by ID
export const getBookById = async (bookId: string): Promise<Book> => {
  const response = await api.get(`/library/books/${bookId}`);
  return response.data;
};

// Create new book (Admin/Librarian only)
export const createBook = async (bookData: BookFormData): Promise<Book> => {
  const response = await api.post("/library/books", bookData);
  return response.data;
};

// Update book (Admin/Librarian only)
export const updateBook = async (
  bookId: string,
  bookData: Partial<BookFormData>
): Promise<Book> => {
  const response = await api.put(`/library/books/${bookId}`, bookData);
  return response.data;
};

// Delete book (Admin/Librarian only)
export const deleteBook = async (bookId: string): Promise<void> => {
  await api.delete(`/library/books/${bookId}`);
};

// Search books
export const searchBooks = async (query: string): Promise<Book[]> => {
  const response = await api.get(`/library/books/search?q=${query}`);
  return response.data;
};

// Get books by category
export const getBooksByCategory = async (category: string): Promise<Book[]> => {
  const response = await api.get(`/library/books/category/${category}`);
  return response.data;
};

// ============ LIBRARY CARD APIs ============

// Get student's library card
export const getMyLibraryCard = async (): Promise<LibraryCard> => {
  const response = await api.get("/library/card/my-card");
  return response.data;
};

// Generate library card for student (Admin/Librarian only)
export const generateLibraryCard = async (
  studentId: string
): Promise<LibraryCard> => {
  const response = await api.post("/library/card/generate", { studentId });
  return response.data;
};

// Download library card as PDF
export const downloadLibraryCardPDF = async (): Promise<Blob> => {
  const response = await api.get("/library/card/download-pdf", {
    responseType: "blob",
  });
  return response.data;
};

// Get all library cards (Admin/Librarian only)
export const getAllLibraryCards = async (): Promise<LibraryCard[]> => {
  const response = await api.get("/library/card/all");
  return response.data;
};

// Deactivate library card (Admin/Librarian only)
export const deactivateLibraryCard = async (
  cardId: string
): Promise<LibraryCard> => {
  const response = await api.put(`/library/card/${cardId}/deactivate`);
  return response.data;
};

// ============ BOOK ISSUE APIs (Optional for future use) ============

// Issue book to student
export const issueBook = async (
  bookId: string,
  studentId: string
): Promise<unknown> => {
  const response = await api.post("/library/issue", { bookId, studentId });
  return response.data;
};

// Return book
export const returnBook = async (issueId: string): Promise<unknown> => {
  const response = await api.put(`/library/issue/${issueId}/return`);
  return response.data;
};

// Get student's issued books
export const getMyIssuedBooks = async (): Promise<unknown[]> => {
  const response = await api.get("/library/issue/my-books");
  return response.data;
};
