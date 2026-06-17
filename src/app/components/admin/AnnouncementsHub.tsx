import { useState } from 'react';
import {
  Plus, ChevronDown, Eye, Pencil, Archive, Download, Bell,
  X, Check, FileText, Megaphone, BookOpen, Send, CheckCircle2, Clock, AlertCircle,
  Bold, Italic, List, Paperclip,
} from 'lucide-react';
import {
  type Announcement, type DocType, type DocStatus, type TargetAudience,
  type AcknowledgementRecord,
} from '../../data/announcementsData';
import { useEffect } from 'react';
import { supabase } from '../../../lib/supabaseClient';

const typeConfig: Record<DocType, { color: string; bg: string; border: string; icon: React.ElementType }> = {
  Advisory: { color: 'text-blue-700', bg: 'bg-blue-50', border: 'border-l-blue-500', icon: Megaphone },
  Memorandum: { color: 'text-purple-700', bg: 'bg-purple-50', border: 'border-l-purple-500', icon: FileText },
  Policy: { color: 'text-emerald-700', bg: 'bg-emerald-50', border: 'border-l-emerald-500', icon: BookOpen },
};

const statusConfig: Record<DocStatus, string> = {
  Published: 'bg-emerald-50 text-emerald-700',
  Draft: 'bg-amber-50 text-amber-700',
  Archived: 'bg-gray-100 text-gray-500',
};

const ackStatusConfig = {
  Read: { icon: CheckCircle2, color: 'text-emerald-600', bg: 'bg-emerald-50', label: 'Read' },
  Unread: { icon: X, color: 'text-red-500', bg: 'bg-red-50', label: 'Unread' },
  Pending: { icon: Clock, color: 'text-amber-600', bg: 'bg-amber-50', label: 'Pending' },
};

const DEPARTMENTS = ['Engineering', 'Marketing', 'Finance', 'Human Resources', 'Operations', 'Sales', 'Design'];

const EMPTY_FORM = {
  type: 'Advisory' as DocType,
  title: '',
  refNumber: 'ADV-2026-003',
  effectivityDate: '',
  targetAudience: 'All Employees' as TargetAudience,
  targetDepartments: [] as string[],
  requiresAcknowledgement: false,
  content: '',
  attachedFile: '',
  status: 'Draft' as DocStatus,
};

type Tab = 'All' | DocType;
type View = 'list' | 'tracker';

