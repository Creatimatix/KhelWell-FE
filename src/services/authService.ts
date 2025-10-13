import axios from 'axios';
import { LoginData, RegisterData, User } from '../types';
import { BACKEND_API_URL } from '../utils/constant';
const API_URL = BACKEND_API_URL;

// Create axios instance
const api = axios.create({
  baseURL: API_URL,
  withCredentials: true,
  xsrfCookieName: "XSRF-TOKEN",
  xsrfHeaderName: "X-XSRF-TOKEN",
  headers: {
    'Content-Type': 'application/json',
  }
});

// Add token to requests if available
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle token expiration
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export interface AuthResponse {
  user: User;
  token: string;
}

export interface BackendResponse<T> {
  status: string;
  message: string;
  data: T;
  statusCode: number;
}

export const authService = {
  async login(email: string, password: string): Promise<AuthResponse> {
    const response = await api.post<BackendResponse<AuthResponse>>('/login', {
      email,
      password, 
    });
    // return response.data;

    const inner = response?.data?.data;

    // Ensure shape matches your AuthResponse interface
    const result: AuthResponse = {
      user: inner?.user,
      token: inner?.token,
    };

    return result;
  },

  async register(userData: RegisterData): Promise<AuthResponse> {
    // await api.get("http://localhost/creatimatix/inhouse/creatimatixApp/backend/sanctum/csrf-cookie");
    console.log('Registering user with data:', userData);
    const response = await api.post<AuthResponse>('/register', userData);
    return response.data;
  },

  async getProfile(): Promise<User> {
    const response = await api.get<User>('/profile');
    return response.data;
  },

  async updateProfile(userData: Partial<User>): Promise<AuthResponse> {
    const response = await api.put<AuthResponse>('/auth/profile', userData);
    return response.data;
  },

  async changePassword(currentPassword: string, newPassword: string): Promise<{ message: string }> {
    const response = await api.put<{ message: string }>('/auth/change-password', {
      currentPassword,
      newPassword,
    });
    return response.data;
  },
}; 