import { User, Task, AuthResponse } from './types';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

const DEBUG = true;

const handleResponse = async (response: Response) => {
  if (DEBUG) console.log('🔵 API Response:', response.status, response.url);

  if (response.status === 401) {
    if (DEBUG) console.error('🔴 401 Unauthorized');
    if (typeof window !== 'undefined') {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    throw new Error('Unauthorized');
  }

  if (!response.ok) {
    let errorMessage = 'An error occurred';
    try {
      const error = await response.json();
      errorMessage = error.detail || JSON.stringify(error);
      if (DEBUG) console.error('🔴 Error response:', error);
    } catch (e) {
      errorMessage = `HTTP ${response.status}: ${response.statusText}`;
      if (DEBUG) console.error('🔴 Error parsing failed:', e);
    }
    throw new Error(errorMessage);
  }

  return response.json();
};

const getToken = (): string | null => {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('token');
  }
  return null;
};

const getHeaders = (): HeadersInit => {
  const token = getToken();
  return {
    'Content-Type': 'application/json',
    ...(token && { 'Authorization': `Bearer ${token}` }),
  };
};

export const authAPI = {
  signup: async (name: string, email: string, password: string): Promise<AuthResponse> => {
    const url = `${API_BASE_URL}/api/auth/signup`;
    if (DEBUG) console.log('🔵 Sending signup request to:', url);
    if (DEBUG) console.log('🔵 Request data:', { name, email, password: '***' });

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password }),
      });

      if (DEBUG) console.log('🔵 Response status:', response.status, response.statusText);
      return await handleResponse(response);
    } catch (error: any) {
      if (DEBUG) console.error('🔴 Signup fetch error:', error);
      if (error instanceof TypeError && error.message.includes('fetch')) {
        throw new Error('Network error: Could not connect to the server. Make sure backend is running on port 8000.');
      }
      throw error;
    }
  },

  login: async (email: string, password: string): Promise<AuthResponse> => {
    const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    return await handleResponse(response);
  },

  getCurrentUser: async (): Promise<User> => {
    const response = await fetch(`${API_BASE_URL}/api/auth/me`, {
      headers: getHeaders(),
    });
    return handleResponse(response);
  },

  getMe: async (): Promise<User> => {
    const response = await fetch(`${API_BASE_URL}/api/auth/me`, {
      headers: getHeaders(),
    });
    return handleResponse(response);
  },
};

export const tasksAPI = {
  getAll: async (userId: string, filters?: { completed?: boolean, priority?: string, category?: string, search?: string }): Promise<Task[]> => {
    const queryParams = new URLSearchParams();
    if (filters) {
      if (filters.completed !== undefined) queryParams.append('completed', String(filters.completed));
      if (filters.priority) queryParams.append('priority', filters.priority);
      if (filters.category) queryParams.append('category', filters.category);
      if (filters.search) queryParams.append('search', filters.search);
    }

    const queryString = queryParams.toString();
    const url = `${API_BASE_URL}/api/${userId}/tasks${queryString ? '?' + queryString : ''}`;

    const response = await fetch(url, {
      headers: getHeaders(),
    });

    const data = await handleResponse(response);

    if (!Array.isArray(data)) {
      return [];
    }

    return data;
  },

  create: async (userId: string, title: string, description?: string, priority?: string, category?: string, dueDate?: string): Promise<Task> => {
    console.log('🔵 Creating task:', { userId, title, description, priority, category, dueDate });

    const response = await fetch(`${API_BASE_URL}/api/${userId}/tasks`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({
        title: title.trim(),
        description: (description || "").trim(),
        priority: priority || 'medium',
        category: category || '',
        due_date: dueDate || ''
      }),
    });

    const data = await handleResponse(response);
    console.log('✅ Task created:', data);
    return data;
  },

  update: async (userId: string, taskId: number, title: string, description?: string, priority?: string, category?: string, dueDate?: string): Promise<Task> => {
    console.log('🔵 Updating task:', { userId, taskId, title, description, priority, category, dueDate });

    const response = await fetch(`${API_BASE_URL}/api/${userId}/tasks/${taskId}`, {
      method: 'PUT',
      headers: getHeaders(),
      body: JSON.stringify({
        title: title.trim(),
        description: (description || "").trim(),
        priority: priority || 'medium',
        category: category || '',
        due_date: dueDate || ''
      }),
    });

    const data = await handleResponse(response);
    console.log('✅ Task updated:', data);
    return data;
  },

  delete: async (userId: string, taskId: number): Promise<void> => {
    console.log('🔵 Deleting task:', { userId, taskId });

    const response = await fetch(`${API_BASE_URL}/api/${userId}/tasks/${taskId}`, {
      method: 'DELETE',
      headers: getHeaders(),
    });

    if (!response.ok) {
      throw new Error('Failed to delete task');
    }

    console.log('✅ Task deleted');
  },

  toggleComplete: async (userId: string, taskId: number): Promise<Task> => {
    console.log('🔵 Toggling task completion:', { userId, taskId });

    const response = await fetch(`${API_BASE_URL}/api/${userId}/tasks/${taskId}/complete`, {
      method: 'PATCH',
      headers: getHeaders(),
    });

    const data = await handleResponse(response);
    console.log('✅ Task toggled:', data);
    return data;
  },

  sortTasks: async (userId: string): Promise<Task[]> => {
    console.log('🔵 Sorting tasks for user:', userId);

    const response = await fetch(`${API_BASE_URL}/api/${userId}/tasks/sort`, {
      method: 'POST',
      headers: getHeaders(),
    });

    const data = await handleResponse(response);
    
    // Ensure we return an array
    if (!Array.isArray(data)) {
      console.error('API returned non-array data for sort:', data);
      return [];
    }
    
    console.log('✅ Tasks sorted:', data.length);
    return data;
  },
};

export const analyticsAPI = {
  getDashboard: async (userId: string): Promise<any> => {
    console.log('🔵 Fetching analytics for user:', userId);

    const response = await fetch(`${API_BASE_URL}/api/${userId}/analytics/dashboard`, {
      headers: getHeaders(),
    });

    const data = await handleResponse(response);
    console.log('✅ Analytics fetched:', data);
    return data;
  },
};