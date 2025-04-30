'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { FiFile, FiUser, FiUpload, FiClock } from 'react-icons/fi';
import Layout from '@/components/layout/Layout';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import { useAuth } from '@/context/AuthContext';
import { useDocuments } from '@/context/DocumentContext';

export default function DashboardPage() {
  const router = useRouter();
  const { user, isAuthenticated, isLoading: authLoading } = useAuth();
  const { documents, getDocuments, isLoading: documentsLoading } = useDocuments();

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push('/auth/login');
    } else if (isAuthenticated) {
      getDocuments();
    }
  }, [authLoading, isAuthenticated, router, getDocuments]);

  const stats = [
    {
      name: 'Total Documents',
      value: documents.length,
      icon: <FiFile className="h-6 w-6 text-blue-500" />,
      color: 'border-blue-500',
    },
    {
      name: 'Your Uploads',
      value: user ? documents.filter(doc => doc.userId === user.id).length : 0,
      icon: <FiUpload className="h-6 w-6 text-green-500" />,
      color: 'border-green-500',
    },
    {
      name: 'Recent Activity',
      value: documents
        .filter(doc => {
          const updatedDate = new Date(doc.updatedAt);
          const weekAgo = new Date();
          weekAgo.setDate(weekAgo.getDate() - 7);
          return updatedDate >= weekAgo;
        })
        .length,
      icon: <FiClock className="h-6 w-6 text-purple-500" />,
      color: 'border-purple-500',
    },
  ];

  const recentDocuments = [...documents]
    .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
    .slice(0, 5);

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
      <div className="bg-white shadow rounded-lg px-5 py-4 mb-6">
        <h1 className="text-2xl font-semibold text-gray-800">Dashboard</h1>
        <p className="text-gray-600">
          Welcome back, {user?.username}! Here's an overview of your document management system.
        </p>
      </div>

      <div className="grid gap-6 mb-8 md:grid-cols-3">
        {stats.map((stat) => (
          <Card key={stat.name} className={`border-l-4 ${stat.color}`}>
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-gray-100 mr-4">{stat.icon}</div>
              <div>
                <p className="mb-2 text-sm font-medium text-gray-600">{stat.name}</p>
                <p className="text-2xl font-semibold text-gray-700">{stat.value}</p>
              </div>
            </div>
          </Card>
        ))}
      </div>

      <div className="grid gap-6 mb-8 md:grid-cols-2">
        <div>
          <Card title="Recent Documents">
            {documentsLoading ? (
              <div className="text-center py-4">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500 mx-auto"></div>
                <p className="mt-2 text-gray-600">Loading documents...</p>
              </div>
            ) : recentDocuments.length === 0 ? (
              <div className="text-center py-4">
                <p className="text-gray-600">No documents found</p>
              </div>
            ) : (
              <div className="divide-y">
                {recentDocuments.map((doc) => (
                  <div key={doc.id} className="py-3 flex justify-between items-center">
                    <div>
                      <h4 className="font-medium text-gray-900">{doc.title}</h4>
                      <p className="text-sm text-gray-500">
                        {new Date(doc.updatedAt).toLocaleDateString()} by {doc.uploadedBy}
                      </p>
                    </div>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => router.push(`/documents/${doc.id}`)}
                    >
                      View
                    </Button>
                  </div>
                ))}
              </div>
            )}
            <div className="pt-3 text-right border-t mt-4">
              <Button
                size="sm"
                variant="ghost"
                onClick={() => router.push('/documents')}
                className="text-blue-600 hover:text-blue-800"
              >
                View all documents
              </Button>
            </div>
          </Card>
        </div>

        <div>
          <Card title="Quick Actions">
            <div className="space-y-4 py-3">
              <Button
                fullWidth
                onClick={() => router.push('/documents/new')}
                className="flex items-center justify-center"
              >
                <FiUpload className="mr-2" />
                Upload New Document
              </Button>
              
              {user?.role === 'admin' && (
                <Button
                  variant="secondary"
                  fullWidth
                  onClick={() => router.push('/users')}
                  className="flex items-center justify-center"
                >
                  <FiUser className="mr-2" />
                  Manage Users
                </Button>
              )}
            </div>
          </Card>
          
          <Card title="Your Role" className="mt-6">
            <div className="py-3">
              <div className="flex items-center mb-4">
                <div className="p-2 rounded-full bg-blue-100 text-blue-800 mr-3">
                  <FiUser className="h-5 w-5" />
                </div>
                <div>
                  <p className="font-medium text-gray-900">
                    {user?.role ? user.role.charAt(0).toUpperCase() + user.role.slice(1) : 'Unknown'}
                  </p>
                </div>
              </div>
              
              <div className="text-sm text-gray-600">
                {user?.role === 'admin' && 'You have full access to all features, including user management.'}
                {user?.role === 'editor' && 'You can view, create, and edit documents, but cannot manage users.'}
                {user?.role === 'viewer' && 'You can only view documents, but cannot edit or create new ones.'}
              </div>
            </div>
          </Card>
        </div>
      </div>
    </Layout>
  );
} 