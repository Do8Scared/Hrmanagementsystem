import { useState } from 'react';
import { Pencil, Eye, EyeOff, X, Check, Lock, Camera } from 'lucide-react';
import { employees } from '../../data/mockData';
import { ChangePasswordModal } from '../auth/ChangePasswordModal';

const GOVT_IDS = [
  { label: 'SSS Number',       key: 'sss',       value: '34-5678901-2',    masked: '**-*****01-2'    },
  { label: 'PhilHealth Number', key: 'philhealth', value: '1234-5678-9012', masked: '****-****-9012'  },
  { label: 'Pag-IBIG Number',  key: 'pagibig',   value: '1234-5678-9012',  masked: '****-****-9012'  },
  { label: 'TIN',              key: 'tin',        value: '123-456-789-000', masked: '***-***-789-000' },
];

const fieldCls = 'w-full px-3 py-2 bg-input-background border border-border rounded-lg text-sm text-foreground outline-none focus:border-accent focus:ring-2 focus:ring-accent/20 transition-all';

export function MyProfile() {
  const emp = employees.find(e => e.id === 'EMP002')!;
  const [editPersonal, setEditPersonal] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [visibleIds, setVisibleIds] = useState<Record<string, boolean>>({});
  const [personal, setPersonal] = useState({
    name: emp.name, birthDate: emp.birthDate, gender: emp.gender,
    civilStatus: 'Single', phone: emp.phone, email: emp.email,
  });
  const [draft, setDraft] = useState(personal);

  function save() { setPersonal(draft); setEditPersonal(false); }
  function cancel() { setDraft(personal); setEditPersonal(false); }

  return (
    <div className="space-y-5">
      {/* Banner */}
      <div className="rounded-2xl px-8 py-6 flex items-center gap-6 relative overflow-hidden"
        style={{ background: 'linear-gradient(135deg, var(--sidebar) 0%, #5A0D10 100%)' }}>
        <div className="absolute right-0 top-0 w-56 h-56 rounded-full bg-white/5 -translate-y-1/3 translate-x-1/4 pointer-events-none" />
        <div className="absolute right-32 bottom-0 w-36 h-36 rounded-full bg-white/5 translate-y-1/2 pointer-events-none" />
        {/* Gold top bar */}
        <div className="absolute top-0 left-0 right-0 h-1" style={{ background: 'var(--sidebar-primary)' }} />

        <div className="relative flex-shrink-0">
          <div className="w-20 h-20 rounded-2xl flex items-center justify-center shadow-lg"
            style={{ background: 'var(--sidebar-primary)' }}>
            <span className="text-2xl font-bold" style={{ color: 'var(--sidebar-primary-foreground)' }}>{emp.initials}</span>
          </div>
          <button className="absolute -bottom-1 -right-1 w-7 h-7 rounded-full bg-white flex items-center justify-center shadow-md hover:bg-secondary transition-colors">
            <Camera size={13} className="text-primary" />
          </button>
        </div>

        <div className="flex-1 min-w-0">
          <h2 className="text-white font-bold text-2xl leading-tight">{personal.name}</h2>
          <p className="text-white/60 mt-0.5">{emp.position}</p>
          <p className="text-white/40 text-sm mt-1">{emp.department} · {emp.id}</p>
        </div>

        <div className="flex items-center gap-2 z-10">
          <button onClick={() => setShowPasswordModal(true)}
            className="flex items-center gap-2 px-4 py-2 rounded-xl border border-white/20 text-white/80 text-sm font-semibold hover:bg-white/10 transition-colors">
            <Lock size={15} /> Change Password
          </button>
          {!editPersonal && (
            <button onClick={() => { setDraft(personal); setEditPersonal(true); }}
              className="flex items-center gap-2 px-4 py-2 rounded-xl border border-white/30 text-white text-sm font-semibold hover:bg-white/15 transition-colors">
              <Pencil size={15} /> Edit Profile
            </button>
          )}
          {editPersonal && (
            <div className="flex gap-2">
              <button onClick={cancel} className="flex items-center gap-1.5 px-3 py-2 rounded-xl border border-white/20 text-white/70 text-sm hover:bg-white/10 transition-colors">
                <X size={14} /> Cancel
              </button>
              <button onClick={save} className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-500 text-white text-sm font-semibold hover:bg-emerald-600 transition-colors">
                <Check size={14} /> Save Changes
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-5 gap-4">
        {/* Personal Info */}
        <div className="col-span-2 bg-card rounded-xl border border-border overflow-hidden">
          <div className="flex items-center justify-between px-6 py-4 border-b border-border">
            <h3 className="font-bold text-foreground text-sm">Personal Information</h3>
            {!editPersonal && (
              <button onClick={() => { setDraft(personal); setEditPersonal(true); }}
                className="p-1.5 rounded-lg text-muted-foreground hover:bg-secondary hover:text-foreground transition-colors">
                <Pencil size={14} />
              </button>
            )}
          </div>
          <div className="px-6 py-5 space-y-5">
            {editPersonal ? (
              <>
                <EF label="Full Name" value={draft.name} onChange={v => setDraft(d => ({ ...d, name: v }))} />
                <RF label="Employee ID" value={emp.id} />
                <EF label="Date of Birth" value={draft.birthDate} onChange={v => setDraft(d => ({ ...d, birthDate: v }))} type="date" />
                <div>
                  <label className="block text-xs font-semibold text-muted-foreground mb-1.5">Gender</label>
                  <select value={draft.gender} onChange={e => setDraft(d => ({ ...d, gender: e.target.value }))} className={fieldCls + ' cursor-pointer'}>
                    <option>Male</option><option>Female</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-muted-foreground mb-1.5">Civil Status</label>
                  <select value={draft.civilStatus} onChange={e => setDraft(d => ({ ...d, civilStatus: e.target.value }))} className={fieldCls + ' cursor-pointer'}>
                    {['Single','Married','Widowed','Separated'].map(s => <option key={s}>{s}</option>)}
                  </select>
                </div>
                <EF label="Contact Number" value={draft.phone} onChange={v => setDraft(d => ({ ...d, phone: v }))} />
                <EF label="Personal Email" value={draft.email} onChange={v => setDraft(d => ({ ...d, email: v }))} type="email" />
              </>
            ) : (
              <>
                <RF label="Full Name" value={personal.name} />
                <RF label="Employee ID" value={emp.id} />
                <RF label="Date of Birth" value={personal.birthDate} />
                <RF label="Gender" value={personal.gender} />
                <RF label="Civil Status" value={personal.civilStatus} />
                <RF label="Contact Number" value={personal.phone} />
                <RF label="Personal Email" value={personal.email} />
              </>
            )}
          </div>
        </div>

        {/* Right column */}
        <div className="col-span-3 space-y-4">
          <div className="bg-card rounded-xl border border-border overflow-hidden">
            <div className="px-6 py-4 border-b border-border">
              <h3 className="font-bold text-foreground text-sm">Employment Details</h3>
            </div>
            <div className="px-6 py-5 grid grid-cols-2 gap-x-8 gap-y-5">
              <RF label="Department" value={emp.department} />
              <RF label="Position / Job Title" value={emp.position} />
              <RF label="Employment Type" value="Regular" />
              <RF label="Date Hired" value={emp.joinDate} />
              <RF label="Reporting Supervisor" value="Maria Santos" />
              <RF label="Work Email" value={emp.email} />
            </div>
          </div>

          <div className="bg-card rounded-xl border border-border overflow-hidden">
            <div className="px-6 py-4 border-b border-border">
              <h3 className="font-bold text-foreground text-sm">Government IDs</h3>
              <p className="text-xs text-muted-foreground mt-0.5">Tap the eye icon to reveal sensitive numbers</p>
            </div>
            <div className="px-6 py-5 grid grid-cols-2 gap-x-8 gap-y-5">
              {GOVT_IDS.map(id => (
                <div key={id.key}>
                  <div className="text-xs font-semibold text-muted-foreground mb-1.5">{id.label}</div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-semibold text-foreground font-mono tracking-wide">
                      {visibleIds[id.key] ? id.value : id.masked}
                    </span>
                    <button onClick={() => setVisibleIds(v => ({ ...v, [id.key]: !v[id.key] }))}
                      className="p-1 rounded-md text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors">
                      {visibleIds[id.key] ? <EyeOff size={14} /> : <Eye size={14} />}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {showPasswordModal && <ChangePasswordModal onClose={() => setShowPasswordModal(false)} />}
    </div>
  );
}

function RF({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <div className="text-xs font-semibold text-muted-foreground mb-1">{label}</div>
      <div className="text-sm font-semibold text-foreground">{value}</div>
    </div>
  );
}

function EF({ label, value, onChange, type = 'text' }: { label: string; value: string; onChange: (v: string) => void; type?: string }) {
  return (
    <div>
      <label className="block text-xs font-semibold text-muted-foreground mb-1.5">{label}</label>
      <input type={type} value={value} onChange={e => onChange(e.target.value)} className={fieldCls} />
    </div>
  );
}
