import { useState } from 'react';
import { Search, Plus, Eye, Pencil, Trash2, X, ChevronLeft, Filter, Download } from 'lucide-react';
import { employees as initialEmployees, type Employee } from '../../data/mockData';
import { StatusBadge } from '../StatusBadge';
import { type Page } from '../Layout';

interface Props {
  onNavigate: (page: Page, data?: unknown) => void;
  profileEmployee?: Employee | null;
}

const departments = ['All', 'Engineering', 'Marketing', 'Finance', 'Human Resources', 'Operations', 'Sales', 'Design'];

const EMPTY_FORM = {
  name: '', email: '', phone: '', department: 'Engineering', position: '',
  gender: 'Male', birthDate: '', joinDate: '', salary: '', address: '', emergencyContact: '',
};

export function EmployeeManagement({ onNavigate, profileEmployee }: Props) {
  const [employees, setEmployees] = useState(initialEmployees);
  const [search, setSearch] = useState('');
  const [deptFilter, setDeptFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');
  const [showModal, setShowModal] = useState(false);
  const [editEmployee, setEditEmployee] = useState<Employee | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [page, setPage] = useState(1);
  const PER_PAGE = 8;

  if (profileEmployee) {
    return <EmployeeProfile employee={profileEmployee} onBack={() => onNavigate('employees')} />;
  }

  const filtered = employees.filter(e => {
    const matchSearch = e.name.toLowerCase().includes(search.toLowerCase()) ||
      e.email.toLowerCase().includes(search.toLowerCase()) ||
      e.id.toLowerCase().includes(search.toLowerCase());
    const matchDept = deptFilter === 'All' || e.department === deptFilter;
    const matchStatus = statusFilter === 'All' || e.status === statusFilter;
    return matchSearch && matchDept && matchStatus;
  });

  const totalPages = Math.ceil(filtered.length / PER_PAGE);
  const paginated = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE);

  function openAdd() {
    setEditEmployee(null);
    setForm(EMPTY_FORM);
    setShowModal(true);
  }

  function openEdit(emp: Employee) {
    setEditEmployee(emp);
    setForm({
      name: emp.name, email: emp.email, phone: emp.phone,
      department: emp.department, position: emp.position,
      gender: emp.gender, birthDate: emp.birthDate, joinDate: emp.joinDate,
      salary: String(emp.salary), address: emp.address, emergencyContact: emp.emergencyContact,
    });
    setShowModal(true);
  }

  function handleSave() {
    if (!form.name || !form.email) return;
    if (editEmployee) {
      setEmployees(prev => prev.map(e => e.id === editEmployee.id ? {
        ...e, ...form, salary: Number(form.salary),
        initials: form.name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase(),
      } : e));
    } else {
      const newId = `EMP${String(employees.length + 1).padStart(3, '0')}`;
      setEmployees(prev => [...prev, {
        id: newId, status: 'Active', ...form, salary: Number(form.salary),
        initials: form.name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase(),
      }]);
    }
    setShowModal(false);
  }

  function handleDelete(id: string) {
    setEmployees(prev => prev.filter(e => e.id !== id));
    setDeleteId(null);
  }

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-semibold text-foreground">All Employees</h2>
          <p className="text-xs text-muted-foreground mt-0.5">{filtered.length} employees found</p>
        </div>
        <div className="flex items-center gap-2">
          <button className="flex items-center gap-2 px-3 py-2 rounded-lg border border-border text-sm text-muted-foreground hover:bg-secondary transition-colors">
            <Download size={15} /> Export
          </button>
          <button
            onClick={openAdd}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-white text-sm font-medium hover:bg-primary/90 transition-colors"
          >
            <Plus size={15} /> Add Employee
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-card rounded-xl border border-border p-4 flex items-center gap-3 flex-wrap">
        <div className="relative flex-1 min-w-48">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input
            value={search}
            onChange={e => { setSearch(e.target.value); setPage(1); }}
            placeholder="Search by name, email, or ID..."
            className="w-full pl-9 pr-4 py-2 bg-secondary rounded-lg text-sm border-0 outline-none focus:ring-2 focus:ring-accent/30 text-foreground placeholder:text-muted-foreground"
          />
        </div>
        <div className="flex items-center gap-2">
          <Filter size={14} className="text-muted-foreground" />
          <select
            value={deptFilter}
            onChange={e => { setDeptFilter(e.target.value); setPage(1); }}
            className="px-3 py-2 bg-secondary rounded-lg text-sm border-0 outline-none text-foreground cursor-pointer"
          >
            {departments.map(d => <option key={d}>{d}</option>)}
          </select>
          <select
            value={statusFilter}
            onChange={e => { setStatusFilter(e.target.value); setPage(1); }}
            className="px-3 py-2 bg-secondary rounded-lg text-sm border-0 outline-none text-foreground cursor-pointer"
          >
            {['All', 'Active', 'On Leave', 'Inactive'].map(s => <option key={s}>{s}</option>)}
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="bg-card rounded-xl border border-border overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border bg-secondary/40">
              {['Employee', 'Department', 'Position', 'Join Date', 'Status', 'Actions'].map(col => (
                <th key={col} className="text-left text-xs font-semibold text-muted-foreground px-5 py-3.5">{col}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {paginated.map((emp, i) => (
              <tr key={emp.id} className={`border-b border-border/50 hover:bg-secondary/20 transition-colors ${i % 2 === 0 ? '' : 'bg-secondary/10'}`}>
                <td className="px-5 py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-primary flex items-center justify-center flex-shrink-0">
                      <span className="text-white text-xs font-semibold">{emp.initials}</span>
                    </div>
                    <div>
                      <div className="text-sm font-medium text-foreground">{emp.name}</div>
                      <div className="text-xs text-muted-foreground">{emp.id} · {emp.email}</div>
                    </div>
                  </div>
                </td>
                <td className="px-5 py-4 text-sm text-foreground">{emp.department}</td>
                <td className="px-5 py-4 text-sm text-muted-foreground">{emp.position}</td>
                <td className="px-5 py-4 text-sm text-muted-foreground">{emp.joinDate}</td>
                <td className="px-5 py-4"><StatusBadge status={emp.status} /></td>
                <td className="px-5 py-4">
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => onNavigate('employee-profile', emp)}
                      className="p-1.5 rounded-lg text-muted-foreground hover:bg-secondary hover:text-accent transition-colors"
                      title="View Profile"
                    >
                      <Eye size={15} />
                    </button>
                    <button
                      onClick={() => openEdit(emp)}
                      className="p-1.5 rounded-lg text-muted-foreground hover:bg-amber-50 hover:text-amber-600 transition-colors"
                      title="Edit"
                    >
                      <Pencil size={15} />
                    </button>
                    <button
                      onClick={() => setDeleteId(emp.id)}
                      className="p-1.5 rounded-lg text-muted-foreground hover:bg-red-50 hover:text-red-600 transition-colors"
                      title="Delete"
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {paginated.length === 0 && (
              <tr>
                <td colSpan={6} className="px-5 py-12 text-center text-muted-foreground text-sm">No employees found.</td>
              </tr>
            )}
          </tbody>
        </table>
        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between px-5 py-3 border-t border-border">
            <p className="text-xs text-muted-foreground">
              Showing {(page - 1) * PER_PAGE + 1}–{Math.min(page * PER_PAGE, filtered.length)} of {filtered.length}
            </p>
            <div className="flex items-center gap-1">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
                <button
                  key={p}
                  onClick={() => setPage(p)}
                  className={`w-8 h-8 rounded-lg text-xs font-medium transition-colors ${p === page ? 'bg-primary text-white' : 'text-muted-foreground hover:bg-secondary'}`}
                >
                  {p}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Add/Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm" onClick={() => setShowModal(false)}>
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between px-6 py-5 border-b border-border">
              <h3 className="font-semibold text-foreground">{editEmployee ? 'Edit Employee' : 'Add New Employee'}</h3>
              <button onClick={() => setShowModal(false)} className="p-1.5 rounded-lg hover:bg-secondary text-muted-foreground transition-colors">
                <X size={18} />
              </button>
            </div>
            <div className="p-6 space-y-5">
              <Section title="Personal Information">
                <Field label="Full Name" value={form.name} onChange={v => setForm(f => ({ ...f, name: v }))} placeholder="e.g. Maria Santos" />
                <div className="grid grid-cols-2 gap-4">
                  <Field label="Gender" value={form.gender} onChange={v => setForm(f => ({ ...f, gender: v }))} type="select" options={['Male', 'Female']} />
                  <Field label="Date of Birth" value={form.birthDate} onChange={v => setForm(f => ({ ...f, birthDate: v }))} type="date" />
                </div>
                <Field label="Address" value={form.address} onChange={v => setForm(f => ({ ...f, address: v }))} placeholder="Full home address" />
              </Section>
              <Section title="Employment Details">
                <div className="grid grid-cols-2 gap-4">
                  <Field label="Department" value={form.department} onChange={v => setForm(f => ({ ...f, department: v }))} type="select" options={departments.slice(1)} />
                  <Field label="Position / Job Title" value={form.position} onChange={v => setForm(f => ({ ...f, position: v }))} placeholder="e.g. Software Engineer" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <Field label="Date Hired" value={form.joinDate} onChange={v => setForm(f => ({ ...f, joinDate: v }))} type="date" />
                  <Field label="Basic Salary (₱)" value={form.salary} onChange={v => setForm(f => ({ ...f, salary: v }))} placeholder="e.g. 55000" type="number" />
                </div>
              </Section>
              <Section title="Contact Information">
                <div className="grid grid-cols-2 gap-4">
                  <Field label="Email Address" value={form.email} onChange={v => setForm(f => ({ ...f, email: v }))} placeholder="name@company.ph" type="email" />
                  <Field label="Phone Number" value={form.phone} onChange={v => setForm(f => ({ ...f, phone: v }))} placeholder="+63 9XX XXX XXXX" />
                </div>
                <Field label="Emergency Contact" value={form.emergencyContact} onChange={v => setForm(f => ({ ...f, emergencyContact: v }))} placeholder="Name — Phone Number" />
              </Section>
            </div>
            <div className="flex justify-end gap-3 px-6 pb-5">
              <button onClick={() => setShowModal(false)} className="px-4 py-2 rounded-lg text-sm text-muted-foreground hover:bg-secondary transition-colors">Cancel</button>
              <button onClick={handleSave} className="px-5 py-2 rounded-lg bg-primary text-white text-sm font-medium hover:bg-primary/90 transition-colors">
                {editEmployee ? 'Save Changes' : 'Add Employee'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirm */}
      {deleteId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl p-6 w-full max-w-sm mx-4">
            <h3 className="font-semibold text-foreground mb-2">Delete Employee?</h3>
            <p className="text-sm text-muted-foreground mb-5">This action cannot be undone. The employee record will be permanently removed.</p>
            <div className="flex gap-3">
              <button onClick={() => setDeleteId(null)} className="flex-1 px-4 py-2 rounded-lg border border-border text-sm text-foreground hover:bg-secondary transition-colors">Cancel</button>
              <button onClick={() => handleDelete(deleteId)} className="flex-1 px-4 py-2 rounded-lg bg-destructive text-white text-sm font-medium hover:bg-destructive/90 transition-colors">Delete</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3 pb-2 border-b border-border">{title}</h4>
      <div className="space-y-3">{children}</div>
    </div>
  );
}

function Field({ label, value, onChange, placeholder = '', type = 'text', options = [] }: {
  label: string; value: string; onChange: (v: string) => void;
  placeholder?: string; type?: string; options?: string[];
}) {
  const cls = "w-full px-3 py-2.5 bg-input-background rounded-lg border border-border text-sm text-foreground outline-none focus:ring-2 focus:ring-accent/30 transition-all";
  return (
    <div>
      <label className="block text-xs font-medium text-foreground mb-1.5">{label}</label>
      {type === 'select' ? (
        <select value={value} onChange={e => onChange(e.target.value)} className={cls + ' cursor-pointer'}>
          {options.map(o => <option key={o}>{o}</option>)}
        </select>
      ) : (
        <input type={type} value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder} className={cls} />
      )}
    </div>
  );
}

function EmployeeProfile({ employee, onBack }: { employee: Employee; onBack: () => void }) {
  const infoGroups = [
    {
      title: 'Personal Information',
      items: [
        { label: 'Full Name', value: employee.name },
        { label: 'Gender', value: employee.gender },
        { label: 'Date of Birth', value: employee.birthDate },
        { label: 'Address', value: employee.address },
      ],
    },
    {
      title: 'Employment Details',
      items: [
        { label: 'Employee ID', value: employee.id },
        { label: 'Department', value: employee.department },
        { label: 'Position', value: employee.position },
        { label: 'Date Hired', value: employee.joinDate },
        { label: 'Basic Salary', value: `₱${employee.salary.toLocaleString()}` },
        { label: 'Status', value: employee.status },
      ],
    },
    {
      title: 'Contact Information',
      items: [
        { label: 'Email Address', value: employee.email },
        { label: 'Phone Number', value: employee.phone },
        { label: 'Emergency Contact', value: employee.emergencyContact },
      ],
    },
  ];

  return (
    <div className="space-y-5">
      <button onClick={onBack} className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
        <ChevronLeft size={16} /> Back to Employee List
      </button>
      <div className="bg-card rounded-xl border border-border p-6 flex items-center gap-6">
        <div className="w-20 h-20 rounded-2xl bg-primary flex items-center justify-center flex-shrink-0">
          <span className="text-white text-2xl font-bold">{employee.initials}</span>
        </div>
        <div>
          <h2 className="font-bold text-foreground text-xl">{employee.name}</h2>
          <p className="text-muted-foreground">{employee.position} · {employee.department}</p>
          <p className="text-xs text-muted-foreground mt-1">{employee.id} · Hired {employee.joinDate}</p>
          <div className="mt-2">
            <StatusBadge status={employee.status} size="md" />
          </div>
        </div>
      </div>
      <div className="grid grid-cols-3 gap-4">
        {infoGroups.map(group => (
          <div key={group.title} className="bg-card rounded-xl border border-border p-5">
            <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-4">{group.title}</h4>
            <div className="space-y-3">
              {group.items.map(item => (
                <div key={item.label}>
                  <div className="text-xs text-muted-foreground">{item.label}</div>
                  <div className="text-sm font-medium text-foreground mt-0.5">{item.value}</div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
