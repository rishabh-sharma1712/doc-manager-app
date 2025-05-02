'use client';

import React, { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { FiArrowLeft, FiSave } from 'react-icons/fi';
import Layout from '@/components/layout/Layout';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import { useAuth } from '@/context/AuthContext';
import { useDocuments } from '@/context/DocumentContext';
import { Document } from '@/types';

interface EditDocumentPageProps {
  params: {
    id: string;
  };
}

export default function EditDocumentPage({ params: serverParams }: EditDocumentPageProps) {
  const router = useRouter();
  const params = useParams();
  const id = params?.id as string || serverParams?.id;
  
  const { user, isAuthenticated, isLoading: authLoading } = useAuth();
  const { getDocument, updateDocument, isLoading: documentsLoading } = useDocuments();
  const [document, setDocument] = useState<Document | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    content: '',
  });
  const [error, setError] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    // Check authentication
    if (!authLoading && !isAuthenticated) {
      router.push('/auth/login');
      return;
    }

    // Check if user is allowed to edit documents
    if (!authLoading && isAuthenticated && user && user.role !== 'admin' && user.role !== 'editor') {
      router.push('/documents');
      return;
    }

    const fetchDocument = async () => {
      if (!id) return;
      
      try {
        const doc = await getDocument(id);
        if (doc) {
          setDocument(doc);
          setFormData({
            title: doc.title,
            content: doc.content,
          });
        } else {
          setError('Document not found or you do not have permission to edit it.');
        }
      } catch (err) {
        console.error("Error fetching document:", err);
        setError('Failed to load document. Please try again.');
      }
    };

    if (isAuthenticated && id) {
      fetchDocument();
    }
  }, [authLoading, isAuthenticated, id, router, getDocument, user]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!document) return;
    
    setIsSaving(true);
    
    try {
      const updatedDoc = await updateDocument(document.id, formData);
      
      if (updatedDoc) {
        router.push(`/documents/${document.id}`);
      } else {
        setError('Failed to update document.');
      }
    } catch (err) {
      console.error("Error updating document:", err);
      setError('An error occurred while updating the document.');
    } finally {
      setIsSaving(false);
    }
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

  return (
    <Layout>
      <div className="mb-6 flex items-center">
        <Button 
          variant="ghost" 
          onClick={() => router.push(`/documents/${document.id}`)} 
          className="mr-4"
        >
          <FiArrowLeft className="mr-2" />
          Back
        </Button>
        <h1 className="text-2xl font-semibold text-gray-800">Edit Document</h1>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-md p-4 mb-6">
          <p className="text-sm text-red-800">{error}</p>
        </div>
      )}

      <div className="bg-white shadow rounded-lg overflow-hidden">
        <form onSubmit={handleSubmit}>
          <div className="px-6 py-4 border-b border-gray-200">
            <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
              Document Title
            </label>
            <Input
              id="title"
              name="title"
              type="text"
              value={formData.title}
              onChange={handleInputChange}
              required
              fullWidth
              className="mb-4"
            />
          </div>
          
          <div className="px-6 py-4">
            <label htmlFor="content" className="block text-sm font-medium text-gray-700 mb-1">
              Content
            </label>
            <textarea
              id="content"
              name="content"
              value={formData.content}
              onChange={handleInputChange}
              rows={12}
              className="w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>
          
          <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex justify-end">
            <Button
              type="button"
              variant="secondary"
              className="mr-2"
              onClick={() => router.push(`/documents/${document.id}`)}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              className="flex items-center"
              disabled={isSaving}
            >
              {isSaving ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white mr-2"></div>
                  Saving...
                </>
              ) : (
                <>
                  <FiSave className="mr-2" />
                  Save Changes
                </>
              )}
            </Button>
          </div>
        </form>
      </div>
    </Layout>
  );
} 