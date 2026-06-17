import { useState, useEffect } from 'react';
import { X, Download, Printer, ChevronRight } from 'lucide-react';
import { StatusBadge } from '../StatusBadge';
import { useAuth } from '../../../lib/useAuth';
import { supabase } from '../../../lib/supabaseClient';

const fmt = (n: number) => `₱${n.toLocaleString('en-PH', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

export function MyPayslips() {
  const { user } = useAuth();
  const [selected, setSelected] = useState<any | null>(null);
  const [payslips, setPayslips] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      if (!user) return;
      setLoading(true);
      const empRes = await supabase.from('employees').select('id').eq('email', user.email).single();
      if (empRes.data) {
        const payRes = await supabase.from('payroll_records').select('*').eq('employee_id', empRes.data.id).order('period', { ascending: false });
        if (payRes.data) {
          setPayslips(payRes.data);
        }
      }
      setLoading(false);
    }
    fetchData();
  }, [user]);

  if (loading) return <div className="p-8 text-center text-muted-foreground">Loading payslips...</div>;

  const latestPayslip = payslips.length > 0 ? payslips[0] : null;

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-card rounded-xl border border-border p-5">
          <div className="text-xs text-muted-foreground mb-1">Latest Net Pay</div>
          <div className="text-2xl font-bold text-foreground">{latestPayslip ? fmt(latestPayslip.net_pay) : '—'}</div>
          <div className="text-xs text-muted-foreground mt-1">{latestPayslip ? latestPayslip.period : '—'}</div>
        </div>
        <div className="bg-card rounded-xl border border-border p-5">
          <div className="text-xs text-muted-foreground mb-1">Basic Salary</div>
          <div className="text-2xl font-bold text-foreground">{latestPayslip ? fmt(latestPayslip.basic_salary) : '—'}</div>
          <div className="text-xs text-muted-foreground mt-1">{user?.position || '—'}</div>
        </div>
        <div className="bg-card rounded-xl border border-border p-5">
          <div className="text-xs text-muted-foreground mb-1">Total Deductions</div>
          <div className="text-2xl font-bold text-red-500">{latestPayslip ? fmt(latestPayslip.total_deductions) : '—'}</div>
          <div className="text-xs text-muted-foreground mt-1">SSS · PhilHealth · Pag-IBIG · Tax</div>
        </div>
      </div>

      <div className="bg-card rounded-xl border border-border overflow-hidden">
        <div className="px-5 py-4 border-b border-border">
          <h3 className="font-semibold text-foreground">Payslip History</h3>
          <p className="text-xs text-muted-foreground mt-0.5">Click a row to view detailed payslip</p>
        </div>
        <table className="w-full">
          <thead>
            <tr className="border-b border-border bg-secondary/40">
              {['Pay Period', 'Basic Salary', 'Overtime', 'Gross Pay', 'Deductions', 'Net Pay', 'Status', ''].map(col => (
                <th key={col} className="text-left text-xs font-semibold text-muted-foreground px-5 py-3">{col}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {payslips.map((p, i) => (
              <tr
                key={p.id}
                onClick={() => setSelected(p)}
                className={`border-b border-border/50 cursor-pointer hover:bg-secondary/30 transition-colors ${i % 2 !== 0 ? 'bg-secondary/10' : ''}`}
              >
                <td className="px-5 py-4 text-sm font-medium text-foreground">{p.period}</td>
                <td className="px-5 py-4 text-sm text-foreground">{fmt(p.basic_salary)}</td>
                <td className="px-5 py-4 text-sm text-emerald-600">{p.overtime > 0 ? fmt(p.overtime) : '—'}</td>
                <td className="px-5 py-4 text-sm font-medium text-foreground">{fmt(p.gross_pay)}</td>
                <td className="px-5 py-4 text-sm text-red-500">({fmt(p.total_deductions)})</td>
                <td className="px-5 py-4 text-sm font-bold text-primary">{fmt(p.net_pay)}</td>
                <td className="px-5 py-4"><StatusBadge status={p.status} /></td>
                <td className="px-5 py-4 text-muted-foreground"><ChevronRight size={15} /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Payslip Detail Modal */}
      {selected && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm" onClick={() => setSelected(null)}>
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg mx-4" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between px-6 py-4 border-b border-border">
              <span className="text-sm text-muted-foreground font-medium">Payslip Detail</span>
              <button onClick={() => setSelected(null)} className="p-1.5 rounded-lg hover:bg-secondary text-muted-foreground"><X size={18} /></button>
            </div>
            <div className="p-6 space-y-4">
              {/* Header */}
              <div className="text-center pb-4 border-b border-border">
                <div className="w-12 h-12 rounded-xl bg-primary flex items-center justify-center mx-auto mb-2">
                  <span className="text-white font-bold text-lg">H</span>
                </div>
                <h3 className="font-bold text-foreground text-lg">HorizonHR Inc.</h3>
                <p className="text-xs text-muted-foreground">BGC Corporate Center, Taguig City, Philippines</p>
              </div>
              <div className="flex justify-between items-center pb-4 border-b border-border">
                <div>
                  <div className="text-xs text-muted-foreground">Employee</div>
                  <div className="text-sm font-semibold text-foreground">{user?.name || '—'}</div>
                  <div className="text-xs text-muted-foreground">{user?.department || '—'}</div>
                </div>
                <div className="text-right">
                  <div className="text-xs text-muted-foreground">Pay Period</div>
                  <div className="text-sm font-semibold text-foreground">{selected.period}</div>
                  <StatusBadge status={selected.status} />
                </div>
              </div>
              <div className="space-y-1.5 pb-4 border-b border-border">
                <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Earnings</div>
                <Row label="Basic Salary" value={fmt(selected.basic_salary)} />
                {selected.overtime > 0 && <Row label="Overtime Pay" value={`+${fmt(selected.overtime)}`} highlight="text-emerald-600" />}
                <Row label="Gross Pay" value={fmt(selected.gross_pay)} bold />
              </div>
              <div className="space-y-1.5 pb-4 border-b border-border">
                <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Deductions</div>
                <Row label="SSS Contribution" value={`(${fmt(selected.sss)})`} highlight="text-red-500" />
                <Row label="PhilHealth Contribution" value={`(${fmt(selected.philhealth)})`} highlight="text-red-500" />
                <Row label="Pag-IBIG Contribution" value={`(${fmt(selected.pagibig)})`} highlight="text-red-500" />
                <Row label="Withholding Tax" value={`(${fmt(selected.tax)})`} highlight="text-red-500" />
                <Row label="Total Deductions" value={`(${fmt(selected.total_deductions)})`} bold highlight="text-red-600" />
              </div>
              <div className="flex justify-between items-center py-3 px-4 bg-primary rounded-xl">
                <span className="text-sm font-bold text-white">NET PAY</span>
                <span className="text-xl font-bold text-white">{fmt(selected.net_pay)}</span>
              </div>
              <p className="text-center text-xs text-muted-foreground">This is a computer-generated document.</p>
            </div>
            <div className="flex gap-3 px-6 pb-5">
              <button className="flex-1 flex items-center justify-center gap-2 py-2 rounded-lg border border-border text-sm text-muted-foreground hover:bg-secondary transition-colors">
                <Download size={15} /> Download
              </button>
              <button className="flex-1 flex items-center justify-center gap-2 py-2 rounded-lg border border-border text-sm text-muted-foreground hover:bg-secondary transition-colors">
                <Printer size={15} /> Print
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function Row({ label, value, bold, highlight }: { label: string; value: string; bold?: boolean; highlight?: string }) {
  return (
    <div className="flex justify-between text-xs">
      <span className="text-muted-foreground">{label}</span>
      <span className={`${bold ? 'font-semibold' : 'font-medium'} ${highlight ?? 'text-foreground'}`}>{value}</span>
    </div>
  );
}
