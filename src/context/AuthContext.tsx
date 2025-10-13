import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { AuthContextType, User, RegisterData } from '../types';
import { authService } from '../services/authService';
import toast from 'react-hot-toast';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check for stored token on app load (standardized keys)
    const storedToken = localStorage.getItem('auth_token');
    const storedUser = localStorage.getItem('auth_user');

    if (storedToken && storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        setToken(storedToken);
        setUser(parsedUser);
      } catch (error) {
        console.error('Error parsing stored user data:', error);
        localStorage.removeItem('auth_token');
        localStorage.removeItem('auth_user');
      }
    }
    setLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    try {
      setLoading(true);
      const response = await authService.login(email, password);
      

      setUser(response.user);
      setToken(response.token);

      localStorage.setItem('auth_token', response.token);
      localStorage.setItem('auth_user', JSON.stringify(response.user));
      localStorage.setItem('new_user', 'no');
      // Login successful - no toast notification
    } catch (error: any) {
      // Login failed - no toast notification, just throw error
      // throw error;
       console.log('error:', error);
    } finally {
      console.log('Final loading state:', loading);
      setLoading(false);
    }
  };

  const register = async (userData: RegisterData) => {
    try {
      setLoading(true);
      const response = await authService.register(userData);
      console.log("Register Response:",response)
      setUser(response.user);
      setToken(response.token);

      // Use standardized keys for storage
      localStorage.setItem('auth_token', response.token);
      localStorage.setItem('auth_user', JSON.stringify(response.user));
      localStorage.setItem('new_user', 'yes');
          
      // Registration successful - no toast notification
    } catch (error: any) {
      // Registration failed - no toast notification, just throw error
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
  setUser(null);
  setToken(null);
  localStorage.removeItem('auth_token');
  localStorage.removeItem('auth_user');
    // Logout successful - no toast notification
  };

  const value: AuthContextType = {
    user,
    token,
    login,
    register,
    logout,
    loading,
    setUser,
    setToken,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}; 