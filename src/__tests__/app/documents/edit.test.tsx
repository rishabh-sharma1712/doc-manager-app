import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import EditDocumentPage from '@/app/documents/[id]/edit/page';

// Mock necessary dependencies
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: jest.fn(),
  }),
  useParams: () => ({
    id: '1',
  }),
}));

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

// Mock document
const mockDocument = {
  id: '1',
  title: 'Test Document',
  content: 'This is a test document content',
  userId: '1',
  uploadedBy: 'admin',
  fileType: 'pdf',
  fileSize: 1024 * 1024,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
};

// Mock context methods
const mockGetDocument = jest.fn();
const mockUpdateDocument = jest.fn();

jest.mock('@/context/DocumentContext', () => ({
  useDocuments: () => ({
    getDocument: mockGetDocument,
    updateDocument: mockUpdateDocument,
    isLoading: false,
  }),
}));

// Mock layout component
jest.mock('@/components/layout/Layout', () => {
  return {
    __esModule: true,
    default: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  };
});

describe('Edit Document Page', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockGetDocument.mockResolvedValue(mockDocument);
    mockUpdateDocument.mockResolvedValue(mockDocument);
  });

  test('loads and displays document information', async () => {
    render(<EditDocumentPage params={{ id: '1' }} />);

    // Wait for document to load
    await waitFor(() => {
      expect(mockGetDocument).toHaveBeenCalledWith('1');
      expect(screen.getByDisplayValue('Test Document')).toBeInTheDocument();
      expect(screen.getByText('This is a test document content')).toBeInTheDocument();
    });
  });

  test('updates document when form is submitted', async () => {
    render(<EditDocumentPage params={{ id: '1' }} />);

    // Wait for document to load
    await waitFor(() => {
      expect(screen.getByDisplayValue('Test Document')).toBeInTheDocument();
    });

    // Change form values
    const titleInput = screen.getByDisplayValue('Test Document');
    fireEvent.change(titleInput, { target: { value: 'Updated Document Title' } });

    const contentTextarea = screen.getByText('This is a test document content');
    fireEvent.change(contentTextarea, { target: { value: 'Updated document content' } });

    // Submit form
    const saveButton = screen.getByText('Save Changes');
    fireEvent.click(saveButton);

    // Check if updateDocument was called with correct data
    await waitFor(() => {
      expect(mockUpdateDocument).toHaveBeenCalledWith('1', {
        title: 'Updated Document Title',
        content: 'Updated document content',
      });
    });
  });
}); 