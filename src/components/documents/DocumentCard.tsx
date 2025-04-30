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

  // Map file types to colors
  const getFileTypeColor = (fileType: string) => {
    const colorMap: Record<string, string> = {
      pdf: 'bg-red-100 text-red-800',
      docx: 'bg-blue-100 text-blue-800',
      xlsx: 'bg-green-100 text-green-800',
    };
    return colorMap[fileType] || 'bg-gray-100 text-gray-800';
  };

  const fileTypeClass = getFileTypeColor(document.fileType);

  return (
    <Card hover className="h-full flex flex-col">
      <div className="flex items-center mb-4">
        <div className={`p-2 rounded ${fileTypeClass}`}>
          <FiFile size={24} />
        </div>
        <div className="ml-3">
          <h3 className="text-lg font-medium text-gray-900">{document.title}</h3>
          <p className="text-sm text-gray-500">
            Uploaded by {document.uploadedBy} on {formatDate(document.createdAt)}
          </p>
        </div>
      </div>
      
      <div className="text-sm text-gray-600 mb-4 overflow-hidden" style={{ maxHeight: '4.5rem', display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical' }}>
        {document.content}
      </div>
      
      <div className="mt-auto">
        <div className="flex justify-between items-center text-xs text-gray-500 mb-3">
          <span className={`px-2 py-1 rounded ${fileTypeClass}`}>
            {document.fileType.toUpperCase()}
          </span>
          <span>{formatFileSize(document.fileSize)}</span>
        </div>
        
        <div className="flex space-x-2">
          <Button 
            size="sm" 
            variant="primary" 
            className="flex-1 flex items-center justify-center"
            onClick={() => onView(document.id)}
          >
            View
          </Button>
          
          {isEditable && (
            <>
              <Button 
                size="sm" 
                variant="secondary" 
                className="flex-1 flex items-center justify-center"
                onClick={() => onEdit(document.id)}
              >
                <FiEdit2 className="mr-1" /> Edit
              </Button>
              
              <Button 
                size="sm" 
                variant="danger" 
                className="flex items-center justify-center"
                onClick={() => onDelete(document.id)}
              >
                <FiTrash2 />
              </Button>
            </>
          )}
        </div>
      </div>
    </Card>
  );
};

export default DocumentCard; 