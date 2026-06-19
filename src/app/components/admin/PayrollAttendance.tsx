import { useState } from 'react';
import { Clock, DollarSign } from 'lucide-react';
import { AttendanceManagement } from './AttendanceManagement';
import { PayrollManagement } from './PayrollManagement';

type SubTab = 'timekeeping' | 'payroll';

export function PayrollAttendance() {
  const [tab, setTab] = useState<SubTab>('timekeeping');

  return (
    <div className="space-y-5">
      {/* Module tab switcher */}
      <div className="flex gap-1 bg-white border border-border rounded-xl p-1 w-fit shadow-sm">
        {([
          { id: 'timekeeping', label: 'Timekeeping', icon: Clock },
          { id: 'payroll', label: 'Payroll', icon: DollarSign },
        ] as { id: SubTab; label: string; icon: typeof Clock }[]).map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            onClick={() => setTab(id)}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-medium transition-all ${
              tab === id
                ? 'bg-primary text-white shadow-sm'
                : 'text-muted-foreground hover:text-foreground hover:bg-secondary'
            }`}
          >
            <Icon size={15} />
            {label}
          </button>
        ))}
      </div>

      {tab === 'timekeeping' ? <AttendanceManagement /> : <PayrollManagement />}
    </div>
  );
}
