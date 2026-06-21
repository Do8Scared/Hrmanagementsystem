import { useState } from 'react';
import { X, Download, Printer, CheckCircle2 } from 'lucide-react';
import { payrollRecords, type PayrollRecord } from '../../data/mockData';
import { StatusBadge } from '../StatusBadge';

const fmt = (n: number) => `₱${n.toLocaleString('en-PH', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

export function PayrollManagement() {
  const [records, setRecords] = useState(payrollRecords);
  const [selectedPayslip, setSelectedPayslip] = useState<PayrollRecord | null>(null);
  const [processAll, setProcessAll] = useState(false);

  const totalNetPay = records.reduce((s, r) => s + r.netPay, 0);
  const pending = records.filter(r => r.status === 'Pending').length;

  function handleProcess(id: string) {
    setRecords(prev => prev.map(r => r.id === id ? { ...r, status: 'Processed' } : r));
  }

  function handleProcessAll() {
    setRecords(prev => prev.map(r => ({ ...r, status: 'Processed' })));
    setProcessAll(false);
  }

  return (
    <div className="space-y-5">
      {/* Summary */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-card rounded-xl border border-border p-5">
          <div className="text-xs text-muted-foreground mb-1">Total Net Payroll</div>
          <div className="text-2xl font-bold text-foreground">{fmt(totalNetPay)}</div>
          <div className="text-xs text-muted-foreground mt-1">June 2026 · 9 employees</div>
        </div>
        <div className="bg-card rounded-xl border border-border p-5">
          <div className="text-xs text-muted-foreground mb-1">Pending Processing</div>
          <div className="text-2xl font-bold text-amber-600">{pending}</div>
          <div className="text-xs text-muted-foreground mt-1">employees awaiting payroll run</div>
        </div>
        <div className="bg-card rounded-xl border border-border p-5">
          <div className="text-xs text-muted-foreground mb-1">Total Deductions</div>
          <div className="text-2xl font-bold text-foreground">
            {fmt(records.reduce((s, r) => s + r.totalDeductions, 0))}
          </div>
          <div className="text-xs text-muted-foreground mt-1">SSS + PhilHealth + Pag-IBIG + Tax</div>
        </div>
      </div>

      {/* Table */}
      <div className="bg-card rounded-xl border border-border overflow-hidden">
        <div className="flex items-center justify-between px-5 py-4 border-b border-border">
          <div>
            <h3 className="font-semibold text-foreground">Payroll — June 2026</h3>
            <p className="text-xs text-muted-foreground mt-0.5">Pay period: June 1–30, 2026</p>
          </div>
          <div className="flex items-center gap-2">
            <button className="flex items-center gap-1.5 px-3 py-2 rounded-lg border border-border text-sm text-muted-foreground hover:bg-secondary transition-colors">
              <Download size={15} /> Export CSV
            </button>
            {pending > 0 && (
              <button
                onClick={() => setProcessAll(true)}
                className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-primary text-white text-sm font-medium hover:bg-primary/90 transition-colors"
              >
                <CheckCircle2 size={15} /> Process All
              </button>
            )}
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border bg-secondary/40">
                {['Employee', 'Basic Salary', 'Overtime', 'Gross Pay', 'SSS', 'PhilHealth', 'Pag-IBIG', 'Tax', 'Net Pay', 'Status', 'Actions'].map(col => (
                  <th key={col} className="text-left text-xs font-semibold text-muted-foreground px-4 py-3 whitespace-nowrap">{col}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {records.map((r, i) => (
                <tr key={r.id} className={`border-b border-border/50 hover:bg-secondary/20 transition-colors ${i % 2 === 0 ? '' : 'bg-secondary/10'}`}>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center flex-shrink-0">
                        <span className="text-white text-xs font-semibold">
                          {r.employeeName.split(' ').map(n => n[0]).join('').slice(0, 2)}
                        </span>
                      </div>
                      <div>
                        <div className="text-xs font-medium text-foreground whitespace-nowrap">{r.employeeName}</div>
                        <div className="text-xs text-muted-foreground">{r.department}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-xs text-foreground">{fmt(r.basicSalary)}</td>
                  <td className="px-4 py-3 text-xs text-emerald-600">{r.overtime > 0 ? fmt(r.overtime) : '—'}</td>
                  <td className="px-4 py-3 text-xs font-medium text-foreground">{fmt(r.grossPay)}</td>
                  <td className="px-4 py-3 text-xs text-red-500">{fmt(r.sss)}</td>
                  <td className="px-4 py-3 text-xs text-red-500">{fmt(r.philhealth)}</td>
                  <td className="px-4 py-3 text-xs text-red-500">{fmt(r.pagibig)}</td>
                  <td className="px-4 py-3 text-xs text-red-500">{fmt(r.tax)}</td>
                  <td className="px-4 py-3 text-xs font-bold text-primary">{fmt(r.netPay)}</td>
                  <td className="px-4 py-3"><StatusBadge status={r.status} /></td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => setSelectedPayslip(r)}
                        className="px-2.5 py-1 rounded-md text-xs text-accent border border-accent/30 hover:bg-secondary transition-colors"
                      >
                        View Payslip
                      </button>
                      {r.status === 'Pending' && (
                        <button
                          onClick={() => handleProcess(r.id)}
                          className="px-2.5 py-1 rounded-md text-xs text-emerald-700 border border-emerald-200 hover:bg-emerald-50 transition-colors"
                        >
                          Process
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Payslip Modal */}
      {selectedPayslip && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm" onClick={() => setSelectedPayslip(null)}>
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg mx-4 overflow-hidden" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between px-6 py-4 border-b border-border">
              <div className="flex items-center gap-2 text-muted-foreground">
                <Printer size={16} />
                <span className="text-sm">Payslip</span>
              </div>
              <button onClick={() => setSelectedPayslip(null)} className="p-1.5 rounded-lg hover:bg-secondary text-muted-foreground transition-colors"><X size={18} /></button>
            </div>
            <div className="p-6">
              {/* Company Header */}
              <div className="text-center pb-5 border-b border-border">
                <div className="w-12 h-12 rounded-xl bg-primary flex items-center justify-center mx-auto mb-2">
                  <span className="text-white font-bold text-lg">H</span>
                </div>
                <h3 className="font-bold text-foreground text-lg">Corazon Travel and Tours</h3>
                <p className="text-xs text-muted-foreground">BGC Corporate Center, Taguig City, Philippines</p>
                <p className="text-xs text-muted-foreground">TIN: 123-456-789-000</p>
              </div>
              {/* Pay Period */}
              <div className="flex justify-between items-center py-4 border-b border-border">
                <div>
                  <div className="text-xs text-muted-foreground">Employee</div>
                  <div className="text-sm font-semibold text-foreground">{selectedPayslip.employeeName}</div>
                  <div className="text-xs text-muted-foreground">{selectedPayslip.department}</div>
                </div>
                <div className="text-right">
                  <div className="text-xs text-muted-foreground">Pay Period</div>
                  <div className="text-sm font-semibold text-foreground">{selectedPayslip.period}</div>
                  <StatusBadge status={selectedPayslip.status} />
                </div>
              </div>
              {/* Earnings */}
              <div className="py-4 border-b border-border space-y-2">
                <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Earnings</div>
                <PayslipRow label="Basic Salary" value={selectedPayslip.basicSalary} />
                {selectedPayslip.overtime > 0 && <PayslipRow label="Overtime Pay" value={selectedPayslip.overtime} positive />}
                <div className="flex justify-between pt-2 border-t border-dashed border-border">
                  <span className="text-xs font-semibold text-foreground">Gross Pay</span>
                  <span className="text-xs font-bold text-foreground">{fmt(selectedPayslip.grossPay)}</span>
                </div>
              </div>
              {/* Deductions */}
              <div className="py-4 border-b border-border space-y-2">
                <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Deductions</div>
                <PayslipRow label="SSS Contribution" value={selectedPayslip.sss} deduction />
                <PayslipRow label="PhilHealth Contribution" value={selectedPayslip.philhealth} deduction />
                <PayslipRow label="Pag-IBIG Contribution" value={selectedPayslip.pagibig} deduction />
                <PayslipRow label="Withholding Tax" value={selectedPayslip.tax} deduction />
                <div className="flex justify-between pt-2 border-t border-dashed border-border">
                  <span className="text-xs font-semibold text-foreground">Total Deductions</span>
                  <span className="text-xs font-bold text-red-600">{fmt(selectedPayslip.totalDeductions)}</span>
                </div>
              </div>
              {/* Net Pay */}
              <div className="flex justify-between items-center py-4 bg-primary rounded-xl px-4 mt-4">
                <span className="text-sm font-bold text-white">NET PAY</span>
                <span className="text-xl font-bold text-white">{fmt(selectedPayslip.netPay)}</span>
              </div>
              <p className="text-center text-xs text-muted-foreground mt-4">This is a computer-generated document. No signature required.</p>
            </div>
            <div className="flex gap-3 px-6 pb-5">
              <button className="flex-1 flex items-center justify-center gap-2 py-2 rounded-lg border border-border text-sm text-muted-foreground hover:bg-secondary transition-colors">
                <Download size={15} /> Download PDF
              </button>
              <button className="flex-1 flex items-center justify-center gap-2 py-2 rounded-lg border border-border text-sm text-muted-foreground hover:bg-secondary transition-colors">
                <Printer size={15} /> Print
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Process All Confirm */}
      {processAll && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl p-6 w-full max-w-sm mx-4">
            <h3 className="font-semibold text-foreground mb-2">Process All Payroll?</h3>
            <p className="text-sm text-muted-foreground mb-5">This will mark all {pending} pending payroll records as Processed. Total: {fmt(totalNetPay)}</p>
            <div className="flex gap-3">
              <button onClick={() => setProcessAll(false)} className="flex-1 py-2 rounded-lg border border-border text-sm text-foreground hover:bg-secondary">Cancel</button>
              <button onClick={handleProcessAll} className="flex-1 py-2 rounded-lg bg-primary text-white text-sm font-medium hover:bg-primary/90">Confirm</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function PayslipRow({ label, value, deduction, positive }: { label: string; value: number; deduction?: boolean; positive?: boolean }) {
  return (
    <div className="flex justify-between items-center">
      <span className="text-xs text-muted-foreground">{label}</span>
      <span className={`text-xs font-medium ${deduction ? 'text-red-500' : positive ? 'text-emerald-600' : 'text-foreground'}`}>
        {deduction ? `(${fmt(value)})` : fmt(value)}
      </span>
    </div>
  );
}
