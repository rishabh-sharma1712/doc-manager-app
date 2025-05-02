import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import DocumentCard from '@/components/documents/DocumentCard';

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

// Create mock document data
const mockDocument = {
  id: '1',
  title: 'Test Document',
  content: 'This is a test document content',
  userId: '1',
  uploadedBy: 'admin',
  fileType: 'pdf',
  fileSize: 1024 * 1024, // 1MB
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
};

// Mock handlers
const onView = jest.fn();
const onEdit = jest.fn();
const onDelete = jest.fn();

describe('DocumentCard Component', () => {
  beforeEach(() => {
    // Clear mocks between tests
    onView.mockClear();
    onEdit.mockClear();
    onDelete.mockClear();
  });

  test('renders document information correctly', () => {
    render(
      <DocumentCard
        document={mockDocument}
        onView={onView}
        onEdit={onEdit}
        onDelete={onDelete}
      />
    );

    // Check if document title is rendered
    expect(screen.getByText('Test Document')).toBeInTheDocument();
    
    // Check if document content is rendered
    expect(screen.getByText('This is a test document content')).toBeInTheDocument();
    
    // Check if file type is displayed
    expect(screen.getByText('PDF')).toBeInTheDocument();
    
    // Check if "View" button is present
    expect(screen.getByText('View')).toBeInTheDocument();
  });

  test('calls onView when View button is clicked', () => {
    render(
      <DocumentCard
        document={mockDocument}
        onView={onView}
        onEdit={onEdit}
        onDelete={onDelete}
      />
    );

    // Find the View button and click it
    const viewButton = screen.getByText('View');
    fireEvent.click(viewButton);

    // Expect onView to be called with the document id
    expect(onView).toHaveBeenCalledTimes(1);
    expect(onView).toHaveBeenCalledWith('1');
  });

  test('calls onEdit when Edit button is clicked', () => {
    render(
      <DocumentCard
        document={mockDocument}
        onView={onView}
        onEdit={onEdit}
        onDelete={onDelete}
      />
    );

    // Find the Edit button using the test ID and click it
    const editButton = screen.getByTestId('edit-document-1');
    fireEvent.click(editButton);

    // Expect onEdit to be called with the document id
    expect(onEdit).toHaveBeenCalledTimes(1);
    expect(onEdit).toHaveBeenCalledWith('1');
  });
}); 