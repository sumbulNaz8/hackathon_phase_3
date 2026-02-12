import { User, Task, AuthResponse } from './types';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

console.log('🔵 API Base URL:', API_BASE_URL);

const handleResponse = async (response: Response) => {
  console.log('🔵 API Response:', response.status, response.url);

  if (response.status === 401) {
    console.error('🔴 401 Unauthorized - removing token and redirecting');
    if (typeof window !== 'undefined') {
      const currentToken = localStorage.getItem('token');
      console.error('🔴 Token that was removed:', currentToken?.substring(0, 20) + '...');
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
    } catch {
      errorMessage = `HTTP ${response.status}: ${response.statusText}`;
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
    console.log('🔵 Signup request:', { name, email });

    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/signup`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password }),
      });

      console.log('🔵 Signup response status:', response.status);
      console.log('🔵 Signup response headers:', [...response.headers.entries()]);
      
      const data = await handleResponse(response);
      console.log('✅ Signup success:', data);
      return data;
    } catch (error) {
      console.error('🔴 Signup fetch error:', error);
      if (error instanceof TypeError && error.message.includes('fetch')) {
        throw new Error('Network error: Could not connect to the server. Please check if the backend is running on http://localhost:8001');
      }
      throw error;
    }
  },

  login: async (email: string, password: string): Promise<AuthResponse> => {
    console.log('🔵 Login request:', { email });
    
    const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    
    const data = await handleResponse(response);
    console.log('✅ Login success:', data);
    return data;
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
    console.log('🔵 Fetching tasks for user:', userId, 'with filters:', filters);

    // Build query parameters from filters
    const queryParams = new URLSearchParams();
    if (filters) {
      if (filters.completed !== undefined) queryParams.append('completed', String(filters.completed));
      if (filters.priority) queryParams.append('priority', filters.priority);
      if (filters.category) queryParams.append('category', filters.category);
      if (filters.search) queryParams.append('search', filters.search);
    }

    const queryString = queryParams.toString();
    const url = `${API_BASE_URL}/api/${userId}/tasks${queryString ? '?' + queryString : ''}`;

    console.log('Fetching from URL:', url);
    console.log('Using headers:', getHeaders());

    const response = await fetch(url, {
      headers: getHeaders(),
    });

    console.log('Response status:', response.status);
    console.log('Response headers:', [...response.headers.entries()]);

    const data = await handleResponse(response);
    
    // Ensure we return an array
    if (!Array.isArray(data)) {
      console.error('API returned non-array data:', data);
      return [];
    }
    
    console.log('✅ Tasks fetched:', data.length);
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