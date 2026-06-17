import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Download } from 'lucide-react';
import { StatusBadge } from '../StatusBadge';
import { useAuth } from '../../../lib/useAuth';
import { supabase } from '../../../lib/supabaseClient';

const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'];

export function MyAttendance() {
  const { user } = useAuth();
  const [year, setYear] = useState(new Date().getFullYear());
  const [month, setMonth] = useState(new Date().getMonth() + 1);
  const [dbRecords, setDbRecords] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchAttendance() {
      if (!user) return;
      setLoading(true);
      
      const empRes = await supabase.from('employees').select('id').eq('email', user.email).single();
      if (!empRes.data) {
        setLoading(false);
        return;
      }
      
      const startDate = `${year}-${String(month).padStart(2, '0')}-01`;
      const endDay = new Date(year, month, 0).getDate();
      const endDate = `${year}-${String(month).padStart(2, '0')}-${String(endDay).padStart(2, '0')}`;

      const { data } = await supabase
        .from('attendance_records')
        .select('*')
        .eq('employee_id', empRes.data.id)
        .gte('date', startDate)
        .lte('date', endDate);
      
      if (data) setDbRecords(data);
      setLoading(false);
    }
    fetchAttendance();
  }, [year, month, user]);

  const daysInMonth = new Date(year, month, 0).getDate();
  const records = [];
  for (let d = 1; d <= daysInMonth; d++) {
    const dow = new Date(year, month - 1, d).getDay();
    if (dow === 0 || dow === 6) continue; // Skip weekends
    
    const dateStr = `${year}-${String(month).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
    const existing = dbRecords.find(r => r.date === dateStr);
    
    if (existing) {
      records.push({
        id: existing.id,
        date: existing.date,
        timeIn: existing.time_in,
        timeOut: existing.time_out,
        totalHours: existing.total_hours,
        status: existing.status
      });
    } else {
      records.push({
        id: `empty-${dateStr}`,
        date: dateStr,
        timeIn: null,
        timeOut: null,
        totalHours: null,
        status: new Date(dateStr) < new Date() ? 'Absent' : 'Pending'
      });
    }
  }

  const present = records.filter(r => r.status === 'Present').length;
  const late = records.filter(r => r.status === 'Late').length;
  const absent = records.filter(r => r.status === 'Absent').length;
  const undertime = records.filter(r => r.status === 'Undertime').length;
  const totalHours = records.reduce((s, r) => s + (r.totalHours ?? 0), 0);

  const prevMonth = () => {
    if (month === 1) { setMonth(12); setYear(y => y - 1); }
    else setMonth(m => m - 1);
  };
  const nextMonth = () => {
    if (month === 12) { setMonth(1); setYear(y => y + 1); }
    else setMonth(m => m + 1);
  };

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3 bg-card rounded-xl border border-border px-4 py-2">
          <button onClick={prevMonth} className="text-muted-foreground hover:text-foreground transition-colors p-1"><ChevronLeft size={16} /></button>
          <span className="font-semibold text-foreground w-40 text-center">{MONTHS[month - 1]} {year}</span>
          <button onClick={nextMonth} className="text-muted-foreground hover:text-foreground transition-colors p-1"><ChevronRight size={16} /></button>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 rounded-lg border border-border text-sm text-muted-foreground hover:bg-secondary transition-colors">
          <Download size={15} /> Download Report
        </button>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-5 gap-3">
        {[
          { label: 'Work Days', value: records.length, color: 'text-foreground', bg: 'bg-card' },
          { label: 'Present', value: present, color: 'text-emerald-700', bg: 'bg-emerald-50 border-emerald-100' },
          { label: 'Late', value: late, color: 'text-amber-700', bg: 'bg-amber-50 border-amber-100' },
          { label: 'Absent', value: absent, color: 'text-red-700', bg: 'bg-red-50 border-red-100' },
          { label: 'Total Hours', value: `${totalHours.toFixed(1)}h`, color: 'text-primary', bg: 'bg-blue-50 border-blue-100' },
        ].map(s => (
          <div key={s.label} className={`rounded-xl border p-4 ${s.bg}`}>
            <div className={`text-xl font-bold ${s.color}`}>{s.value}</div>
            <div className="text-xs text-muted-foreground mt-0.5">{s.label}</div>
          </div>
        ))}
      </div>

      {/* Table */}
      <div className="bg-card rounded-xl border border-border overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-muted-foreground">Loading attendance...</div>
        ) : (
          <table className="w-full">
            <thead>
              <tr className="border-b border-border bg-secondary/40">
                {['Date', 'Day', 'Time In', 'Time Out', 'Total Hours', 'Status', 'Remarks'].map(col => (
                  <th key={col} className="text-left text-xs font-semibold text-muted-foreground px-5 py-3">{col}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {records.map((r, i) => {
                const d = new Date(r.date);
                const dayName = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][d.getDay()];
                return (
                  <tr
                    key={r.id}
                    className={`border-b border-border/50 transition-colors ${
                      r.status === 'Absent' ? 'bg-red-50/40' :
                      r.status === 'Late' ? 'bg-amber-50/40' :
                      r.status === 'Undertime' ? 'bg-orange-50/40' :
                      i % 2 !== 0 ? 'bg-secondary/10' : ''
                    }`}
                  >
                    <td className="px-5 py-3 text-sm text-foreground font-medium">{r.date}</td>
                    <td className="px-5 py-3 text-sm text-muted-foreground">{dayName}</td>
                    <td className="px-5 py-3 text-sm text-foreground">{r.timeIn ?? '—'}</td>
                    <td className="px-5 py-3 text-sm text-foreground">{r.timeOut ?? '—'}</td>
                    <td className="px-5 py-3 text-sm text-foreground">
                      {r.totalHours ? `${r.totalHours.toFixed(2)} hrs` : '—'}
                    </td>
                    <td className="px-5 py-3">
                      {r.status === 'Pending' ? <span className="text-xs text-muted-foreground">Pending</span> : <StatusBadge status={r.status} />}
                    </td>
                    <td className="px-5 py-3 text-xs text-muted-foreground">
                      {r.status === 'Late' ? 'Deducted from salary' :
                       r.status === 'Absent' ? 'No pay for this day' :
                       r.status === 'Undertime' ? 'Partial deduction' : ''}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
