import { useState, useEffect } from 'react';
import { Layout, type Page } from './components/Layout';
import { LoginScreen } from './components/auth/LoginScreen';
import { AdminDashboard } from './components/admin/AdminDashboard';
import { EmployeeManagement } from './components/admin/EmployeeManagement';
import { AttendanceManagement } from './components/admin/AttendanceManagement';
import { PayrollManagement } from './components/admin/PayrollManagement';
import { LeaveManagement } from './components/admin/LeaveManagement';
import { PerformanceEvaluation } from './components/admin/PerformanceEvaluation';
import { JobPostingManagement } from './components/admin/JobPostingManagement';
import { AnnouncementsHub } from './components/admin/AnnouncementsHub';
import { EmployeeDashboard } from './components/employee/EmployeeDashboard';
import { MyAttendance } from './components/employee/MyAttendance';
import { MyPayslips } from './components/employee/MyPayslips';
import { LeaveRequest } from './components/employee/LeaveRequest';
import { MyPerformance } from './components/employee/MyPerformance';
import { MyProfile } from './components/employee/MyProfile';
import { ManpowerRequestPage } from './components/manager/ManpowerRequestPage';
import { ManagerInterviewFeedback } from './components/manager/ManagerInterviewFeedback';
import { AnnouncementsFeed } from './components/shared/AnnouncementsFeed';
import { JobBoard } from './components/public/JobBoard';
import { type Employee } from './data/mockData';
import { useAuth, AppRole } from '../lib/useAuth';
import { useSessionTimeout } from '../lib/useSessionTimeout';

const defaultPageForRole: Record<AppRole, Page> = {
  admin: 'admin-dashboard',
  employee: 'emp-dashboard',
  manager: 'manager-request',
};

export default function App() {
  const { user, loading, sessionExpired, lastEmail, logout, simulateExpiry } = useAuth();
  const [currentPage, setCurrentPage] = useState<Page>('admin-dashboard');
  const [profileEmployee, setProfileEmployee] = useState<Employee | null>(null);
  const [showJobBoard, setShowJobBoard] = useState(false);

  // 15 minutes timeout
  useSessionTimeout(simulateExpiry, !!user);

  useEffect(() => {
    if (user) {
      setCurrentPage(defaultPageForRole[user.role]);
    }
  }, [user]);

  function handleLogin() {
    // login is handled inside LoginScreen which now calls login from useAuth
  }

  function handleLogout() {
    logout();
    setProfileEmployee(null);
  }

  function handleNavigate(page: Page, data?: unknown) {
    if (page === 'employee-profile' && data) {
      setProfileEmployee(data as Employee);
    } else {
      setProfileEmployee(null);
    }
    setCurrentPage(page);
  }

  if (loading) {
    return <div className="min-h-screen bg-[#1E2A4A] flex items-center justify-center"><div className="text-white">Loading...</div></div>;
  }

  if (showJobBoard) {
    return <JobBoard onBack={() => setShowJobBoard(false)} />;
  }

  if (!user) {
    return (
      <div>
        <LoginScreen
          onLogin={handleLogin}
          initialView={sessionExpired ? 'session-expired' : 'login'}
          sessionEmail={lastEmail ?? undefined}
        />
        <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50">
          <button
            onClick={() => setShowJobBoard(true)}
            className="flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm text-white/70 text-xs rounded-full border border-white/20 hover:bg-white/20 transition-colors"
          >
            View Public Job Board
          </button>
        </div>
      </div>
    );
  }

  function renderPage() {
    if (!user) return null;

    if (currentPage === 'my-profile') return <MyProfile />;

    // Announcements — accessible from all roles
    if (currentPage === 'announcements') return <AnnouncementsHub />;
    if (currentPage === 'emp-announcements') return <AnnouncementsFeed role="employee" userId={user.id} />;
    if (currentPage === 'manager-announcements') return <AnnouncementsFeed role="manager" userId={user.id} />;

    if (user.role === 'manager') {
      switch (currentPage) {
        case 'manager-request': return <ManpowerRequestPage />;
        case 'manager-feedback': return <ManagerInterviewFeedback />;
        default: return <ManpowerRequestPage />;
      }
    }

    if (user.role === 'admin') {
      switch (currentPage) {
        case 'admin-dashboard': return <AdminDashboard onNavigate={handleNavigate} />;
        case 'employees':
        case 'employee-profile':
          return <EmployeeManagement onNavigate={handleNavigate} profileEmployee={currentPage === 'employee-profile' ? profileEmployee : null} />;
        case 'attendance': return <AttendanceManagement />;
        case 'payroll': return <PayrollManagement />;
        case 'leaves': return <LeaveManagement />;
        case 'performance': return <PerformanceEvaluation />;
        case 'recruitment': return <JobPostingManagement />;
        default: return <AdminDashboard onNavigate={handleNavigate} />;
      }
    }

    // employee
    switch (currentPage) {
      case 'emp-dashboard': return <EmployeeDashboard onNavigate={handleNavigate} />;
      case 'my-attendance': return <MyAttendance />;
      case 'my-payslips': return <MyPayslips />;
      case 'leave-request': return <LeaveRequest />;
      case 'my-performance': return <MyPerformance />;
      default: return <EmployeeDashboard onNavigate={handleNavigate} />;
    }
  }

  return (
    <Layout
      user={user}
      currentPage={currentPage}
      onNavigate={handleNavigate}
      onLogout={handleLogout}
      onSimulateExpiry={simulateExpiry}
    >
      {renderPage()}
    </Layout>
  );
}
