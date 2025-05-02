import React from 'react';
import { FiFile, FiEdit2, FiTrash2, FiDownload } from 'react-icons/fi';
import Card from '../ui/Card';
import Button from '../ui/Button';
import { Document } from '@/types';
import { useAuth } from '@/context/AuthContext';

interface DocumentCardProps {
  document: Document;
  onView: (id: string) => void;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
}

const DocumentCard: React.FC<DocumentCardProps> = ({
  document,
  onView,
  onEdit,
  onDelete,
}) => {
  const { user } = useAuth();
  const isEditable = user?.role === 'admin' || user?.role === 'editor';
  
  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} bytes`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };

  // Map file types to colors with explicit dark mode support
  const getFileTypeColor = (fileType: string) => {
    const colorMap: Record<string, string> = {
      pdf: 'border border-red-500 text-red-500',
      docx: 'border border-blue-500 text-blue-500',
      xlsx: 'border border-green-500 text-green-500',
    };
    return colorMap[fileType] || 'border border-gray-500 text-gray-500';
  };

  const fileTypeClass = getFileTypeColor(document.fileType);

  // Custom card styles for dark mode compatibility
  const cardStyle = {
    backgroundColor: 'var(--card-bg)',
    color: 'var(--card-text)',
    border: '1px solid var(--border-color)',
  };

  // Text styles
  const titleStyle = {
    color: 'var(--primary-text)',
    fontWeight: 'bold',
  };

  const metaStyle = {
    color: 'var(--secondary-text)',
  };

  const contentStyle = {
    color: 'var(--secondary-text)',
  };

  return (
    <div className="h-full flex flex-col rounded-lg shadow overflow-hidden" style={cardStyle}>
      <div className="flex items-center mb-4 p-4">
        <div className={`p-2 rounded ${fileTypeClass}`}>
          <FiFile size={24} />
        </div>
        <div className="ml-3">
          <h3 className="text-lg font-medium" style={titleStyle}>{document.title}</h3>
          <p className="text-sm" style={metaStyle}>
            Uploaded by {document.uploadedBy} on {formatDate(document.createdAt)}
          </p>
        </div>
      </div>
      
      <div className="text-sm mb-4 px-4 overflow-hidden" style={{ maxHeight: '4.5rem', display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', ...contentStyle }}>
        {document.content}
      </div>
      
      <div className="mt-auto p-4 border-t border-gray-200" style={{ borderColor: 'var(--border-color)' }}>
        <div className="flex justify-between items-center text-xs mb-3" style={metaStyle}>
          <span className={`px-2 py-1 rounded ${fileTypeClass}`}>
            {document.fileType.toUpperCase()}
          </span>
          <span>{formatFileSize(document.fileSize)}</span>
        </div>
        
        <div className="flex space-x-2">
          <Button 
            size="sm" 
            variant="primary" 
            className="flex-1 flex items-center justify-center view-btn"
            onClick={() => onView(document.id)}
          >
            View
          </Button>
          
          {isEditable && (
            <>
              <Button 
                size="sm" 
                variant="secondary" 
                className="flex-1 flex items-center justify-center edit-btn"
                onClick={() => onEdit(document.id)}
                data-testid={`edit-document-${document.id}`}
              >
                <FiEdit2 className="mr-1" /> Edit
              </Button>
              
              <Button 
                size="sm" 
                variant="danger" 
                className="flex items-center justify-center delete-btn"
                onClick={() => onDelete(document.id)}
              >
                <FiTrash2 />
              </Button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default DocumentCard; 