export type Role = 'admin' | 'editor' | 'viewer';

export interface User {
  id: string;
  username: string;
  email: string;
  role: Role;
  createdAt: string;
}

export interface Document {
  id: string;
  title: string;
  content: string;
  userId: string;
  uploadedBy: string;
  fileType: string;
  fileSize: number;
  createdAt: string;
  updatedAt: string;
}

export interface AuthResponse {
  user: User;
  token: string;
  success: boolean;
  message?: string;
}

export interface ApiResponse<T> {
  data?: T;
  success: boolean;
  message?: string;
} 