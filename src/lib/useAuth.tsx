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
  login: (email: string, role: AppRole) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // In a real app, we'd check Supabase Auth session here:
    // supabase.auth.getSession()...
    // For this prototype, we're relying on local storage to persist the pseudo-session
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

  const login = async (email: string, role: AppRole) => {
    const { data, error } = await supabase
      .from('employees')
      .select('*')
      .eq('email', email)
      .single();

    if (error || !data) throw new Error('User not found');

    const authUser: AuthUser = {
      id: data.id,
      email: data.email,
      name: data.name,
      department: data.department,
      position: data.position,
      role: role,
      initials: data.name.split(' ').map((n: string) => n[0]).join('').substring(0, 2).toUpperCase(),
    };

    setUser(authUser);
    localStorage.setItem('hrms_user', JSON.stringify(authUser));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('hrms_user');
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
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
