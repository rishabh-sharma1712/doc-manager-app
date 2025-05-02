import React from 'react';
import { render, screen, waitFor, act } from '@testing-library/react';
import { DocumentProvider, useDocuments } from '@/context/DocumentContext';
import { mockGetDocuments } from '@/lib/mocks/mock-api';

// Mock the document API
jest.mock('@/lib/mocks/mock-api', () => ({
  mockGetDocuments: jest.fn(),
  mockGetDocument: jest.fn(),
  mockCreateDocument: jest.fn(),
  mockUpdateDocument: jest.fn(),
  mockDeleteDocument: jest.fn(),
}));

// Mock AuthContext
jest.mock('@/context/AuthContext', () => ({
  useAuth: () => ({
    user: { 
      id: '1', 
      username: 'admin', 
      email: 'admin@example.com', 
      role: 'admin',
      createdAt: new Date().toISOString() 
    },
    isAuthenticated: true,
    isLoading: false,
  }),
}));

// Create a test component that uses the DocumentContext
const TestComponent = () => {
  const { documents, isLoading, error, getDocuments } = useDocuments();
  
  return (
    <div>
      <div data-testid="loading">{isLoading.toString()}</div>
      <div data-testid="error">{error || 'no error'}</div>
      <button onClick={getDocuments}>Load Documents</button>
      <ul>
        {documents.map(doc => (
          <li key={doc.id}>{doc.title}</li>
        ))}
      </ul>
    </div>
  );
};

describe('DocumentContext', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });
  
  test('provides document loading state', async () => {
    mockGetDocuments.mockResolvedValue({
      success: true,
      data: [
        {
          id: '1',
          title: 'Test Document',
          content: 'Test content',
          userId: '1',
          uploadedBy: 'admin',
          fileType: 'pdf',
          fileSize: 1024,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        }
      ]
    });
    
    render(
      <DocumentProvider>
        <TestComponent />
      </DocumentProvider>
    );
    
    // Initially loading should be false
    expect(screen.getByTestId('loading').textContent).toBe('false');
    
    // Click to load documents
    act(() => {
      screen.getByText('Load Documents').click();
    });
    
    // Check loading state changes
    await waitFor(() => {
      expect(mockGetDocuments).toHaveBeenCalledTimes(1);
      expect(screen.getByText('Test Document')).toBeInTheDocument();
    });
  });
  
  test('handles API errors', async () => {
    // Mock API to return an error
    mockGetDocuments.mockResolvedValue({
      success: false,
      message: 'Failed to fetch documents',
    });
    
    render(
      <DocumentProvider>
        <TestComponent />
      </DocumentProvider>
    );
    
    // Initially there should be no error
    expect(screen.getByTestId('error').textContent).toBe('no error');
    
    // Click to load documents
    act(() => {
      screen.getByText('Load Documents').click();
    });
    
    // Check error state
    await waitFor(() => {
      expect(screen.getByTestId('error').textContent).toBe('Failed to fetch documents');
    });
  });
}); 