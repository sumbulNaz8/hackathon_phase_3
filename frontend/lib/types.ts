// lib/types.ts

export interface User {
  id: string;
  name: string;
  email: string;
  createdAt?: Date;
}

export interface Task {
  id: number;
  user_id: string;
  title: string;
  description?: string;
  completed: boolean;
  created_at: string;
  updated_at: string;
  priority?: 'low' | 'medium' | 'high';
  category?: string;
  due_date?: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

export interface AuthResponse {
  access_token: string;
  token_type: string;
  user: User;
}