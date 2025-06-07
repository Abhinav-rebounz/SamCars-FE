// src/contexts/AuthContext.tsx
import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import { login as loginService, register as registerService, logout as logoutService, isSessionExpired } from '../services/auth';

interface User {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  role: 'customer' | 'admin';
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isAdmin: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  register: (firstName: string, lastName: string, email: string, password: string) => Promise<boolean>;
  logout: () => void;
  setUser: React.Dispatch<React.SetStateAction<User | null>>;
}

interface AuthProviderProps {
  children: ReactNode;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkSession = () => {
      if (isSessionExpired()) {
        logout();
        return;
      }

      const storedUser = localStorage.getItem('user');
      const accessToken = localStorage.getItem('accessToken');

      if (accessToken && storedUser) {
        try {
          const parsedUser = JSON.parse(storedUser) as User;
          setUser(parsedUser);
        } catch {
          logout();
        }
      }
    };

    checkSession();
    setIsLoading(false);

    // Check session expiration every minute
    const interval = setInterval(checkSession, 60000);
    return () => clearInterval(interval);
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      const result = await loginService(email, password);
      if (result.success && result.user) {
        setUser(result.user as User);
        return true;
      }
      return false;
    } catch (error) {
      console.error('Login failed:', error);
      return false;
    }
  };

  const register = async (
    firstName: string,
    lastName: string,
    email: string,
    password: string
  ): Promise<boolean> => {
    try {
      const result = await registerService(firstName, lastName, email, password);
      if (result.success && result.user) {
        const newUser: User = {
          id: result.user.id,
          first_name: result.user.first_name,
          last_name: result.user.last_name,
          email: result.user.email,
          role: (result.user.role || 'customer') as 'customer' | 'admin'
        };
        setUser(newUser);
        localStorage.setItem('user', JSON.stringify(newUser));
        return true;
      }
      return false;
    } catch (error) {
      console.error('Registration failed:', error);
      return false;
    }
  };

  const logout = () => {
    logoutService();
    setUser(null);
    localStorage.removeItem('user');
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
  };

  const isAuthenticated = !!user;
  const isAdmin = user?.role === 'admin';

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, isAdmin, login, register, logout, setUser }}>
      {!isLoading && children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
