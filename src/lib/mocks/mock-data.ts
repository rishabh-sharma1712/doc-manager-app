import { Document, User } from '@/types';
import { v4 as uuidv4 } from 'uuid';

// Mock Users
export const users: User[] = [
  {
    id: '1',
    username: 'admin',
    email: 'admin@example.com',
    role: 'admin',
    createdAt: new Date().toISOString(),
  },
  {
    id: '2',
    username: 'editor',
    email: 'editor@example.com',
    role: 'editor',
    createdAt: new Date().toISOString(),
  },
  {
    id: '3',
    username: 'viewer',
    email: 'viewer@example.com',
    role: 'viewer',
    createdAt: new Date().toISOString(),
  },
];

// Mock Documents
export const documents: Document[] = [
  {
    id: '1',
    title: 'Company Policy Document',
    content: 'This document outlines company policies and procedures.',
    userId: '1',
    uploadedBy: 'admin',
    fileType: 'pdf',
    fileSize: 1024 * 1024 * 2, // 2MB
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: '2',
    title: 'Project Proposal',
    content: 'Project proposal for the new client project.',
    userId: '2',
    uploadedBy: 'editor',
    fileType: 'docx',
    fileSize: 1024 * 1024 * 1.5, // 1.5MB
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: '3',
    title: 'Financial Report',
    content: 'Annual financial report for the previous fiscal year.',
    userId: '1',
    uploadedBy: 'admin',
    fileType: 'xlsx',
    fileSize: 1024 * 1024 * 3, // 3MB
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
]; 