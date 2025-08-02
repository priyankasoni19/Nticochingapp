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
};

interface AuthContextType {
  user: User | null;
  login: (user: User) => void;
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

  const login = (user: User) => {
    setUser(user);
    try {
      window.localStorage.setItem('user', JSON.stringify(user));
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
