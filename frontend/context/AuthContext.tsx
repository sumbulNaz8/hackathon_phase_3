// context/AuthContext.tsx

'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User } from '@/lib/types';
import { authAPI } from '@/lib/api';

// Helper to decode JWT and get expiry
const getTokenExpiry = (token: string): Date | null => {
  try {
    if (!token || typeof token !== 'string') {
      return null;
    }
    const parts = token.split('.');
    if (parts.length !== 3) {
      console.warn('Invalid token format: not a valid JWT');
      return null;
    }
    const payload = JSON.parse(atob(parts[1]));
    if (payload.exp) {
      return new Date(payload.exp * 1000);
    }
  } catch (error) {
    console.error('Failed to decode token:', error);
    return null;
  }
  return null;
};

interface AuthContextType {
  user: User | null;
  token: string | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
  tokenExpiry: Date | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [tokenExpiry, setTokenExpiry] = useState<Date | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedToken = localStorage.getItem('token');

    if (storedToken) {
      const expiry = getTokenExpiry(storedToken);
      if (expiry) {
        setTokenExpiry(expiry);
      }

      setToken(storedToken);

      authAPI.getMe()
        .then(fetchedUser => {
          setUser(fetchedUser);
          setLoading(false);
        })
        .catch(() => {
          localStorage.removeItem('token');
          setToken(null);
          setTokenExpiry(null);
          setUser(null);
          setLoading(false);
        });
    } else {
      setTokenExpiry(null);
      setLoading(false);
    }
  }, []);

  const login = async (email: string, password: string) => {
    try {
      const response = await authAPI.login(email, password);
      const accessToken = response.access_token;
      const userData = response.user;

      const expiry = getTokenExpiry(accessToken);
      if (expiry) {
        setTokenExpiry(expiry);
      }

      localStorage.setItem('token', accessToken);
      setToken(accessToken);
      setUser(userData);
    } catch (error) {
      throw error;
    }
  };

  const signup = async (name: string, email: string, password: string) => {
    try {
      const response = await authAPI.signup(name, email, password);
      const accessToken = response.access_token;
      const userData = response.user;

      const expiry = getTokenExpiry(accessToken);
      if (expiry) {
        setTokenExpiry(expiry);
      }

      localStorage.setItem('token', accessToken);
      setToken(accessToken);
      setUser(userData);
    } catch (error) {
      throw error;
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setToken(null);
    setTokenExpiry(null);
    setUser(null);
  };

  const isAuthenticated = !!token;

  const value = {
    user,
    token,
    tokenExpiry,
    loading,
    login,
    signup,
    logout,
    isAuthenticated
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};