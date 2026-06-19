import { useState } from 'react';
import { Layout, type Page } from './components/Layout';
import { LoginScreen } from './components/auth/LoginScreen';
import { AdminDashboard } from './components/admin/AdminDashboard';
import { EmployeeManagement } from './components/admin/EmployeeManagement';
import { PayrollAttendance } from './components/admin/PayrollAttendance';
import { LeaveManagement } from './components/admin/LeaveManagement';
import { JobPostingManagement } from './components/admin/JobPostingManagement';
import { AnnouncementsHub } from './components/admin/AnnouncementsHub';
import { HRAdminModule } from './components/admin/HRAdminModule';
import { EmployeeDashboard } from './components/employee/EmployeeDashboard';
import { MyAttendance } from './components/employee/MyAttendance';
import { MyPayslips } from './components/employee/MyPayslips';
import { LeaveRequest } from './components/employee/LeaveRequest';
import { MyPerformance } from './components/employee/MyPerformance';
import { MyProfile } from './components/employee/MyProfile';
import { MyHRCases } from './components/employee/MyHRCases';
import { ManagerDashboard } from './components/manager/ManagerDashboard';
import { ManpowerRequestPage } from './components/manager/ManpowerRequestPage';
import { ManagerInterviewFeedback } from './components/manager/ManagerInterviewFeedback';
import { AnnouncementsFeed } from './components/shared/AnnouncementsFeed';
import { JobBoard } from './components/public/JobBoard';
import { type Employee } from './data/mockData';

type AppState = 'login' | 'authenticated' | 'session-expired' | 'job-board';
type AppRole = 'admin' | 'employee' | 'manager';

const defaultPageForRole: Record<AppRole, Page> = {
  admin: 'admin-dashboard',
  employee: 'emp-dashboard',
  manager: 'manager-dashboard',
};

const nextRole: Record<AppRole, AppRole> = {
  admin: 'manager',
  manager: 'employee',
  employee: 'admin',
};

export default function App() {
  const [appState, setAppState] = useState<AppState>('login');
  const [role, setRole] = useState<AppRole>('admin');
  const [currentPage, setCurrentPage] = useState<Page>('admin-dashboard');
  const [profileEmployee, setProfileEmployee] = useState<Employee | null>(null);
  const [sessionEmail] = useState('juan.delacruz@hrms.ph');

  function handleLogin(selectedRole: 'admin' | 'employee') {
    setRole(selectedRole);
    setCurrentPage(defaultPageForRole[selectedRole]);
    setAppState('authenticated');
  }

  function handleLogout() {
    setAppState('login');
    setProfileEmployee(null);
  }

  function handleRoleChange() {
    const next = nextRole[role];
    setRole(next);
    setCurrentPage(defaultPageForRole[next]);
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

  if (appState === 'job-board') {
    return <JobBoard onBack={() => setAppState('login')} />;
  }

  if (appState === 'login' || appState === 'session-expired') {
    return (
      <div>
        <LoginScreen
          onLogin={handleLogin}
          initialView={appState === 'session-expired' ? 'session-expired' : 'login'}
          sessionEmail={sessionEmail}
        />
        <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50">
          <button
            onClick={() => setAppState('job-board')}
            className="flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm text-white/70 text-xs rounded-full border border-white/20 hover:bg-white/20 transition-colors"
          >
            View Public Job Board
          </button>
        </div>
      </div>
    );
  }

  function renderPage() {
    if (currentPage === 'my-profile') return <MyProfile />;

    // Announcements — accessible from all roles
    if (currentPage === 'announcements') return <AnnouncementsHub />;
    if (currentPage === 'emp-announcements') return <AnnouncementsFeed role="employee" />;
    if (currentPage === 'manager-announcements') return <AnnouncementsFeed role="manager" />;

    if (role === 'manager') {
      switch (currentPage) {
        case 'manager-dashboard': return <ManagerDashboard onNavigate={handleNavigate} />;
        case 'manager-request': return <ManpowerRequestPage />;
        case 'manager-feedback': return <ManagerInterviewFeedback />;
        case 'hr-admin': return <HRAdminModule viewerRole="manager" />;
        default: return <ManagerDashboard onNavigate={handleNavigate} />;
      }
    }

    if (role === 'admin') {
      switch (currentPage) {
        case 'admin-dashboard': return <AdminDashboard onNavigate={handleNavigate} />;
        case 'employees':
        case 'employee-profile':
          return <EmployeeManagement onNavigate={handleNavigate} profileEmployee={currentPage === 'employee-profile' ? profileEmployee : null} />;
        case 'attendance':
        case 'payroll':
        case 'payroll-attendance': return <PayrollAttendance />;
        case 'leaves': return <LeaveManagement />;
        case 'recruitment': return <JobPostingManagement />;
        case 'hr-admin': return <HRAdminModule viewerRole="admin" />;
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
      case 'my-hr-cases': return <MyHRCases />;
      default: return <EmployeeDashboard onNavigate={handleNavigate} />;
    }
  }

  return (
    <Layout
      role={role}
      currentPage={currentPage}
      onNavigate={handleNavigate}
      onRoleChange={handleRoleChange}
      onLogout={handleLogout}
      onSessionExpire={() => setAppState('session-expired')}
    >
      {renderPage()}
    </Layout>
  );
}
