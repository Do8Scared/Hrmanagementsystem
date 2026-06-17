import { useState } from 'react';
import { Pencil, Eye, EyeOff, X, Check, Lock, Camera } from 'lucide-react';
import { employees } from '../../data/mockData';
import { ChangePasswordModal } from '../auth/ChangePasswordModal';

interface GovernmentId {
  label: string;
  key: string;
  value: string;
  masked: string;
}

const GOVT_IDS: GovernmentId[] = [
  { label: 'SSS Number', key: 'sss', value: '34-5678901-2', masked: '**-*****01-2' },
  { label: 'PhilHealth Number', key: 'philhealth', value: '1234-5678-9012', masked: '****-****-9012' },
  { label: 'Pag-IBIG Number', key: 'pagibig', value: '1234-5678-9012', masked: '****-****-9012' },
  { label: 'TIN', key: 'tin', value: '123-456-789-000', masked: '***-***-789-000' },
];

export function MyProfile() {
  const emp = employees.find(e => e.id === 'EMP002')!;

  const [editPersonal, setEditPersonal] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [visibleIds, setVisibleIds] = useState<Record<string, boolean>>({});

  const [personal, setPersonal] = useState({
    name: emp.name,
    birthDate: emp.birthDate,
    gender: emp.gender,
    civilStatus: 'Single',
    phone: emp.phone,
    email: emp.email,
  });
  const [personalDraft, setPersonalDraft] = useState(personal);

  function toggleId(key: string) {
    setVisibleIds(v => ({ ...v, [key]: !v[key] }));
  }

  function savePersonal() {
    setPersonal(personalDraft);
    setEditPersonal(false);
  }

  function cancelPersonal() {
    setPersonalDraft(personal);
    setEditPersonal(false);
  }

  const fieldCls = "w-full px-3 py-2 bg-[#F7F8FA] border border-[#E5E7EB] rounded-lg text-sm text-[#1E2A4A] outline-none focus:border-[#1E2A4A]/40 focus:ring-2 focus:ring-[#1E2A4A]/10 transition-all";

  return (
    <div className="space-y-5">
      {/* Profile Banner */}
      <div
        className="rounded-2xl px-8 py-6 flex items-center gap-6 relative overflow-hidden"
        style={{ background: '#1E2A4A' }}
      >
        {/* Decorative circles */}
        <div className="absolute right-0 top-0 w-56 h-56 rounded-full bg-white/5 -translate-y-1/3 translate-x-1/4 pointer-events-none" />
        <div className="absolute right-32 bottom-0 w-36 h-36 rounded-full bg-white/5 translate-y-1/2 pointer-events-none" />

        {/* Avatar */}
        <div className="relative flex-shrink-0">
          <div className="w-20 h-20 rounded-2xl bg-blue-500 flex items-center justify-center shadow-lg">
            <span className="text-white text-2xl font-bold">{emp.initials}</span>
          </div>
          <button className="absolute -bottom-1 -right-1 w-7 h-7 rounded-full bg-white flex items-center justify-center shadow-md hover:bg-gray-50 transition-colors">
            <Camera size={13} className="text-[#1E2A4A]" />
          </button>
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0">
          <h2 className="text-white font-bold text-2xl leading-tight">{personal.name}</h2>
          <p className="text-white/60 mt-0.5">{emp.position}</p>
          <p className="text-white/40 text-sm mt-1">{emp.department} · {emp.id}</p>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2 z-10">
          <button
            onClick={() => setShowPasswordModal(true)}
            className="flex items-center gap-2 px-4 py-2 rounded-xl border border-white/20 text-white/80 text-sm font-medium hover:bg-white/10 transition-colors"
          >
            <Lock size={15} />
            Change Password
          </button>
          {!editPersonal && (
            <button
              onClick={() => { setPersonalDraft(personal); setEditPersonal(true); }}
              className="flex items-center gap-2 px-4 py-2 rounded-xl border border-white/30 text-white text-sm font-medium hover:bg-white/15 transition-colors"
            >
              <Pencil size={15} />
              Edit Profile
            </button>
          )}
          {editPersonal && (
            <div className="flex gap-2">
              <button
                onClick={cancelPersonal}
                className="flex items-center gap-1.5 px-3 py-2 rounded-xl border border-white/20 text-white/70 text-sm hover:bg-white/10 transition-colors"
              >
                <X size={14} /> Cancel
              </button>
              <button
                onClick={savePersonal}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-500 text-white text-sm font-medium hover:bg-emerald-600 transition-colors"
              >
                <Check size={14} /> Save Changes
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Two-column layout */}
      <div className="grid grid-cols-5 gap-4">
        {/* Left — Personal Information */}
        <div className="col-span-2 bg-white rounded-xl border border-[#E5E7EB] overflow-hidden">
          <div className="flex items-center justify-between px-6 py-4 border-b border-[#F3F4F6]">
            <h3 className="font-semibold text-[#1E2A4A] text-sm">Personal Information</h3>
            {!editPersonal && (
              <button
                onClick={() => { setPersonalDraft(personal); setEditPersonal(true); }}
                className="p-1.5 rounded-lg text-[#9CA3AF] hover:bg-[#F7F8FA] hover:text-[#1E2A4A] transition-colors"
              >
                <Pencil size={14} />
              </button>
            )}
          </div>
          <div className="px-6 py-5 space-y-5">
            {editPersonal ? (
              <>
                <EditField label="Full Name" value={personalDraft.name} onChange={v => setPersonalDraft(d => ({ ...d, name: v }))} cls={fieldCls} />
                <ReadOnlyField label="Employee ID" value={emp.id} />
                <EditField label="Date of Birth" value={personalDraft.birthDate} onChange={v => setPersonalDraft(d => ({ ...d, birthDate: v }))} cls={fieldCls} type="date" />
                <div>
                  <label className="block text-xs font-medium text-[#9CA3AF] mb-1.5">Gender</label>
                  <select value={personalDraft.gender} onChange={e => setPersonalDraft(d => ({ ...d, gender: e.target.value }))} className={fieldCls + ' cursor-pointer'}>
                    <option>Male</option>
                    <option>Female</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-[#9CA3AF] mb-1.5">Civil Status</label>
                  <select value={personalDraft.civilStatus} onChange={e => setPersonalDraft(d => ({ ...d, civilStatus: e.target.value }))} className={fieldCls + ' cursor-pointer'}>
                    {['Single', 'Married', 'Widowed', 'Separated'].map(s => <option key={s}>{s}</option>)}
                  </select>
                </div>
                <EditField label="Contact Number" value={personalDraft.phone} onChange={v => setPersonalDraft(d => ({ ...d, phone: v }))} cls={fieldCls} />
                <EditField label="Personal Email" value={personalDraft.email} onChange={v => setPersonalDraft(d => ({ ...d, email: v }))} cls={fieldCls} type="email" />
              </>
            ) : (
              <>
                <ReadOnlyField label="Full Name" value={personal.name} />
                <ReadOnlyField label="Employee ID" value={emp.id} />
                <ReadOnlyField label="Date of Birth" value={personal.birthDate} />
                <ReadOnlyField label="Gender" value={personal.gender} />
                <ReadOnlyField label="Civil Status" value={personal.civilStatus} />
                <ReadOnlyField label="Contact Number" value={personal.phone} />
                <ReadOnlyField label="Personal Email" value={personal.email} />
              </>
            )}
          </div>
        </div>

        {/* Right — Employment + Government IDs */}
        <div className="col-span-3 space-y-4">
          {/* Employment Details */}
          <div className="bg-white rounded-xl border border-[#E5E7EB] overflow-hidden">
            <div className="flex items-center justify-between px-6 py-4 border-b border-[#F3F4F6]">
              <h3 className="font-semibold text-[#1E2A4A] text-sm">Employment Details</h3>
            </div>
            <div className="px-6 py-5 grid grid-cols-2 gap-x-8 gap-y-5">
              <ReadOnlyField label="Department" value={emp.department} />
              <ReadOnlyField label="Position / Job Title" value={emp.position} />
              <ReadOnlyField label="Employment Type" value="Regular" />
              <ReadOnlyField label="Date Hired" value={emp.joinDate} />
              <ReadOnlyField label="Reporting Supervisor" value="Maria Santos" />
              <ReadOnlyField label="Work Email" value={emp.email} />
            </div>
          </div>

          {/* Government IDs */}
          <div className="bg-white rounded-xl border border-[#E5E7EB] overflow-hidden">
            <div className="flex items-center justify-between px-6 py-4 border-b border-[#F3F4F6]">
              <div>
                <h3 className="font-semibold text-[#1E2A4A] text-sm">Government IDs</h3>
                <p className="text-xs text-[#9CA3AF] mt-0.5">Tap the eye icon to reveal sensitive numbers</p>
              </div>
            </div>
            <div className="px-6 py-5 grid grid-cols-2 gap-x-8 gap-y-5">
              {GOVT_IDS.map(id => (
                <div key={id.key}>
                  <div className="text-xs font-medium text-[#9CA3AF] mb-1.5">{id.label}</div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-[#1E2A4A] font-mono tracking-wide">
                      {visibleIds[id.key] ? id.value : id.masked}
                    </span>
                    <button
                      onClick={() => toggleId(id.key)}
                      className="p-1 rounded-md text-[#9CA3AF] hover:text-[#1E2A4A] hover:bg-[#F7F8FA] transition-colors"
                    >
                      {visibleIds[id.key] ? <EyeOff size={14} /> : <Eye size={14} />}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {showPasswordModal && (
        <ChangePasswordModal onClose={() => setShowPasswordModal(false)} />
      )}
    </div>
  );
}

function ReadOnlyField({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <div className="text-xs font-medium text-[#9CA3AF] mb-1">{label}</div>
      <div className="text-sm font-medium text-[#1E2A4A]">{value}</div>
    </div>
  );
}

function EditField({ label, value, onChange, cls, type = 'text' }: {
  label: string; value: string; onChange: (v: string) => void; cls: string; type?: string;
}) {
  return (
    <div>
      <label className="block text-xs font-medium text-[#9CA3AF] mb-1.5">{label}</label>
      <input type={type} value={value} onChange={e => onChange(e.target.value)} className={cls} />
    </div>
  );
}
