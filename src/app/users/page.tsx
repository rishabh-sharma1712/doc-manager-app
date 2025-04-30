'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { FiUser, FiSearch, FiEdit2 } from 'react-icons/fi';
import Layout from '@/components/layout/Layout';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import { useAuth } from '@/context/AuthContext';
import { useUsers } from '@/context/UserContext';
import { User, Role } from '@/types';

export default function UsersPage() {
  const router = useRouter();
  const { user, isAuthenticated, isLoading: authLoading } = useAuth();
  const { users, getUsers, updateUserRole, isLoading: usersLoading } = useUsers();
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [editingUserId, setEditingUserId] = useState<string | null>(null);
  const [selectedRole, setSelectedRole] = useState<Role>('viewer');

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push('/auth/login');
      return;
    }

    // Only admins can access this page
    if (user && user.role !== 'admin') {
      router.push('/dashboard');
      return;
    }

    if (isAuthenticated && user?.role === 'admin') {
      getUsers();
    }
  }, [authLoading, isAuthenticated, user, router, getUsers]);

  useEffect(() => {
    if (users) {
      setFilteredUsers(
        users.filter((u) =>
          u.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
          u.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
          u.role.toLowerCase().includes(searchQuery.toLowerCase())
        )
      );
    }
  }, [users, searchQuery]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const handleEditRole = (userId: string, currentRole: Role) => {
    setEditingUserId(userId);
    setSelectedRole(currentRole);
  };

  const handleRoleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedRole(e.target.value as Role);
  };

  const handleSaveRole = async (userId: string) => {
    if (!selectedRole) return;
    
    const success = await updateUserRole(userId, selectedRole);
    if (success) {
      setEditingUserId(null);
    }
  };

  const handleCancelEdit = () => {
    setEditingUserId(null);
  };

  const getRoleBadgeClass = (role: Role) => {
    switch (role) {
      case 'admin':
        return 'bg-purple-100 text-purple-800';
      case 'editor':
        return 'bg-blue-100 text-blue-800';
      case 'viewer':
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

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

  // Only admin should see this page
  if (user?.role !== 'admin') {
    return null; // Will be redirected by useEffect
  }

  return (
    <Layout>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-semibold text-gray-800">User Management</h1>
          <p className="text-gray-600">Manage user access and roles</p>
        </div>
      </div>

      <div className="mb-6">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <FiSearch className="h-5 w-5 text-gray-400" />
          </div>
          <Input
            type="text"
            placeholder="Search users by name, email, or role..."
            value={searchQuery}
            onChange={handleSearchChange}
            className="pl-10"
            fullWidth
          />
        </div>
      </div>

      {usersLoading ? (
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading users...</p>
        </div>
      ) : filteredUsers.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-lg shadow">
          <div className="mx-auto h-24 w-24 text-gray-400">
            <FiUser className="h-full w-full" />
          </div>
          <h3 className="mt-2 text-lg font-medium text-gray-900">No users found</h3>
          <p className="mt-1 text-gray-500">
            {searchQuery
              ? `No users matching "${searchQuery}"`
              : 'There are no users registered in the system'}
          </p>
        </div>
      ) : (
        <Card>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    User
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Email
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Role
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredUsers.map((u) => (
                  <tr key={u.id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10 bg-gray-100 rounded-full flex items-center justify-center">
                          <FiUser className="h-6 w-6 text-gray-500" />
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">{u.username}</div>
                          <div className="text-sm text-gray-500">Joined {new Date(u.createdAt).toLocaleDateString()}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{u.email}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {editingUserId === u.id ? (
                        <select
                          value={selectedRole}
                          onChange={handleRoleChange}
                          className="border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                        >
                          <option value="admin">Admin</option>
                          <option value="editor">Editor</option>
                          <option value="viewer">Viewer</option>
                        </select>
                      ) : (
                        <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getRoleBadgeClass(u.role)}`}>
                          {u.role.charAt(0).toUpperCase() + u.role.slice(1)}
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      {editingUserId === u.id ? (
                        <div className="flex justify-end space-x-2">
                          <Button
                            size="sm"
                            variant="primary"
                            onClick={() => handleSaveRole(u.id)}
                          >
                            Save
                          </Button>
                          <Button
                            size="sm"
                            variant="secondary"
                            onClick={handleCancelEdit}
                          >
                            Cancel
                          </Button>
                        </div>
                      ) : (
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleEditRole(u.id, u.role)}
                          className="flex items-center justify-center ml-auto"
                        >
                          <FiEdit2 className="mr-1" />
                          Edit Role
                        </Button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}
    </Layout>
  );
} 