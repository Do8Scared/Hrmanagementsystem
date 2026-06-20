import { useState, useEffect } from 'react';
import {
  LayoutDashboard, Users, Clock, DollarSign, CalendarDays, Star,
  Bell, ChevronDown, LogOut, Menu, X, Building2, User, Lock, Briefcase, Megaphone,
  ShieldAlert
} from 'lucide-react';
import corazonLogo from '@/imports/Screenshot_2026-06-18_at_10.57.47_PM.png';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { LogoutModal } from './auth/LogoutModal';
import { ChangePasswordModal } from './auth/ChangePasswordModal';
import { supabase } from '../../lib/supabaseClient';

export type Page =
  | 'admin-dashboard' | 'employees' | 'employee-profile' | 'attendance' | 'payroll' | 'payroll-attendance' | 'leaves' | 'performance' | 'recruitment' | 'announcements' | 'hr-admin'
  | 'emp-dashboard' | 'my-attendance' | 'my-payslips' | 'leave-request' | 'my-performance' | 'my-profile' | 'emp-announcements' | 'my-hr-cases'
  | 'manager-dashboard' | 'manager-request' | 'manager-feedback' | 'manager-announcements';

import { AuthUser } from '../../lib/useAuth';

interface LayoutProps {
  user: AuthUser;
  currentPage: Page;
  onNavigate: (page: Page) => void;
  onLogout: () => void;
  onSimulateExpiry?: () => void;
  children: React.ReactNode;
}

