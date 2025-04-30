'use client';

import React, { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { FiArrowLeft, FiUpload, FiFile, FiX } from 'react-icons/fi';
import Layout from '@/components/layout/Layout';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import { useAuth } from '@/context/AuthContext';
import { useDocuments } from '@/context/DocumentContext';

const documentSchema = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters').max(100, 'Title must be less than 100 characters'),
  content: z.string().min(10, 'Content must be at least 10 characters'),
  fileType: z.string().min(1, 'File type is required'),
});

type DocumentFormData = z.infer<typeof documentSchema>;

export default function NewDocumentPage() {
  const router = useRouter();
  const { user, isAuthenticated, isLoading: authLoading } = useAuth();
  const { createDocument, isLoading: documentsLoading } = useDocuments();
  const [error, setError] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm<DocumentFormData>({
    resolver: zodResolver(documentSchema),
    defaultValues: {
      fileType: 'pdf',
      content: '',
    },
  });

  // Monitor content field
  const content = watch('content');

  useEffect(() => {
    // Check authentication
    if (!authLoading && !isAuthenticated) {
      router.push('/auth/login');
      return;
    }

    // Check if user has permission to create documents
    if (user && user.role === 'viewer') {
      router.push('/documents');
    }
  }, [authLoading, isAuthenticated, user, router]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      
      // Extract file extension
      const fileExtension = file.name.split('.').pop()?.toLowerCase() || '';
      let fileType = 'txt'; // default
      
      // Set file type based on extension
      if (['pdf'].includes(fileExtension)) fileType = 'pdf';
      else if (['doc', 'docx'].includes(fileExtension)) fileType = 'docx';
      else if (['xls', 'xlsx'].includes(fileExtension)) fileType = 'xlsx';
      
      setValue('fileType', fileType);
      
      // Read file content if it's a text file
      if (['txt', 'md', 'js', 'ts', 'html', 'css', 'json'].includes(fileExtension)) {
        const reader = new FileReader();
        reader.onload = (event) => {
          if (event.target?.result) {
            setValue('content', event.target.result as string);
          }
        };
        reader.readAsText(file);
      } else {
        // For non-text files, set a placeholder
        setValue('content', `File content will be processed: ${file.name} (${formatFileSize(file.size)})`);
      }
    }
  };

  const triggerFileInput = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const removeSelectedFile = () => {
    setSelectedFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} bytes`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  const onSubmit = async (data: DocumentFormData) => {
    setError(null);
    
    try {
      // Calculate file size
      const fileSize = selectedFile ? selectedFile.size : Math.floor(data.content.length * 0.5 * 1024);
      
      const newDocument = await createDocument({
        title: data.title,
        content: data.content,
        fileType: data.fileType,
        fileSize,
      });
      
      if (newDocument) {
        router.push(`/documents/${newDocument.id}`);
      } else {
        setError('Failed to create document. Please try again.');
      }
    } catch (err) {
      setError('An unexpected error occurred. Please try again.');
    }
  };

  if (authLoading) {
    return (
      <Layout>
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </Layout>
    );
  }

  // If user isn't admin or editor, they shouldn't be able to access this page
  if (user?.role === 'viewer') {
    return null; // This will be caught by the useEffect and redirected
  }

  return (
    <Layout>
      <div className="mb-6 flex items-center">
        <Button variant="ghost" onClick={() => router.push('/documents')} className="mr-4">
          <FiArrowLeft className="mr-2" />
          Back
        </Button>
        <h1 className="text-2xl font-semibold text-gray-800">Create New Document</h1>
      </div>

      {error && (
        <div className="mb-6 bg-red-50 border border-red-200 rounded-md p-4">
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
        </div>
      )}

      <div className="bg-white shadow rounded-lg overflow-hidden">
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="p-6">
            <div className="mb-6">
              <Input
                label="Document Title"
                fullWidth
                error={errors.title?.message}
                {...register('title')}
              />
            </div>
            
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-800 mb-1">
                File Type
              </label>
              <select
                className="px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 w-full text-gray-800"
                {...register('fileType')}
              >
                <option value="pdf">PDF</option>
                <option value="docx">DOCX (Word)</option>
                <option value="xlsx">XLSX (Excel)</option>
                <option value="txt">TXT (Text)</option>
              </select>
              {errors.fileType?.message && (
                <p className="mt-1 text-sm text-red-600 font-medium">{errors.fileType.message}</p>
              )}
            </div>
            
            {/* File Upload */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-800 mb-1">
                Upload Document (Optional)
              </label>
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                className="hidden"
              />
              
              {selectedFile ? (
                <div className="flex items-center p-3 border border-gray-300 rounded-md">
                  <FiFile className="text-blue-500 mr-2" />
                  <span className="flex-1 text-sm text-gray-800 truncate">
                    {selectedFile.name} ({formatFileSize(selectedFile.size)})
                  </span>
                  <button
                    type="button"
                    onClick={removeSelectedFile}
                    className="text-gray-500 hover:text-red-500"
                  >
                    <FiX />
                  </button>
                </div>
              ) : (
                <div 
                  onClick={triggerFileInput}
                  className="border-2 border-dashed border-gray-300 rounded-md p-6 text-center cursor-pointer hover:border-blue-500 transition-colors"
                >
                  <FiUpload className="mx-auto h-12 w-12 text-gray-400" />
                  <p className="mt-2 text-sm text-gray-700 font-medium">
                    Click to upload or drag and drop a file
                  </p>
                </div>
              )}
            </div>
            
            {/* Document Content */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-800 mb-1">
                Document Content
              </label>
              <textarea
                rows={12}
                className="w-full border border-gray-300 rounded-md shadow-sm p-3 focus:ring-blue-500 focus:border-blue-500 text-gray-800"
                placeholder="Enter document content..."
                {...register('content')}
              />
              {errors.content?.message && (
                <p className="mt-1 text-sm text-red-600 font-medium">{errors.content.message}</p>
              )}
              <p className="mt-1 text-xs text-gray-700">
                {content.length} characters
              </p>
            </div>
            
            <div className="flex justify-end">
              <Button
                type="button"
                variant="secondary"
                onClick={() => router.push('/documents')}
                className="mr-4"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                isLoading={documentsLoading}
                className="flex items-center"
              >
                <FiUpload className="mr-2" />
                Create Document
              </Button>
            </div>
          </div>
        </form>
      </div>
    </Layout>
  );
} 