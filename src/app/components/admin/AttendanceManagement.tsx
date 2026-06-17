import { useState, useEffect, useMemo } from 'react';
import { Download, ChevronLeft, ChevronRight, Search } from 'lucide-react';
import { StatusBadge } from '../StatusBadge';
import { supabase } from '../../../lib/supabaseClient';

type AttendanceStatus = 'Present' | 'Late' | 'Absent' | 'Undertime';

const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'];

const statusColor: Record<AttendanceStatus, string> = {
  Present: 'bg-emerald-500',
  Late: 'bg-amber-400',
  Absent: 'bg-red-400',
  Undertime: 'bg-orange-400',
};

// Fill missing days with Absent or random data if required? No, let's just use the actual database records.
// If there are missing days, they will just show Absent or not have records.
// The original mock generated random records for days 1 to 16. The seeded db has the exact mock data.
// We will generate the calendar days and lookup the record.

export function AttendanceManagement() {
  const [employees, setEmployees] = useState<any[]>([]);
  const [attendanceRecords, setAttendanceRecords] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedEmp, setSelectedEmp] = useState<string>('');
  const [year, setYear] = useState(2026);
  const [month, setMonth] = useState(6);
  const [search, setSearch] = useState('');
  const [view, setView] = useState<'table' | 'calendar'>('table');

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      const [empRes, attRes] = await Promise.all([
        supabase.from('employees').select('*'),
        supabase.from('attendance_records').select('*')
      ]);
      if (empRes.data) {
        setEmployees(empRes.data);
        if (empRes.data.length > 0) setSelectedEmp(empRes.data[0].id);
      }
      if (attRes.data) setAttendanceRecords(attRes.data);
      setLoading(false);
    }
    fetchData();
  }, []);

  const emp = employees.find(e => e.id === selectedEmp);
  
  // Get records for selected employee and month
  const records = useMemo(() => {
    if (!emp) return [];
    
    // We can simulate the missing days as absent for the days up to today if we want,
    // but better to just use what's in the DB.
    const result = [];
    const days = new Date(year, month, 0).getDate();
    for (let d = 1; d <= days; d++) {
      const dow = new Date(year, month - 1, d).getDay();
      if (dow === 0 || dow === 6) continue; // Skip weekends
      const dateStr = `${year}-${String(month).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
      
      const record = attendanceRecords.find(r => r.employee_id === selectedEmp && r.date === dateStr);
      if (record) {
        result.push({
          date: record.date,
          timeIn: record.time_in,
          timeOut: record.time_out,
          totalHours: record.total_hours,
          status: record.status as AttendanceStatus
        });
      } else if (new Date(dateStr) < new Date('2026-06-17')) { // Past days without record are Absent
        result.push({
          date: dateStr,
          timeIn: null,
          timeOut: null,
          totalHours: null,
          status: 'Absent' as AttendanceStatus
        });
      }
    }
    return result;
  }, [selectedEmp, year, month, attendanceRecords, emp]);

  const summary = {
    present: records.filter(r => r.status === 'Present').length,
    late: records.filter(r => r.status === 'Late').length,
    absent: records.filter(r => r.status === 'Absent').length,
    undertime: records.filter(r => r.status === 'Undertime').length,
    totalWorkDays: records.length,
  };

  const filteredEmployees = employees.filter(e =>
    e.name.toLowerCase().includes(search.toLowerCase()) || e.department.toLowerCase().includes(search.toLowerCase())
  );

  const prevMonth = () => {
    if (month === 1) { setMonth(12); setYear(y => y - 1); }
    else setMonth(m => m - 1);
  };
  const nextMonth = () => {
    if (month === 12) { setMonth(1); setYear(y => y + 1); }
    else setMonth(m => m + 1);
  };

  const calendarDays = useMemo(() => {
    const days = new Date(year, month, 0).getDate();
    const firstDow = new Date(year, month - 1, 1).getDay();
    const result: Array<{ day: number | null; record?: typeof records[0] }> = [];
    for (let i = 0; i < firstDow; i++) result.push({ day: null });
    for (let d = 1; d <= days; d++) {
      const dateStr = `${year}-${String(month).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
      result.push({ day: d, record: records.find(r => r.date === dateStr) });
    }
    return result;
  }, [year, month, records]);

  if (loading) {
    return <div className="p-8 text-center text-muted-foreground">Loading attendance data...</div>;
  }

  if (!emp) return null;

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-4 gap-4">
        {[
          { label: 'Present', value: summary.present, color: 'bg-emerald-50 text-emerald-700 border-emerald-100' },
          { label: 'Late', value: summary.late, color: 'bg-amber-50 text-amber-700 border-amber-100' },
          { label: 'Absent', value: summary.absent, color: 'bg-red-50 text-red-700 border-red-100' },
          { label: 'Undertime', value: summary.undertime, color: 'bg-orange-50 text-orange-700 border-orange-100' },
        ].map(s => (
          <div key={s.label} className={`rounded-xl border p-4 ${s.color}`}>
            <div className="text-2xl font-bold">{s.value}</div>
            <div className="text-sm font-medium mt-0.5">{s.label} Days</div>
            <div className="text-xs mt-1 opacity-70">out of {summary.totalWorkDays} work days</div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-4 gap-4">
        {/* Employee Selector */}
        <div className="bg-card rounded-xl border border-border p-4 space-y-3">
          <div className="relative">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search employee..."
              className="w-full pl-8 pr-3 py-2 bg-secondary rounded-lg text-xs border-0 outline-none text-foreground placeholder:text-muted-foreground"
            />
          </div>
          <div className="space-y-1 max-h-96 overflow-y-auto">
            {filteredEmployees.map(e => (
              <button
                key={e.id}
                onClick={() => setSelectedEmp(e.id)}
                className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-left transition-colors ${selectedEmp === e.id ? 'bg-primary text-white' : 'hover:bg-secondary text-foreground'}`}
              >
                <div className={`w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 text-xs font-semibold ${selectedEmp === e.id ? 'bg-white/20 text-white' : 'bg-primary text-white'}`}>
                  {e.initials}
                </div>
                <div className="min-w-0">
                  <div className="text-xs font-medium truncate">{e.name}</div>
                  <div className={`text-xs truncate ${selectedEmp === e.id ? 'text-white/60' : 'text-muted-foreground'}`}>{e.department}</div>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Records */}
        <div className="col-span-3 bg-card rounded-xl border border-border overflow-hidden">
          <div className="flex items-center justify-between px-5 py-4 border-b border-border">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-primary flex items-center justify-center">
                <span className="text-white text-xs font-semibold">{emp.initials}</span>
              </div>
              <div>
                <div className="text-sm font-semibold text-foreground">{emp.name}</div>
                <div className="text-xs text-muted-foreground">{emp.position} · {emp.department}</div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              {/* Month nav */}
              <div className="flex items-center gap-2 bg-secondary rounded-lg px-3 py-1.5">
                <button onClick={prevMonth} className="text-muted-foreground hover:text-foreground transition-colors"><ChevronLeft size={14} /></button>
                <span className="text-sm font-medium text-foreground w-32 text-center">{MONTHS[month - 1]} {year}</span>
                <button onClick={nextMonth} className="text-muted-foreground hover:text-foreground transition-colors"><ChevronRight size={14} /></button>
              </div>
              {/* View toggle */}
              <div className="flex rounded-lg border border-border overflow-hidden">
                {(['table', 'calendar'] as const).map(v => (
                  <button
                    key={v}
                    onClick={() => setView(v)}
                    className={`px-3 py-1.5 text-xs capitalize transition-colors ${view === v ? 'bg-primary text-white' : 'text-muted-foreground hover:bg-secondary'}`}
                  >
                    {v}
                  </button>
                ))}
              </div>
              <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-border text-xs text-muted-foreground hover:bg-secondary transition-colors">
                <Download size={13} /> Export
              </button>
            </div>
          </div>

          {view === 'table' ? (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border bg-secondary/40">
                    {['Date', 'Day', 'Time In', 'Time Out', 'Total Hours', 'Status'].map(col => (
                      <th key={col} className="text-left text-xs font-semibold text-muted-foreground px-5 py-3">{col}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {records.map((r, i) => {
                    const d = new Date(r.date);
                    const dayName = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][d.getDay()];
                    return (
                      <tr key={r.date} className={`border-b border-border/50 ${i % 2 === 0 ? '' : 'bg-secondary/10'} ${r.status === 'Late' || r.status === 'Undertime' ? 'bg-amber-50/30' : r.status === 'Absent' ? 'bg-red-50/30' : ''}`}>
                        <td className="px-5 py-3 text-sm text-foreground">{r.date}</td>
                        <td className="px-5 py-3 text-sm text-muted-foreground">{dayName}</td>
                        <td className="px-5 py-3 text-sm text-foreground">{r.timeIn ?? '—'}</td>
                        <td className="px-5 py-3 text-sm text-foreground">{r.timeOut ?? '—'}</td>
                        <td className="px-5 py-3 text-sm text-foreground">
                          {r.totalHours ? `${r.totalHours.toFixed(2)} hrs` : '—'}
                        </td>
                        <td className="px-5 py-3"><StatusBadge status={r.status} /></td>
                      </tr>
                    );
                  })}
                  {records.length === 0 && (
                    <tr>
                      <td colSpan={6} className="px-5 py-8 text-center text-muted-foreground text-sm">No records found for this month.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="p-5">
              <div className="grid grid-cols-7 gap-1 mb-2">
                {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(d => (
                  <div key={d} className="text-xs text-center font-semibold text-muted-foreground py-2">{d}</div>
                ))}
              </div>
              <div className="grid grid-cols-7 gap-1">
                {calendarDays.map((item, i) => (
                  <div key={i} className={`aspect-square rounded-lg flex flex-col items-center justify-center text-xs relative ${item.day ? 'border border-border hover:shadow-sm' : ''} ${item.record ? '' : 'bg-secondary/30'}`}>
                    {item.day && (
                      <>
                        <span className="text-foreground font-medium">{item.day}</span>
                        {item.record && (
                          <span className={`absolute bottom-1.5 w-1.5 h-1.5 rounded-full ${statusColor[item.record.status]}`} />
                        )}
                      </>
                    )}
                  </div>
                ))}
              </div>
              <div className="flex items-center gap-4 mt-4 pt-4 border-t border-border">
                {(Object.entries(statusColor) as [AttendanceStatus, string][]).map(([s, c]) => (
                  <div key={s} className="flex items-center gap-1.5 text-xs text-muted-foreground">
                    <span className={`w-2.5 h-2.5 rounded-full ${c}`} />
                    {s}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