const adminNav = [
  { id: 'admin-dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'employees', label: 'Employee Management', icon: Users },
  { id: 'payroll-attendance', label: 'Payroll & Attendance', icon: DollarSign },
  { id: 'leaves', label: 'Leave Management', icon: CalendarDays },
  { id: 'recruitment', label: 'Recruitment', icon: Briefcase },
  { id: 'hr-admin', label: 'HR Admin / ER', icon: ShieldAlert },
  { id: 'announcements', label: 'Announcements', icon: Megaphone },
];

const employeeNav = [
  { id: 'emp-dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'my-attendance', label: 'My Attendance', icon: Clock },
  { id: 'my-payslips', label: 'My Payslips', icon: DollarSign },
  { id: 'leave-request', label: 'Leave Request', icon: CalendarDays },
  { id: 'my-performance', label: 'My Performance', icon: Star },
  { id: 'my-hr-cases', label: 'HR Cases', icon: ShieldAlert },
  { id: 'emp-announcements', label: 'Announcements', icon: Megaphone },
];

const managerNav = [
  { id: 'manager-dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'manager-request', label: 'Manpower Request', icon: Briefcase },
  { id: 'manager-feedback', label: 'Interview Feedback', icon: Star },
  { id: 'hr-admin', label: 'Employee Relations', icon: ShieldAlert },
  { id: 'manager-announcements', label: 'Announcements', icon: Megaphone },
];

const pageTitles: Record<string, string> = {
  'admin-dashboard': 'Dashboard',
  'employees': 'Employee Management',
  'employee-profile': 'Employee Profile',
  'attendance': 'Attendance Management',
  'payroll': 'Payroll Management',
  'payroll-attendance': 'Payroll & Attendance',
  'leaves': 'Leave Management',
  'performance': 'Performance Evaluation',
  'recruitment': 'Recruitment',
  'hr-admin': 'HR Admin / Employee Relations',
  'announcements': 'Announcements & Policies',
  'emp-dashboard': 'Dashboard',
  'my-attendance': 'My Attendance',
  'my-payslips': 'My Payslips',
  'leave-request': 'Leave Request',
  'my-performance': 'My Performance',
  'my-profile': 'My Profile',
  'my-hr-cases': 'My HR Cases',
  'emp-announcements': 'Announcements',
  'manager-announcements': 'Announcements',
  'manager-dashboard': 'Dashboard',
  'manager-request': 'Manpower Request',
  'manager-feedback': 'Interview Feedback',
};

export function Layout({ user, currentPage, onNavigate, onLogout, onSimulateExpiry, children }: LayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [notifOpen, setNotifOpen] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const [showPasswordFromMenu, setShowPasswordFromMenu] = useState(false);
  const [hasUnreadAnnouncements, setHasUnreadAnnouncements] = useState(false);
  const role = user.role;

  useEffect(() => {
    async function checkUnread() {
      // Just check if there are announcements requiring ack that the user hasn't acked
      const { data: ann } = await supabase.from('announcements').select('id, targetaudience, status, requiresacknowledgement');
      const { data: acks } = await supabase.from('acknowledgements').select('announcementid').eq('employeeid', user.id);
      
      if (ann && acks) {
        const ackSet = new Set(acks.map((a: any) => a.announcementid));
        const published = ann.filter((a: any) => a.status === 'Published' && (
          a.targetaudience === 'All Employees' ||
          (role === 'manager' && a.targetaudience === 'Managers Only') ||
          (role === 'employee' && a.targetaudience !== 'Managers Only')
        ));
        
        const unread = published.some((a: any) => a.requiresacknowledgement && !ackSet.has(a.id));
        setHasUnreadAnnouncements(unread);
      }
    }
    checkUnread();
  }, [user.id, user.role]);

  const navItems = role === 'admin' ? adminNav : role === 'manager' ? managerNav : employeeNav;
  const userName = user.name;
  const userRole = role === 'admin' ? 'HR Specialist' : role === 'manager' ? 'Operations Manager' : 'Employee';
  const userInitials = user.initials;

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      {/* Sidebar */}
      <aside
        className={`flex flex-col flex-shrink-0 transition-all duration-300 ${sidebarOpen ? 'w-64' : 'w-16'}`}
        style={{ background: 'var(--sidebar)' }}
      >
        {/* Logo */}
        <div className={`flex items-center border-b border-white/10 ${sidebarOpen ? 'px-3 py-3' : 'px-2 py-3 justify-center'}`}>
          {sidebarOpen ? (
            <ImageWithFallback
              src={corazonLogo}
              alt="Corazon Travel and Tours"
              className="h-12 w-auto object-contain"
            />
          ) : (
            <div className="w-9 h-9 rounded-lg overflow-hidden flex-shrink-0">
              <ImageWithFallback
                src={corazonLogo}
                alt="Corazon"
                className="w-full h-full object-cover"
              />
            </div>
          )}
        </div>

        {/* Role indicator */}
        {sidebarOpen && (
          <div className="px-4 pt-3 pb-1.5">
            <div className="text-xs uppercase tracking-wider font-bold" style={{ color: 'var(--sidebar-primary)', opacity: 0.85 }}>
              {role === 'admin' ? 'Admin / HR' : role === 'manager' ? 'Manager Portal' : 'Employee Portal'}
            </div>
          </div>
        )}

        {/* Nav */}
        <nav className="flex-1 px-2 py-2 space-y-0.5 overflow-y-auto">
          {navItems.map(item => {
            const Icon = item.icon;
            const isActive = currentPage === item.id || (item.id === 'employees' && currentPage === 'employee-profile') || (item.id === 'payroll-attendance' && (currentPage === 'attendance' || currentPage === 'payroll'));
            const isAnnouncements = item.id === 'announcements' || item.id === 'emp-announcements' || item.id === 'manager-announcements';
            // Placeholder: currently hasAlert checks will just use the same isAnnouncements logic until we add DB fields, but we'll include hr-admin to test visual.
            const hasAlert = (isAnnouncements && hasUnreadAnnouncements) || item.id === 'hr-admin' || item.id === 'my-hr-cases';
            return (
              <button
                key={item.id}
                onClick={() => onNavigate(item.id as Page)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all duration-150 ${
                  isActive
                    ? 'text-white font-bold'
                    : 'hover:text-white/90'
                }`}
                style={isActive
                  ? { background: 'rgba(232,168,0,0.18)', color: '#FFF5E9' }
                  : { color: 'rgba(255,245,233,0.55)' }
                }
              >
                <div className="relative flex-shrink-0">
                  <Icon size={18} style={isActive ? { color: 'var(--sidebar-primary)' } : {}} />
                  {hasAlert && !isActive && (
                    <span className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full" style={{ background: 'var(--sidebar-primary)' }} />
                  )}
                </div>
                {sidebarOpen && <span className="truncate">{item.label}</span>}
                {isActive && sidebarOpen && (
                  <span className="ml-auto w-1.5 h-1.5 rounded-full" style={{ background: 'var(--sidebar-primary)' }} />
                )}
              </button>
            );
          })}
        </nav>

        {/* User & Role Switch */}
        <div className="border-t border-white/10 p-3">
          {sidebarOpen ? (
            <div className="space-y-2">
              <div className="flex items-center gap-3 px-2 py-2 rounded-lg hover:bg-white/8 transition-colors">
                <div className="w-8 h-8 rounded-full bg-[#C8890A] flex items-center justify-center flex-shrink-0">
                  <span className="text-white text-xs font-semibold">{userInitials}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-white text-xs font-medium truncate">{userName}</div>
                  <div className="text-white/40 text-xs truncate">{userRole}</div>
                </div>
              </div>
              <button
                onClick={() => setShowLogoutModal(true)}
                className="w-full flex items-center gap-2 px-2 py-2 rounded-lg text-red-400/80 hover:text-red-400 hover:bg-red-500/10 text-xs transition-all"
              >
                <LogOut size={14} />
                <span>Log Out</span>
              </button>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-[#C8890A] flex items-center justify-center">
                <span className="text-white text-xs font-semibold">{userInitials}</span>
              </div>
              <button onClick={() => setShowLogoutModal(true)} className="text-red-400/80 hover:text-red-400 transition-colors" title="Log Out">
                <LogOut size={14} />
              </button>
            </div>
          )}
        </div>
      </aside>

      {showLogoutModal && (
        <LogoutModal
          onConfirm={() => { setShowLogoutModal(false); onLogout(); }}
          onCancel={() => setShowLogoutModal(false)}
        />
      )}

      {showPasswordFromMenu && (
        <ChangePasswordModal onClose={() => setShowPasswordFromMenu(false)} userId={user.id} />
      )}

      {profileMenuOpen && (
        <div className="fixed inset-0 z-40" onClick={() => setProfileMenuOpen(false)} />
      )}

      {/* Main */}
      <div className="flex flex-col flex-1 min-w-0 overflow-hidden">
        {/* Top Header */}
        <header className="flex items-center justify-between px-6 h-16 bg-white border-b border-border flex-shrink-0">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setSidebarOpen(v => !v)}
              className="p-1.5 rounded-lg text-muted-foreground hover:bg-secondary hover:text-foreground transition-colors"
            >
              {sidebarOpen ? <X size={18} /> : <Menu size={18} />}
            </button>
            <div>
              <h1 className="text-foreground font-semibold">{pageTitles[currentPage] ?? 'HorizonHR'}</h1>
              <p className="text-muted-foreground text-xs">Tuesday, June 16, 2026</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="relative">
              <button
                onClick={() => setNotifOpen(v => !v)}
                className="relative p-2 rounded-lg text-muted-foreground hover:bg-secondary hover:text-foreground transition-colors"
              >
                <Bell size={18} />
                <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full" />
              </button>
              {notifOpen && (
                <div className="absolute right-0 top-10 w-80 bg-white rounded-xl shadow-xl border border-border z-50 overflow-hidden">
                  <div className="flex items-center justify-between px-4 py-3 border-b border-border">
                    <span className="font-semibold text-sm text-foreground">Notifications</span>
                    <span className="text-xs text-muted-foreground">5 new</span>
                  </div>
                  {[
                    { type: 'Advisory', msg: 'Q2 2026 Company Performance Update', time: '2 hrs ago', accent: 'bg-blue-500' },
                    { type: 'Policy', msg: 'Updated Flexible Work Arrangement Policy', time: '4 hrs ago', accent: 'bg-emerald-500' },
                    { type: 'Memorandum', msg: 'Office Closure — June 19 Holiday', time: '1 day ago', accent: 'bg-purple-500' },
                    { type: 'System', msg: 'Leave request from Juan dela Cruz pending', time: '10 min ago', accent: 'bg-amber-500' },
                    { type: 'System', msg: 'Payroll for June 2026 ready for processing', time: '2 hrs ago', accent: 'bg-primary' },
                  ].map((n, i) => (
                    <button key={i} onClick={() => { setNotifOpen(false); onNavigate(role === 'admin' ? 'announcements' : role === 'manager' ? 'manager-announcements' : 'emp-announcements'); }} className="w-full flex items-start gap-3 px-4 py-3 hover:bg-secondary transition-colors border-b border-border/50 last:border-0 text-left">
                      <span className={`w-2 h-2 rounded-full mt-1.5 flex-shrink-0 ${n.accent}`} />
                      <div className="flex-1 min-w-0">
                        {n.type !== 'System' && <span className="text-xs font-semibold text-muted-foreground">{n.type} · </span>}
                        <span className="text-xs text-foreground leading-snug">{n.msg}</span>
                        <p className="text-xs text-muted-foreground mt-0.5">{n.time}</p>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div className="relative">
              <button
                onClick={() => setProfileMenuOpen(v => !v)}
                className="flex items-center gap-2 pl-3 border-l border-border hover:bg-secondary/60 rounded-lg pr-2 py-1 transition-colors"
              >
                <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center flex-shrink-0">
                  <span className="text-white text-xs font-semibold">{userInitials}</span>
                </div>
                <div className="hidden sm:block text-left">
                  <div className="text-sm font-medium text-foreground leading-tight">{userName}</div>
                  <div className="text-xs text-muted-foreground">{userRole}</div>
                </div>
                <ChevronDown
                  size={14}
                  className={`text-muted-foreground transition-transform duration-200 ${profileMenuOpen ? 'rotate-180' : ''}`}
                />
              </button>

              {profileMenuOpen && (
                <div
                  className="absolute right-0 top-12 w-56 bg-white rounded-xl shadow-xl border border-border z-50 overflow-hidden"
                  style={{ boxShadow: '0 8px 30px rgba(0,0,0,0.12)' }}
                >
                  {/* User info header */}
                  <div className="px-4 py-3 border-b border-border bg-secondary/40">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-primary flex items-center justify-center flex-shrink-0">
                        <span className="text-white text-xs font-semibold">{userInitials}</span>
                      </div>
                      <div className="min-w-0">
                        <div className="text-sm font-semibold text-foreground truncate">{userName}</div>
                        <div className="text-xs text-muted-foreground truncate">{userRole}</div>
                      </div>
                    </div>
                  </div>

                  {/* Menu items */}
                  <div className="py-1">
                    <button
                      onClick={() => { onNavigate('my-profile'); setProfileMenuOpen(false); }}
                      className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-foreground hover:bg-secondary transition-colors text-left"
                    >
                      <User size={15} className="text-muted-foreground flex-shrink-0" />
                      My Profile
                    </button>
                    <button
                      onClick={() => { setProfileMenuOpen(false); setShowPasswordFromMenu(true); }}
                      className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-foreground hover:bg-secondary transition-colors text-left"
                    >
                      <Lock size={15} className="text-muted-foreground flex-shrink-0" />
                      Change Password
                    </button>
                  </div>

                  <div className="border-t border-border py-1">
                    <button
                      onClick={() => { setProfileMenuOpen(false); setShowLogoutModal(true); }}
                      className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors text-left"
                    >
                      <LogOut size={15} className="flex-shrink-0" />
                      Log Out
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
