'use client';

import React, { createContext, useContext, useState } from 'react';
import { Document, ApiResponse } from '@/types';
import { 
  mockCreateDocument, 
  mockDeleteDocument, 
  mockGetDocument, 
  mockGetDocuments, 
  mockUpdateDocument 
} from '@/lib/mocks/mock-api';
import { useAuth } from './AuthContext';

interface DocumentContextType {
  documents: Document[];
  isLoading: boolean;
  error: string | null;
  getDocuments: () => Promise<void>;
  getDocument: (id: string) => Promise<Document | null>;
  createDocument: (data: Partial<Document>) => Promise<Document | null>;
  updateDocument: (id: string, data: Partial<Document>) => Promise<Document | null>;
  deleteDocument: (id: string) => Promise<boolean>;
}

const DocumentContext = createContext<DocumentContextType | undefined>(undefined);

export function DocumentProvider({ children }: { children: React.ReactNode }) {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  const getDocuments = async (): Promise<void> => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await mockGetDocuments();
      
      if (response.success && response.data) {
        setDocuments(response.data);
      } else {
        setError(response.message || 'Failed to fetch documents');
      }
    } catch (err) {
      setError('An error occurred while fetching documents');
    } finally {
      setIsLoading(false);
    }
  };

  const getDocument = async (id: string): Promise<Document | null> => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await mockGetDocument(id);
      
      if (response.success && response.data) {
        return response.data;
      } else {
        setError(response.message || 'Failed to fetch document');
        return null;
      }
    } catch (err) {
      setError('An error occurred while fetching the document');
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  const createDocument = async (data: Partial<Document>): Promise<Document | null> => {
    if (!user) {
      setError('You must be logged in to create a document');
      return null;
    }
    
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await mockCreateDocument(data, user.id, user.username);
      
      if (response.success && response.data) {
        setDocuments(prevDocs => [...prevDocs, response.data!]);
        return response.data;
      } else {
        setError(response.message || 'Failed to create document');
        return null;
      }
    } catch (err) {
      setError('An error occurred while creating the document');
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  const updateDocument = async (id: string, data: Partial<Document>): Promise<Document | null> => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await mockUpdateDocument(id, data);
      
      if (response.success && response.data) {
        setDocuments(prevDocs => 
          prevDocs.map(doc => doc.id === id ? { ...doc, ...response.data } : doc)
        );
        return response.data;
      } else {
        setError(response.message || 'Failed to update document');
        return null;
      }
    } catch (err) {
      setError('An error occurred while updating the document');
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  const deleteDocument = async (id: string): Promise<boolean> => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await mockDeleteDocument(id);
      
      if (response.success) {
        setDocuments(prevDocs => prevDocs.filter(doc => doc.id !== id));
        return true;
      } else {
        setError(response.message || 'Failed to delete document');
        return false;
      }
    } catch (err) {
      setError('An error occurred while deleting the document');
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const value = {
    documents,
    isLoading,
    error,
    getDocuments,
    getDocument,
    createDocument,
    updateDocument,
    deleteDocument,
  };

  return <DocumentContext.Provider value={value}>{children}</DocumentContext.Provider>;
}

export function useDocuments() {
  const context = useContext(DocumentContext);
  if (context === undefined) {
    throw new Error('useDocuments must be used within a DocumentProvider');
  }
  return context;
} 