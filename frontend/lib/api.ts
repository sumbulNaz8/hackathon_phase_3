// lib/api.ts

import { User, Task } from './types';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

// Helper to get token from localStorage
const getToken = () => localStorage.getItem('token');

// Helper to create headers with authorization
const getAuthHeaders = () => ({
  'Content-Type': 'application/json',
  'Authorization': `Bearer ${getToken()}`
});

// Auth API
export const authAPI = {
  signup: async (name: string, email: string, password: string): Promise<{access_token: string}> => {
    try {
      const response = await fetch(`${API_URL}/api/auth/signup`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password })
      });
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Signup failed');
      }
      
      return await response.json();
    } catch (error) {
      console.error('Signup error:', error);
      throw error;
    }
  },

  login: async (email: string, password: string): Promise<{access_token: string}> => {
    try {
      const response = await fetch(`${API_URL}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Login failed');
      }
      
      return await response.json();
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  },

  getMe: async (): Promise<User> => {
    try {
      const response = await fetch(`${API_URL}/api/auth/me`, {
        headers: getAuthHeaders()
      });
      
      if (!response.ok) {
        if (response.status === 401) {
          localStorage.removeItem('token');
          window.location.href = '/login';
        }
        throw new Error('Failed to get user info');
      }
      
      return await response.json();
    } catch (error) {
      console.error('Get user error:', error);
      throw error;
    }
  }
};

// Tasks API
export const tasksAPI = {
  getAll: async (userId: number): Promise<Task[]> => {
    try {
      const response = await fetch(`${API_URL}/api/${userId}/tasks`, {
        headers: getAuthHeaders()
      });
      
      if (!response.ok) {
        if (response.status === 401) {
          localStorage.removeItem('token');
          window.location.href = '/login';
        }
        throw new Error('Failed to get tasks');
      }
      
      return await response.json();
    } catch (error) {
      console.error('Get tasks error:', error);
      throw error;
    }
  },

  create: async (userId: number, title: string, description?: string): Promise<Task> => {
    try {
      const response = await fetch(`${API_URL}/api/${userId}/tasks`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify({ title, description })
      });
      
      if (!response.ok) {
        if (response.status === 401) {
          localStorage.removeItem('token');
          window.location.href = '/login';
        }
        throw new Error('Failed to create task');
      }
      
      return await response.json();
    } catch (error) {
      console.error('Create task error:', error);
      throw error;
    }
  },

  update: async (userId: number, taskId: number, title: string, description?: string): Promise<Task> => {
    try {
      const response = await fetch(`${API_URL}/api/${userId}/tasks/${taskId}`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify({ title, description })
      });
      
      if (!response.ok) {
        if (response.status === 401) {
          localStorage.removeItem('token');
          window.location.href = '/login';
        }
        throw new Error('Failed to update task');
      }
      
      return await response.json();
    } catch (error) {
      console.error('Update task error:', error);
      throw error;
    }
  },

  delete: async (userId: number, taskId: number): Promise<void> => {
    try {
      const response = await fetch(`${API_URL}/api/${userId}/tasks/${taskId}`, {
        method: 'DELETE',
        headers: getAuthHeaders()
      });
      
      if (!response.ok) {
        if (response.status === 401) {
          localStorage.removeItem('token');
          window.location.href = '/login';
        }
        throw new Error('Failed to delete task');
      }
    } catch (error) {
      console.error('Delete task error:', error);
      throw error;
    }
  },

  toggleComplete: async (userId: number, taskId: number): Promise<Task> => {
    try {
      const response = await fetch(`${API_URL}/api/${userId}/tasks/${taskId}/complete`, {
        method: 'PATCH',
        headers: getAuthHeaders()
      });
      
      if (!response.ok) {
        if (response.status === 401) {
          localStorage.removeItem('token');
          window.location.href = '/login';
        }
        throw new Error('Failed to toggle task completion');
      }
      
      return await response.json();
    } catch (error) {
      console.error('Toggle task completion error:', error);
      throw error;
    }
  }
};