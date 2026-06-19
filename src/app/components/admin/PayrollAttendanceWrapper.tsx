import { useState } from 'react';
import { PayrollManagement } from './PayrollManagement';
import { AttendanceManagement } from './AttendanceManagement';
import { AuthUser } from '../../../lib/useAuth';

interface Props {
  user: AuthUser;
}

export function PayrollAttendanceWrapper({ user }: Props) {
  const [activeTab, setActiveTab] = useState<'payroll' | 'attendance'>('payroll');

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Payroll & Attendance</h1>
          <p className="text-muted-foreground text-sm mt-1">Manage employee attendance records and run payroll.</p>
        </div>
      </div>

      <div className="bg-card rounded-2xl border border-border overflow-hidden">
        <div className="border-b border-border bg-secondary/30 px-2 flex gap-2">
          <button
            onClick={() => setActiveTab('payroll')}
            className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
              activeTab === 'payroll'
                ? 'border-primary text-primary'
                : 'border-transparent text-muted-foreground hover:text-foreground hover:border-border'
            }`}
          >
            Payroll Management
          </button>
          <button
            onClick={() => setActiveTab('attendance')}
            className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
              activeTab === 'attendance'
                ? 'border-primary text-primary'
                : 'border-transparent text-muted-foreground hover:text-foreground hover:border-border'
            }`}
          >
            Attendance Management
          </button>
        </div>
        <div className="p-6">
          {activeTab === 'payroll' && <PayrollManagement />}
          {activeTab === 'attendance' && <AttendanceManagement />}
        </div>
      </div>
    </div>
  );
}
