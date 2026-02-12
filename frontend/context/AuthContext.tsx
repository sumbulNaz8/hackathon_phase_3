// context/AuthContext.tsx

'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User } from '@/lib/types';
import { authAPI } from '@/lib/api';

// Helper to decode JWT and get expiry
const getTokenExpiry = (token: string): Date | null => {
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
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
    // Check if user is already logged in
    const storedToken = localStorage.getItem('token');
    console.log('🔵 AuthContext: Page load - checking localStorage...');

    if (storedToken) {
      console.log('🔵 Token found in localStorage');

      // Check token expiry
      const expiry = getTokenExpiry(storedToken);
      if (expiry) {
        setTokenExpiry(expiry);
        const now = new Date();
        const hoursUntilExpiry = (expiry.getTime() - now.getTime()) / (1000 * 60 * 60);

        if (hoursUntilExpiry < 1) {
          console.warn('⚠️ Token expiring in less than 1 hour!');
        } else if (hoursUntilExpiry < 24) {
          console.log('ℹ️ Token expiring in', Math.round(hoursUntilExpiry), 'hours');
        }
      }

      // Set token immediately so isAuthenticated becomes true
      setToken(storedToken);

      // Try to fetch user info
      console.log('🔵 Calling /api/auth/me to validate token...');
      authAPI.getMe()
        .then(fetchedUser => {
          console.log('✅ Token validated, user:', fetchedUser.email);
          setUser(fetchedUser);
          setLoading(false);
        })
        .catch((error) => {
          // If token is invalid, remove it
          console.error('🔴 Token validation failed:', error);

          // Check if it's a network error vs auth error
          const errorMessage = error instanceof Error ? error.message : String(error);

          if (errorMessage.includes('Token') || errorMessage.includes('401') || errorMessage.includes('Unauthorized')) {
            console.warn('⚠️ Token is invalid or expired, clearing...');
            localStorage.removeItem('token');
            setToken(null);
            setTokenExpiry(null);
            setUser(null);
          } else {
            console.warn('⚠️ Network error, keeping token for retry');
          }

          setLoading(false);
        });
    } else {
      console.log('🔵 No token in localStorage');
      setTokenExpiry(null);
      setLoading(false);
    }
  }, []);

  const login = async (email: string, password: string) => {
    console.log('🔵 Login attempt for:', email);
    try {
      const response = await authAPI.login(email, password);
      const accessToken = response.access_token;
      console.log('✅ Login successful!');

      // Calculate and store token expiry
      const expiry = getTokenExpiry(accessToken);
      if (expiry) {
        setTokenExpiry(expiry);
        const daysUntilExpiry = Math.round((expiry.getTime() - Date.now()) / (1000 * 60 * 60 * 24));
        console.log('✅ Token valid for', daysUntilExpiry, 'days');
      }

      localStorage.setItem('token', accessToken);
      console.log('✅ Token saved to localStorage');
      setToken(accessToken);

      const userData = await authAPI.getMe();
      console.log('✅ User authenticated:', userData.email, userData.name);
      setUser(userData);
    } catch (error) {
      console.error('🔴 Login failed:', error);
      throw error;
    }
  };

  const signup = async (name: string, email: string, password: string) => {
    console.log('🔵 Signup attempt for:', email, name);
    try {
      const response = await authAPI.signup(name, email, password);
      const accessToken = response.access_token;
      console.log('✅ Signup successful!');

      // Calculate and store token expiry
      const expiry = getTokenExpiry(accessToken);
      if (expiry) {
        setTokenExpiry(expiry);
        const daysUntilExpiry = Math.round((expiry.getTime() - Date.now()) / (1000 * 60 * 60 * 24));
        console.log('✅ Token valid for', daysUntilExpiry, 'days');
      }

      localStorage.setItem('token', accessToken);
      console.log('✅ Token saved to localStorage');
      setToken(accessToken);

      const userData = await authAPI.getMe();
      console.log('✅ User authenticated:', userData.email, userData.name);
      setUser(userData);
    } catch (error) {
      console.error('🔴 Signup failed:', error);
      throw error;
    }
  };

  const logout = () => {
    console.log('🔵 Logging out user...');
    localStorage.removeItem('token');
    setToken(null);
    setTokenExpiry(null);
    setUser(null);
    console.log('✅ Logged out successfully');
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