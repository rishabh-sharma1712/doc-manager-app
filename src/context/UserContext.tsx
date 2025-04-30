'use client';

import React, { createContext, useContext, useState } from 'react';
import { User, Role, ApiResponse } from '@/types';
import { mockGetUsers, mockUpdateUserRole } from '@/lib/mocks/mock-api';

interface UserContextType {
  users: User[];
  isLoading: boolean;
  error: string | null;
  getUsers: () => Promise<void>;
  updateUserRole: (userId: string, role: Role) => Promise<boolean>;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({ children }: { children: React.ReactNode }) {
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getUsers = async (): Promise<void> => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await mockGetUsers();
      
      if (response.success && response.data) {
        setUsers(response.data);
      } else {
        setError(response.message || 'Failed to fetch users');
      }
    } catch (err) {
      setError('An error occurred while fetching users');
    } finally {
      setIsLoading(false);
    }
  };

  const updateUserRole = async (userId: string, role: Role): Promise<boolean> => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await mockUpdateUserRole(userId, role);
      
      if (response.success && response.data) {
        setUsers(prevUsers => 
          prevUsers.map(user => user.id === userId ? { ...user, role } : user)
        );
        return true;
      } else {
        setError(response.message || 'Failed to update user role');
        return false;
      }
    } catch (err) {
      setError('An error occurred while updating user role');
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const value = {
    users,
    isLoading,
    error,
    getUsers,
    updateUserRole,
  };

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
}

export function useUsers() {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUsers must be used within a UserProvider');
  }
  return context;
} 