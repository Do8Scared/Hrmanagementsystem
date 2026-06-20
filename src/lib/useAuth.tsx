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
  login: (email: string, password: string) => Promise<void>;
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

  const login = async (email: string, password: string) => {
    // Call the verify_password RPC function which checks bcrypt hash server-side
    const { data, error } = await supabase
      .rpc('verify_password', { p_email: email, p_password: password });

    if (error) throw new Error('Something went wrong during login.');
    if (!data || data.length === 0) throw new Error('Invalid credentials');

    const emp = data[0];

    let assignedRole: AppRole = 'employee';
    if (emp.out_department === 'Human Resources') {
      assignedRole = 'admin';
    } else if (emp.out_position?.toLowerCase().includes('manager') || emp.out_position?.toLowerCase().includes('head')) {
      assignedRole = 'manager';
    }

    const authUser: AuthUser = {
      id: emp.out_id,
      email: emp.out_email,
      name: emp.out_name,
      department: emp.out_department,
      position: emp.out_position,
      role: assignedRole,
      initials: emp.out_name.split(' ').map((n: string) => n[0]).join('').substring(0, 2).toUpperCase(),
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
