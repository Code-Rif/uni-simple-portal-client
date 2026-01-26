// User roles
export type UserRole = "student" | "teacher" | "librarian" | "admin";

// User interface
export interface User {
  _id: string;
  email: string;
  role: UserRole;
  name: string;
  studentId?: string;
  department?: string;
  createdAt: string;
  updatedAt: string;
}

// Auth state
export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  setUser: (user: User) => void;
}

// API Response
export interface ApiResponse<T = unknown> {
  success: boolean;
  message: string;
  data?: T;
}

// API Error
export interface ApiError {
  message: string;
  errors?: Record<string, string[]>;
}
