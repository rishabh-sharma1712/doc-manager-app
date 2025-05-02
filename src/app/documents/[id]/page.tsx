'use client';

import React, { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { FiArrowLeft, FiEdit2, FiTrash2, FiDownload, FiClock, FiUser } from 'react-icons/fi';
import Layout from '@/components/layout/Layout';
import Button from '@/components/ui/Button';
import { useAuth } from '@/context/AuthContext';
import { useDocuments } from '@/context/DocumentContext';
import { Document } from '@/types';

interface DocumentPageProps {
  params: {
    id: string;
  };
}

export default function DocumentPage({ params: serverParams }: DocumentPageProps) {
  const router = useRouter();
  const params = useParams();
  const id = params?.id as string || serverParams?.id;
  
  const { user, isAuthenticated, isLoading: authLoading } = useAuth();
  const { getDocument, isLoading: documentsLoading, deleteDocument } = useDocuments();
  const [document, setDocument] = useState<Document | null>(null);
  const [error, setError] = useState<string | null>(null);

  const isEditable = user?.role === 'admin' || user?.role === 'editor';

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push('/auth/login');
      return;
    }

    const fetchDocument = async () => {
      if (!id) return;
      
      const doc = await getDocument(id);
      if (doc) {
        setDocument(doc);
      } else {
        setError('Document not found or you do not have permission to view it.');
      }
    };

    if (isAuthenticated && id) {
      fetchDocument();
    }
  }, [authLoading, isAuthenticated, id, router, getDocument]);

  const handleEdit = () => {
    if (!id || !document) return;
    router.push(`/documents/${id}/edit`);
  };

  const handleDelete = async () => {
    if (!document) return;

    if (window.confirm('Are you sure you want to delete this document? This action cannot be undone.')) {
      const success = await deleteDocument(document.id);
      if (success) {
        router.push('/documents');
      }
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} bytes`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString();
  };

  if (authLoading || documentsLoading) {
    return (
      <Layout>
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading document...</p>
        </div>
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout>
        <div className="bg-red-50 border border-red-200 rounded-md p-4 mb-6">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg
                className="h-5 w-5 text-red-400"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800">{error}</h3>
            </div>
          </div>
          <div className="mt-4">
            <Button onClick={() => router.push('/documents')} className="flex items-center">
              <FiArrowLeft className="mr-2" />
              Back to Documents
            </Button>
          </div>
        </div>
      </Layout>
    );
  }

  if (!document) {
    return (
      <Layout>
        <div className="text-center py-12">
          <p className="text-gray-600">No document found</p>
          <div className="mt-4">
            <Button onClick={() => router.push('/documents')} className="flex items-center">
              <FiArrowLeft className="mr-2" />
              Back to Documents
            </Button>
          </div>
        </div>
      </Layout>
    );
  }

  // Get file type color
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
    <Layout>
      <div className="mb-6 flex items-center">
        <Button variant="ghost" onClick={() => router.push('/documents')} className="mr-4">
          <FiArrowLeft className="mr-2" />
          Back
        </Button>
        <h1 className="text-2xl font-semibold text-gray-800">{document.title}</h1>
      </div>

      <div className="bg-white shadow rounded-lg overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
          <div className="flex items-center">
            <span className={`px-3 py-1 rounded-full text-xs font-medium ${fileTypeClass}`}>
              {document.fileType.toUpperCase()}
            </span>
            <span className="ml-3 text-sm text-gray-500">
              {formatFileSize(document.fileSize)}
            </span>
          </div>
          
          <div className="flex space-x-2">
            {isEditable && (
              <>
                <Button
                  size="sm"
                  variant="secondary"
                  onClick={handleEdit}
                  className="flex items-center"
                >
                  <FiEdit2 className="mr-2" />
                  Edit
                </Button>
                <Button
                  size="sm"
                  variant="danger"
                  onClick={handleDelete}
                  className="flex items-center"
                >
                  <FiTrash2 className="mr-2" />
                  Delete
                </Button>
              </>
            )}
            <Button
              size="sm"
              variant="primary"
              className="flex items-center"
            >
              <FiDownload className="mr-2" />
              Download
            </Button>
          </div>
        </div>
        
        <div className="px-6 py-4">
          <div className="prose max-w-none">
            <pre className="whitespace-pre-wrap break-words text-gray-700">
              {document.content}
            </pre>
          </div>
        </div>
        
        <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
          <div className="flex flex-col sm:flex-row sm:justify-between">
            <div className="flex items-center mb-2 sm:mb-0">
              <FiUser className="h-4 w-4 text-gray-500 mr-1" />
              <span className="text-sm text-gray-600">
                Uploaded by <span className="font-medium">{document.uploadedBy}</span>
              </span>
            </div>
            <div className="flex items-center">
              <FiClock className="h-4 w-4 text-gray-500 mr-1" />
              <span className="text-sm text-gray-600">
                Last updated: {formatDate(document.updatedAt)}
              </span>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
} 