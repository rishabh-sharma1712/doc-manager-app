import { AuthResponse, Document, ApiResponse, User, Role } from '@/types';
import { documents, users } from './mock-data';
import { v4 as uuidv4 } from 'uuid';

// Helper to simulate API delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Auth APIs
export const mockLogin = async (email: string, password: string): Promise<AuthResponse> => {
  await delay(800); // Simulate network delay
  
  const user = users.find(u => u.email === email);
  
  if (!user || password !== 'password') { // In a real app, passwords would be hashed
    return {
      success: false,
      message: 'Invalid email or password',
      user: {} as User,
      token: '',
    };
  }

  return {
    success: true,
    message: 'Login successful',
    user,
    token: `mock-jwt-token-${user.id}`,
  };
};

export const mockRegister = async (username: string, email: string, password: string): Promise<AuthResponse> => {
  await delay(1000);
  
  if (users.some(u => u.email === email)) {
    return {
      success: false,
      message: 'User with this email already exists',
      user: {} as User,
      token: '',
    };
  }

  const newUser: User = {
    id: uuidv4(),
    username,
    email,
    role: 'viewer', // Default role for new users
    createdAt: new Date().toISOString(),
  };

  users.push(newUser);

  return {
    success: true,
    message: 'Registration successful',
    user: newUser,
    token: `mock-jwt-token-${newUser.id}`,
  };
};

export const mockLogout = async (): Promise<ApiResponse<null>> => {
  await delay(500);
  return {
    success: true,
    message: 'Logged out successfully',
  };
};

// User Management APIs
export const mockGetUsers = async (): Promise<ApiResponse<User[]>> => {
  await delay(800);
  return {
    success: true,
    data: users,
  };
};

export const mockUpdateUserRole = async (userId: string, role: Role): Promise<ApiResponse<User>> => {
  await delay(1000);
  
  const userIndex = users.findIndex(u => u.id === userId);
  
  if (userIndex === -1) {
    return {
      success: false,
      message: 'User not found',
    };
  }

  users[userIndex] = {
    ...users[userIndex],
    role,
  };

  return {
    success: true,
    message: 'User role updated successfully',
    data: users[userIndex],
  };
};

// Document Management APIs
export const mockGetDocuments = async (): Promise<ApiResponse<Document[]>> => {
  await delay(800);
  return {
    success: true,
    data: documents,
  };
};

export const mockGetDocument = async (id: string): Promise<ApiResponse<Document>> => {
  await delay(800);
  
  const document = documents.find(d => d.id === id);
  
  if (!document) {
    return {
      success: false,
      message: 'Document not found',
    };
  }

  return {
    success: true,
    data: document,
  };
};

export const mockCreateDocument = async (data: Partial<Document>, userId: string, username: string): Promise<ApiResponse<Document>> => {
  await delay(1000);

  const newDocument: Document = {
    id: uuidv4(),
    title: data.title || 'Untitled Document',
    content: data.content || '',
    userId,
    uploadedBy: username,
    fileType: data.fileType || 'txt',
    fileSize: data.fileSize || 0,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  documents.push(newDocument);

  return {
    success: true,
    message: 'Document created successfully',
    data: newDocument,
  };
};

export const mockUpdateDocument = async (id: string, data: Partial<Document>): Promise<ApiResponse<Document>> => {
  await delay(1000);
  
  const documentIndex = documents.findIndex(d => d.id === id);
  
  if (documentIndex === -1) {
    return {
      success: false,
      message: 'Document not found',
    };
  }

  documents[documentIndex] = {
    ...documents[documentIndex],
    ...data,
    updatedAt: new Date().toISOString(),
  };

  return {
    success: true,
    message: 'Document updated successfully',
    data: documents[documentIndex],
  };
};

export const mockDeleteDocument = async (id: string): Promise<ApiResponse<null>> => {
  await delay(800);
  
  const documentIndex = documents.findIndex(d => d.id === id);
  
  if (documentIndex === -1) {
    return {
      success: false,
      message: 'Document not found',
    };
  }

  documents.splice(documentIndex, 1);

  return {
    success: true,
    message: 'Document deleted successfully',
  };
}; 