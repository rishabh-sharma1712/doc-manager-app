'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, AuthResponse } from '@/types';
import { mockLogin, mockLogout, mockRegister } from '@/lib/mocks/mock-api';

interface AuthContextType {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<AuthResponse>;
  register: (username: string, email: string, password: string) => Promise<AuthResponse>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check for saved auth in localStorage on initial load
    const savedUser = localStorage.getItem('user');
    const savedToken = localStorage.getItem('token');
    
    if (savedUser && savedToken) {
      setUser(JSON.parse(savedUser));
      setToken(savedToken);
    }
    
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string): Promise<AuthResponse> => {
    setIsLoading(true);
    try {
      const response = await mockLogin(email, password);
      
      if (response.success) {
        setUser(response.user);
        setToken(response.token);
        localStorage.setItem('user', JSON.stringify(response.user));
        localStorage.setItem('token', response.token);
      }
      
      return response;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (username: string, email: string, password: string): Promise<AuthResponse> => {
    setIsLoading(true);
    try {
      const response = await mockRegister(username, email, password);
      
      if (response.success) {
        setUser(response.user);
        setToken(response.token);
        localStorage.setItem('user', JSON.stringify(response.user));
        localStorage.setItem('token', response.token);
      }
      
      return response;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async (): Promise<void> => {
    setIsLoading(true);
    try {
      await mockLogout();
      setUser(null);
      setToken(null);
      localStorage.removeItem('user');
      localStorage.removeItem('token');
    } finally {
      setIsLoading(false);
    }
  };

  const value = {
    user,
    token,
    isAuthenticated: !!user,
    isLoading,
    login,
    register,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
} 