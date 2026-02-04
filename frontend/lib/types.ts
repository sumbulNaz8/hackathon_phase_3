// lib/types.ts

export interface User {
  id: number;
  name: string;
  email: string;
  createdAt: Date;
}

export interface Task {
  id: number;
  title: string;
  description?: string;
  completed: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}