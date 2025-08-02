'use client';

import {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
} from 'react';

type User = {
  name?: string;
  email: string;
  role: 'admin' | 'student';
};

interface AuthContextType {
  user: User | null;
  login: (user: Omit<User, 'role'>) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    try {
      const item = window.localStorage.getItem('user');
      if (item) {
        setUser(JSON.parse(item));
      }
    } catch (error) {
      console.error('Failed to load user from local storage', error);
      setUser(null);
    }
  }, []);

  const login = (userData: Omit<User, 'role'>) => {
    const role = userData.email === 'm@example.com' ? 'admin' : 'student';
    const userWithRole = { ...userData, role };
    setUser(userWithRole);
    try {
      window.localStorage.setItem('user', JSON.stringify(userWithRole));
    } catch (error) {
      console.error('Failed to save user to local storage', error);
    }
  };

  const logout = () => {
    setUser(null);
    try {
      window.localStorage.removeItem('user');
    } catch (error) {
      console.error('Failed to remove user from local storage', error);
    }
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
