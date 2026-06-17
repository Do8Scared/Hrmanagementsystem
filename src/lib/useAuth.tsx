import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { supabase } from './supabaseClient';

export type AppRole = 'admin' | 'employee' | 'manager';

export interface AuthUser {
  id: string;
  email: string;
  name: string;
  department: string;
  position: string;
  role: AppRole;
  initials: string;
}

interface AuthContextType {
  user: AuthUser | null;
  loading: boolean;
  sessionExpired: boolean;
  lastEmail: string | null;
  login: (email: string) => Promise<void>;
  logout: () => void;
  simulateExpiry: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [sessionExpired, setSessionExpired] = useState(false);
  const [lastEmail, setLastEmail] = useState<string | null>(null);

  useEffect(() => {
    const storedUser = localStorage.getItem('hrms_user');
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (e) {
        localStorage.removeItem('hrms_user');
      }
    }
    setLoading(false);
  }, []);

  const login = async (email: string) => {
    const { data, error } = await supabase
      .from('employees')
      .select('*')
      .eq('email', email)
      .single();

    if (error || !data) throw new Error('User not found');

    let assignedRole: AppRole = 'employee';
    if (data.department === 'Human Resources' || data.position?.toLowerCase().includes('manager') || data.position?.toLowerCase().includes('head')) {
      assignedRole = 'admin';
    }

    const authUser: AuthUser = {
      id: data.id,
      email: data.email,
      name: data.name,
      department: data.department,
      position: data.position,
      role: assignedRole,
      initials: data.name.split(' ').map((n: string) => n[0]).join('').substring(0, 2).toUpperCase(),
    };

    setUser(authUser);
    setSessionExpired(false);
    localStorage.setItem('hrms_user', JSON.stringify(authUser));
  };

  const logout = () => {
    setUser(null);
    setSessionExpired(false);
    localStorage.removeItem('hrms_user');
  };

  const simulateExpiry = () => {
    setLastEmail(user?.email ?? null);
    setUser(null);
    setSessionExpired(true);
    localStorage.removeItem('hrms_user');
  };

  return (
    <AuthContext.Provider value={{ user, loading, sessionExpired, lastEmail, login, logout, simulateExpiry }}>
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