export function AnnouncementsHub() {
  const [docs, setDocs] = useState<Announcement[]>([]);
  const [acks, setAcks] = useState<Record<string, AcknowledgementRecord[]>>({});

  useEffect(() => {
    fetchDocs();
  }, []);

  async function fetchDocs() {
    const { data: d } = await supabase.from('announcements').select('*').order('created_at', { ascending: false });
    if (d) {
      // Map DB columns (all lowercase) to TypeScript interface (camelCase)
      const mapped = d.map((row: any) => ({
        id: row.id,
        type: row.type,
        title: row.title,
        refNumber: row.refnumber,
        effectivityDate: row.effectivitydate,
        publishedDate: row.publisheddate,
        publishedBy: row.publishedby,
        targetAudience: row.targetaudience,
        targetDepartments: row.targetdepartments,
        status: row.status,
        content: row.content,
        attachedFile: row.attachedfile,
        requiresAcknowledgement: row.requiresacknowledgement,
        totalRecipients: row.totalrecipients,
        readCount: row.readcount,
      }));
      setDocs(mapped as Announcement[]);
    }
    const { data: a } = await supabase.from('acknowledgements').select('*');
    if (a) {
      const grouped: Record<string, AcknowledgementRecord[]> = {};
      a.forEach((ack: any) => {
        const annId = ack.announcementid;
        if (!grouped[annId]) grouped[annId] = [];
        grouped[annId].push({
          employeeId: ack.employeeid,
          employeeName: ack.employeename,
          department: ack.department,
          role: ack.role,
          dateRead: ack.dateread,
          status: ack.status,
        });
      });
      setAcks(grouped);
    }
  }
  const [tab, setTab] = useState<Tab>('All');
  const [view, setView] = useState<View>('list');
  const [trackerDoc, setTrackerDoc] = useState<Announcement | null>(null);
  const [showCreate, setShowCreate] = useState(false);
  const [editDoc, setEditDoc] = useState<Announcement | null>(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [reminderSent, setReminderSent] = useState<string[]>([]);
  const [bulkSent, setBulkSent] = useState(false);

  const filtered = docs.filter(d => tab === 'All' || d.type === tab);

  function openCreate(type: DocType) {
    const prefix = type === 'Advisory' ? 'ADV' : type === 'Memorandum' ? 'MEM' : 'POL';
    const num = String(docs.filter(d => d.type === type).length + 1).padStart(3, '0');
    setForm({ ...EMPTY_FORM, type, refNumber: `${prefix}-2026-${num}` });
    setEditDoc(null);
    setShowCreate(true);
    setDropdownOpen(false);
  }

  function openEdit(doc: Announcement) {
    setForm({
      type: doc.type, title: doc.title, refNumber: doc.refNumber,
      effectivityDate: doc.effectivityDate, targetAudience: doc.targetAudience,
      targetDepartments: doc.targetDepartments ?? [],
      requiresAcknowledgement: doc.requiresAcknowledgement,
      content: doc.content, attachedFile: doc.attachedFile ?? '',
      status: doc.status,
    });
    setEditDoc(doc);
    setShowCreate(true);
  }

  async function handleSave(publish: boolean) {
    const now = new Date().toISOString().split('T')[0];
    // Map camelCase form fields to DB column names (all lowercase)
    const dbPayload: any = {
      type: form.type,
      title: form.title,
      refnumber: form.refNumber,
      effectivitydate: form.effectivityDate || null,
      targetaudience: form.targetAudience,
      targetdepartments: form.targetDepartments.length > 0 ? form.targetDepartments : null,
      requiresacknowledgement: form.requiresAcknowledgement,
      content: form.content,
      attachedfile: form.attachedFile || null,
      status: publish ? 'Published' : form.status,
    };

    if (editDoc) {
      dbPayload.publisheddate = publish ? now : editDoc.publishedDate;
      const { error } = await supabase.from('announcements').update(dbPayload).eq('id', editDoc.id);
      if (error) { console.error('Update error:', error); return; }
      // Update local state with camelCase version
      const localUpdate = { ...form, status: dbPayload.status as DocStatus, publishedDate: dbPayload.publisheddate };
      setDocs(prev => prev.map(d => d.id === editDoc.id ? { ...d, ...localUpdate } : d));
    } else {
      dbPayload.status = publish ? 'Published' : 'Draft';
      dbPayload.publisheddate = publish ? now : null;
      dbPayload.publishedby = 'Sofia Garcia';
      dbPayload.totalrecipients = form.targetAudience === 'All Employees' ? 24 : form.targetAudience === 'Managers Only' ? 6 : 8;
      dbPayload.readcount = 0;

      const { data, error } = await supabase.from('announcements').insert(dbPayload).select().single();
      if (error) { console.error('Insert error:', error); return; }
      if (data) {
        // Map DB response back to camelCase
        const mapped: Announcement = {
          id: data.id,
          type: data.type,
          title: data.title,
          refNumber: data.refnumber,
          effectivityDate: data.effectivitydate,
          publishedDate: data.publisheddate,
          publishedBy: data.publishedby,
          targetAudience: data.targetaudience,
          targetDepartments: data.targetdepartments,
          status: data.status,
          content: data.content,
          attachedFile: data.attachedfile,
          requiresAcknowledgement: data.requiresacknowledgement,
          totalRecipients: data.totalrecipients,
          readCount: data.readcount,
        };
        setDocs(prev => [mapped, ...prev]);
      }
    }
    setShowCreate(false);
  }

  async function handleArchive(id: string) {
    await supabase.from('announcements').update({ status: 'Archived' }).eq('id', id);
    setDocs(prev => prev.map(d => d.id === id ? { ...d, status: 'Archived' as DocStatus } : d));
  }

  function openTracker(doc: Announcement) {
    setTrackerDoc(doc);
    setView('tracker');
    setReminderSent([]);
    setBulkSent(false);
  }

  function sendReminder(employeeId: string) {
    setReminderSent(prev => [...prev, employeeId]);
  }

  function toggleDept(dept: string) {
    setForm(f => ({
      ...f,
      targetDepartments: f.targetDepartments.includes(dept)
        ? f.targetDepartments.filter(d => d !== dept)
        : [...f.targetDepartments, dept],
    }));
  }

  function insertFormat(tag: string) {
    const prefix = tag === 'bullet' ? '• ' : tag === 'bold' ? '**' : tag === 'italic' ? '_' : '';
    setForm(f => ({ ...f, content: f.content + prefix }));
  }

  const trackerAcks = trackerDoc ? (acks[trackerDoc.id] ?? []) : [];
  const unreadAcks = trackerAcks.filter(a => a.status !== 'Read');

  if (view === 'tracker' && trackerDoc) {
    const cfg = typeConfig[trackerDoc.type];
    const TypeIcon = cfg.icon;
    const readCount = trackerAcks.filter(a => a.status === 'Read').length;
    const unreadCount = trackerAcks.filter(a => a.status === 'Unread').length;
    const pendingCount = trackerAcks.filter(a => a.status === 'Pending').length;

    return (
      <div className="space-y-5">
        <div className="flex items-center gap-3">
          <button onClick={() => setView('list')} className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors">
            ← Back to Announcements
          </button>
        </div>

        <div className="bg-card rounded-xl border border-border p-5">
          <div className="flex items-start justify-between">
            <div className="flex items-start gap-3">
              <div className={`w-10 h-10 rounded-xl ${cfg.bg} flex items-center justify-center flex-shrink-0`}>
                <TypeIcon size={18} className={cfg.color} />
              </div>
              <div>
                <span className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-semibold ${cfg.bg} ${cfg.color} mb-1`}>{trackerDoc.type}</span>
                <h2 className="font-bold text-foreground">{trackerDoc.title}</h2>
                <p className="text-xs text-muted-foreground mt-0.5">Ref: {trackerDoc.refNumber} · Published {trackerDoc.publishedDate}</p>
              </div>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => { setBulkSent(true); setReminderSent(unreadAcks.map(a => a.employeeId)); }}
                className="flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-white text-sm font-medium hover:bg-primary/90 transition-colors"
              >
                <Bell size={15} /> {bulkSent ? 'Reminders Sent ✓' : 'Send Bulk Reminder'}
              </button>
              <button className="flex items-center gap-2 px-3 py-2 rounded-lg border border-border text-sm text-muted-foreground hover:bg-secondary transition-colors">
                <Download size={15} /> Export CSV
              </button>
            </div>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-4 gap-4">
          {[
            { label: 'Total Recipients', value: trackerDoc.totalRecipients, color: 'text-foreground', bg: 'bg-card' },
            { label: 'Read', value: readCount, color: 'text-emerald-700', bg: 'bg-emerald-50 border-emerald-100' },
            { label: 'Unread', value: unreadCount, color: 'text-red-600', bg: 'bg-red-50 border-red-100' },
            { label: 'Pending', value: pendingCount, color: 'text-amber-700', bg: 'bg-amber-50 border-amber-100' },
          ].map(s => (
            <div key={s.label} className={`rounded-xl border p-4 ${s.bg}`}>
              <div className={`text-2xl font-bold ${s.color}`}>{s.value}</div>
              <div className="text-xs text-muted-foreground mt-0.5">{s.label}</div>
            </div>
          ))}
        </div>

        {/* Acknowledgement Table */}
        <div className="bg-card rounded-xl border border-border overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border bg-secondary/40">
                {['Employee Name', 'Department', 'Role', 'Date Read', 'Status', 'Action'].map(col => (
                  <th key={col} className="text-left text-xs font-semibold text-muted-foreground px-5 py-3">{col}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {trackerAcks.map((ack, i) => {
                const sc = ackStatusConfig[ack.status];
                const AckIcon = sc.icon;
                const sent = reminderSent.includes(ack.employeeId);
                return (
                  <tr key={ack.employeeId} className={`border-b border-border/50 hover:bg-secondary/20 ${i % 2 !== 0 ? 'bg-secondary/10' : ''}`}>
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-2.5">
                        <div className="w-7 h-7 rounded-full bg-primary flex items-center justify-center">
                          <span className="text-white text-xs font-semibold">{ack.employeeName.split(' ').map(n => n[0]).join('').slice(0, 2)}</span>
                        </div>
                        <span className="text-sm font-medium text-foreground">{ack.employeeName}</span>
                      </div>
                    </td>
                    <td className="px-5 py-3 text-sm text-muted-foreground">{ack.department}</td>
                    <td className="px-5 py-3 text-sm text-muted-foreground">{ack.role}</td>
                    <td className="px-5 py-3 text-sm text-foreground">{ack.dateRead ?? '—'}</td>
                    <td className="px-5 py-3">
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${sc.bg} ${sc.color}`}>
                        <AckIcon size={12} /> {sc.label}
                      </span>
                    </td>
                    <td className="px-5 py-3">
                      {ack.status !== 'Read' && (
                        <button
                          onClick={() => sendReminder(ack.employeeId)}
                          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${sent ? 'bg-emerald-50 text-emerald-700' : 'border border-border text-muted-foreground hover:bg-secondary'}`}
                        >
                          {sent ? <><Check size={11} /> Sent</> : <><Send size={11} /> Send Reminder</>}
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-semibold text-foreground">Announcements & Policies</h2>
          <p className="text-xs text-muted-foreground mt-0.5">{docs.filter(d => d.status === 'Published').length} published · {docs.filter(d => d.status === 'Draft').length} drafts</p>
        </div>
        <div className="relative">
          <button
            onClick={() => setDropdownOpen(v => !v)}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-white text-sm font-medium hover:bg-primary/90 transition-colors"
          >
            <Plus size={15} /> Create New <ChevronDown size={14} className={`transition-transform ${dropdownOpen ? 'rotate-180' : ''}`} />
          </button>
          {dropdownOpen && (
            <>
              <div className="fixed inset-0 z-40" onClick={() => setDropdownOpen(false)} />
              <div className="absolute right-0 top-11 w-52 bg-white rounded-xl shadow-xl border border-border z-50 overflow-hidden">
                {(['Advisory', 'Memorandum', 'Policy'] as DocType[]).map(type => {
                  const cfg = typeConfig[type];
                  const Icon = cfg.icon;
                  return (
                    <button key={type} onClick={() => openCreate(type)} className="w-full flex items-center gap-3 px-4 py-3 hover:bg-secondary transition-colors text-left">
                      <div className={`w-7 h-7 rounded-lg ${cfg.bg} flex items-center justify-center`}>
                        <Icon size={14} className={cfg.color} />
                      </div>
                      <span className="text-sm text-foreground">{type}</span>
                    </button>
                  );
                })}
              </div>
            </>
          )}
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-border">
        {(['All', 'Advisory', 'Memorandum', 'Policy'] as const).map(t => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`px-5 py-3 text-sm font-medium transition-colors border-b-2 -mb-px ${tab === t ? 'border-primary text-primary' : 'border-transparent text-muted-foreground hover:text-foreground'}`}
          >
            {t}
            <span className={`ml-2 text-xs px-1.5 py-0.5 rounded-full ${tab === t ? 'bg-primary/10 text-primary' : 'bg-secondary text-muted-foreground'}`}>
              {t === 'All' ? docs.length : docs.filter(d => d.type === t).length}
            </span>
          </button>
        ))}
      </div>

      {/* Table */}
      <div className="bg-card rounded-xl border border-border overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border bg-secondary/40">
              {['Title', 'Type', 'Date Published', 'Target', 'Status', 'Read Rate', 'Actions'].map(col => (
                <th key={col} className="text-left text-xs font-semibold text-muted-foreground px-5 py-3">{col}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.map((doc, i) => {
              const cfg = typeConfig[doc.type];
              const Icon = cfg.icon;
              const pct = doc.totalRecipients > 0 ? Math.round((doc.readCount / doc.totalRecipients) * 100) : 0;
              return (
                <tr key={doc.id} className={`border-b border-border/50 hover:bg-secondary/20 ${i % 2 !== 0 ? 'bg-secondary/10' : ''}`}>
                  <td className="px-5 py-4">
                    <div className="font-medium text-sm text-foreground">{doc.title}</div>
                    <div className="text-xs text-muted-foreground mt-0.5">{doc.refNumber}</div>
                  </td>
                  <td className="px-5 py-4">
                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${cfg.bg} ${cfg.color}`}>
                      <Icon size={11} /> {doc.type}
                    </span>
                  </td>
                  <td className="px-5 py-4 text-xs text-muted-foreground">{doc.publishedDate || '—'}</td>
                  <td className="px-5 py-4 text-xs text-foreground">{doc.targetAudience}</td>
                  <td className="px-5 py-4">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${statusConfig[doc.status]}`}>{doc.status}</span>
                  </td>
                  <td className="px-5 py-4">
                    {doc.status === 'Published' && doc.requiresAcknowledgement ? (
                      <button onClick={() => openTracker(doc)} className="group text-left">
                        <div className="text-xs text-muted-foreground mb-1 group-hover:text-accent">{doc.readCount} / {doc.totalRecipients} read</div>
                        <div className="w-24 h-1.5 bg-secondary rounded-full overflow-hidden">
                          <div className="h-full bg-emerald-500 rounded-full" style={{ width: `${pct}%` }} />
                        </div>
                      </button>
                    ) : (
                      <span className="text-xs text-muted-foreground">—</span>
                    )}
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex gap-1">
                      <button onClick={() => openEdit(doc)} className="p-1.5 rounded-lg text-muted-foreground hover:bg-blue-50 hover:text-blue-600 transition-colors" title="Edit"><Eye size={14} /></button>
                      <button onClick={() => openEdit(doc)} className="p-1.5 rounded-lg text-muted-foreground hover:bg-amber-50 hover:text-amber-600 transition-colors" title="Edit"><Pencil size={14} /></button>
                      {doc.status !== 'Archived' && (
                        <button onClick={() => handleArchive(doc.id)} className="p-1.5 rounded-lg text-muted-foreground hover:bg-gray-100 hover:text-gray-600 transition-colors" title="Archive"><Archive size={14} /></button>
                      )}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Create / Edit Slide-over */}
      {showCreate && (
        <div className="fixed inset-0 z-50 flex" onClick={() => setShowCreate(false)}>
          <div className="flex-1 bg-black/40 backdrop-blur-sm" />
          <div className="w-full max-w-2xl bg-white h-full overflow-y-auto shadow-2xl" onClick={e => e.stopPropagation()}>
            {/* Header */}
            <div className={`px-6 py-5 border-b border-border flex items-center justify-between ${typeConfig[form.type].bg}`}>
              <div className="flex items-center gap-3">
                {(() => { const Icon = typeConfig[form.type].icon; return <Icon size={20} className={typeConfig[form.type].color} />; })()}
                <div>
                  <h3 className={`font-bold ${typeConfig[form.type].color}`}>{editDoc ? 'Edit' : 'Create'} {form.type}</h3>
                  <p className="text-xs text-muted-foreground">{form.refNumber}</p>
                </div>
              </div>
              <button onClick={() => setShowCreate(false)} className="p-1.5 rounded-lg hover:bg-white/50 text-muted-foreground"><X size={18} /></button>
            </div>

            <div className="p-6 space-y-5">
              {/* Doc type selector */}
              <div>
                <label className="block text-xs font-medium text-foreground mb-2">Document Type</label>
                <div className="flex gap-2">
                  {(['Advisory', 'Memorandum', 'Policy'] as DocType[]).map(t => {
                    const cfg = typeConfig[t];
                    const Icon = cfg.icon;
                    return (
                      <button
                        key={t}
                        onClick={() => {
                          const prefix = t === 'Advisory' ? 'ADV' : t === 'Memorandum' ? 'MEM' : 'POL';
                          const num = String(docs.filter(d => d.type === t).length + 1).padStart(3, '0');
                          setForm(f => ({ ...f, type: t, refNumber: `${prefix}-2026-${num}` }));
                        }}
                        className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl border-2 text-sm font-medium transition-all ${form.type === t ? `${cfg.bg} ${cfg.color} border-current` : 'border-border text-muted-foreground hover:border-primary/30'}`}
                      >
                        <Icon size={15} /> {t}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-foreground mb-1.5">Title <span className="text-red-500">*</span></label>
                <input value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} placeholder="Enter document title" className="w-full px-3 py-2.5 bg-secondary rounded-lg text-sm border-0 outline-none text-foreground placeholder:text-muted-foreground" />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-foreground mb-1.5">Reference Number</label>
                  <input value={form.refNumber} onChange={e => setForm(f => ({ ...f, refNumber: e.target.value }))} className="w-full px-3 py-2.5 bg-secondary rounded-lg text-sm border-0 outline-none text-foreground font-mono" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-foreground mb-1.5">Effectivity Date</label>
                  <input type="date" value={form.effectivityDate} onChange={e => setForm(f => ({ ...f, effectivityDate: e.target.value }))} className="w-full px-3 py-2.5 bg-secondary rounded-lg text-sm border-0 outline-none text-foreground" />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-foreground mb-1.5">Target Audience</label>
                <select value={form.targetAudience} onChange={e => setForm(f => ({ ...f, targetAudience: e.target.value as TargetAudience }))} className="w-full px-3 py-2.5 bg-secondary rounded-lg text-sm border-0 outline-none text-foreground cursor-pointer">
                  <option>All Employees</option>
                  <option>Managers Only</option>
                  <option>Specific Department</option>
                </select>
                {form.targetAudience === 'Specific Department' && (
                  <div className="mt-2 flex flex-wrap gap-2">
                    {DEPARTMENTS.map(dept => (
                      <button
                        key={dept}
                        onClick={() => toggleDept(dept)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${form.targetDepartments.includes(dept) ? 'bg-primary text-white' : 'bg-secondary text-muted-foreground hover:bg-border'}`}
                      >
                        {dept}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              <div className="flex items-center justify-between p-3 bg-secondary rounded-xl">
                <div>
                  <div className="text-sm font-medium text-foreground">Requires Acknowledgement</div>
                  <div className="text-xs text-muted-foreground">Employees must confirm they've read this document</div>
                </div>
                <div
                  onClick={() => setForm(f => ({ ...f, requiresAcknowledgement: !f.requiresAcknowledgement }))}
                  className={`w-11 h-6 rounded-full transition-colors cursor-pointer relative ${form.requiresAcknowledgement ? 'bg-primary' : 'bg-gray-300'}`}
                >
                  <span className={`absolute top-0.5 w-5 h-5 rounded-full bg-white shadow transition-all ${form.requiresAcknowledgement ? 'left-5' : 'left-0.5'}`} />
                </div>
              </div>

              {/* Rich Text Editor */}
              <div>
                <label className="block text-xs font-medium text-foreground mb-1.5">Body / Content</label>
                <div className="border border-border rounded-xl overflow-hidden">
                  <div className="flex items-center gap-1 px-3 py-2 bg-secondary/50 border-b border-border">
                    {[
                      { icon: Bold, label: 'Bold', action: 'bold' },
                      { icon: Italic, label: 'Italic', action: 'italic' },
                      { icon: List, label: 'Bullet', action: 'bullet' },
                    ].map(btn => (
                      <button key={btn.label} onClick={() => insertFormat(btn.action)} title={btn.label} className="p-1.5 rounded hover:bg-border transition-colors text-muted-foreground hover:text-foreground">
                        <btn.icon size={14} />
                      </button>
                    ))}
                  </div>
                  <textarea
                    value={form.content}
                    onChange={e => setForm(f => ({ ...f, content: e.target.value }))}
                    rows={10}
                    placeholder="Write the document content here..."
                    className="w-full px-4 py-3 text-sm text-foreground bg-white outline-none resize-none placeholder:text-muted-foreground"
                  />
                </div>
              </div>

              {/* Attach File */}
              <div>
                <label className="block text-xs font-medium text-foreground mb-1.5">Attach File (PDF, DOCX)</label>
                <label className="flex items-center gap-3 px-4 py-3 border-2 border-dashed border-border rounded-xl cursor-pointer hover:border-primary/30 transition-colors bg-secondary/30">
                  <Paperclip size={16} className="text-muted-foreground" />
                  <div>
                    <div className="text-sm text-foreground">{form.attachedFile || 'Click to attach a file'}</div>
                    <div className="text-xs text-muted-foreground">PDF or DOCX, max 10MB</div>
                  </div>
                  <input type="file" accept=".pdf,.docx" className="hidden" onChange={e => setForm(f => ({ ...f, attachedFile: e.target.files?.[0]?.name ?? '' }))} />
                </label>
              </div>
            </div>

            {/* Footer Actions */}
            <div className="sticky bottom-0 bg-white border-t border-border px-6 py-4 flex gap-3">
              <button onClick={() => setShowCreate(false)} className="px-4 py-2 rounded-lg border border-border text-sm text-muted-foreground hover:bg-secondary">Cancel</button>
              <button onClick={() => handleSave(false)} className="px-5 py-2 rounded-lg border border-border text-sm text-foreground font-medium hover:bg-secondary">Save as Draft</button>
              <button onClick={() => handleSave(true)} className="flex-1 px-5 py-2 rounded-lg bg-primary text-white text-sm font-medium hover:bg-primary/90">Publish</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
