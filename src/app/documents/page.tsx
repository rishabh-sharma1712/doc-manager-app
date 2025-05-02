'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { FiPlus, FiSearch } from 'react-icons/fi';
import Layout from '@/components/layout/Layout';
import DocumentCard from '@/components/documents/DocumentCard';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import { useAuth } from '@/context/AuthContext';
import { useDocuments } from '@/context/DocumentContext';
import { Document } from '@/types';

export default function DocumentsPage() {
  const router = useRouter();
  const { user, isAuthenticated, isLoading: authLoading } = useAuth();
  const { documents, getDocuments, isLoading: documentsLoading, deleteDocument } = useDocuments();
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredDocuments, setFilteredDocuments] = useState<Document[]>([]);

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push('/auth/login');
    } else if (isAuthenticated) {
      getDocuments();
    }
  }, [authLoading, isAuthenticated, router, getDocuments]);

  useEffect(() => {
    if (documents) {
      setFilteredDocuments(
        documents.filter((doc) =>
          doc.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          doc.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
          doc.uploadedBy.toLowerCase().includes(searchQuery.toLowerCase())
        )
      );
    }
  }, [documents, searchQuery]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const handleViewDocument = (id: string) => {
    router.push(`/documents/${id}`);
  };

  const handleEditDocument = (id: string) => {
    if (!id) return;
    router.push(`/documents/${id}/edit`);
  };

  const handleDeleteDocument = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this document? This action cannot be undone.')) {
      const success = await deleteDocument(id);
      if (success) {
        // Document was deleted successfully
      }
    }
  };

  const canCreateDocument = user?.role === 'admin' || user?.role === 'editor';

  if (authLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <Layout>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-semibold text-gray-800">Documents</h1>
          <p className="text-gray-600">Manage and view all your documents</p>
        </div>
        {canCreateDocument && (
          <Button
            onClick={() => router.push('/documents/new')}
            className="flex items-center"
          >
            <FiPlus className="mr-2" />
            New Document
          </Button>
        )}
      </div>

      <div className="mb-6">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <FiSearch className="h-5 w-5 text-gray-400" />
          </div>
          <Input
            type="text"
            placeholder="Search documents by title, content, or user..."
            value={searchQuery}
            onChange={handleSearchChange}
            className="pl-10"
            fullWidth
          />
        </div>
      </div>

      {documentsLoading ? (
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading documents...</p>
        </div>
      ) : filteredDocuments.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-lg shadow">
          <div className="mx-auto h-24 w-24 text-gray-400">
            <svg
              className="h-full w-full"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1}
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
          </div>
          <h3 className="mt-2 text-lg font-medium text-gray-900">No documents found</h3>
          <p className="mt-1 text-gray-500">
            {searchQuery
              ? `No documents matching "${searchQuery}"`
              : 'Start by creating a new document'}
          </p>
          {canCreateDocument && (
            <div className="mt-6">
              <Button
                onClick={() => router.push('/documents/new')}
                className="flex items-center mx-auto"
              >
                <FiPlus className="mr-2" />
                New Document
              </Button>
            </div>
          )}
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredDocuments.map((document) => (
            <DocumentCard
              key={document.id}
              document={document}
              onView={handleViewDocument}
              onEdit={handleEditDocument}
              onDelete={handleDeleteDocument}
            />
          ))}
        </div>
      )}
    </Layout>
  );
} 