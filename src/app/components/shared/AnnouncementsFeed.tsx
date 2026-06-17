import { useState } from 'react';
import { FileText, Megaphone, BookOpen, Download, CheckCircle2, Clock, X, AlertTriangle, ArrowLeft, Paperclip } from 'lucide-react';
import { announcements, type Announcement, type DocType } from '../../data/announcementsData';

const typeConfig: Record<DocType, { color: string; bg: string; borderColor: string; icon: React.ElementType; label: string }> = {
  Advisory: { color: 'text-blue-700', bg: 'bg-blue-50', borderColor: 'border-l-blue-500', icon: Megaphone, label: 'Advisory' },
  Memorandum: { color: 'text-purple-700', bg: 'bg-purple-50', borderColor: 'border-l-purple-500', icon: FileText, label: 'Memorandum' },
  Policy: { color: 'text-emerald-700', bg: 'bg-emerald-50', borderColor: 'border-l-emerald-500', icon: BookOpen, label: 'Policy' },
};

type FeedFilter = 'All' | 'Unacknowledged' | DocType;

interface Props {
  role: 'manager' | 'employee';
  userId?: string;
}

export function AnnouncementsFeed({ role, userId = 'EMP002' }: Props) {
  const [filter, setFilter] = useState<FeedFilter>('All');
  const [selected, setSelected] = useState<Announcement | null>(null);
  const [acknowledged, setAcknowledged] = useState<Record<string, string>>({}); // id -> timestamp
  const [ackChecked, setAckChecked] = useState<Record<string, boolean>>({});

  const published = announcements.filter(a => a.status === 'Published' && (
    a.targetAudience === 'All Employees' ||
    (role === 'manager' && a.targetAudience === 'Managers Only') ||
    (role === 'employee' && a.targetAudience !== 'Managers Only')
  ));

  const requiresAck = published.filter(a => a.requiresAcknowledgement && !acknowledged[a.id]);

  const filtered = published.filter(a => {
    if (filter === 'Unacknowledged') return a.requiresAcknowledgement && !acknowledged[a.id];
    if (filter === 'All') return true;
    return a.type === filter;
  });

  function handleAcknowledge(id: string) {
    const now = new Date().toLocaleString('en-PH', { dateStyle: 'medium', timeStyle: 'short' });
    setAcknowledged(prev => ({ ...prev, [id]: now }));
    setAckChecked(prev => ({ ...prev, [id]: true }));
  }

  if (selected) {
    const cfg = typeConfig[selected.type];
    const TypeIcon = cfg.icon;
    const isAcked = !!acknowledged[selected.id];
    const isChecked = ackChecked[selected.id] ?? false;
    const paragraphs = selected.content.split('\n\n');

    return (
      <div className="space-y-5">
        <button onClick={() => setSelected(null)} className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors">
          <ArrowLeft size={15} /> Back to Announcements
        </button>

        <div className="bg-card rounded-2xl border border-border overflow-hidden">
          {/* Document header */}
          <div className={`px-8 py-6 border-b border-border ${cfg.bg}`}>
            <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold ${cfg.bg} ${cfg.color} border border-current/20 mb-3`}>
              <TypeIcon size={12} /> {selected.type}
            </span>
            <h1 className="text-xl font-bold text-foreground mb-2">{selected.title}</h1>
            <div className="flex items-center gap-5 text-xs text-muted-foreground flex-wrap">
              <span>Ref: <strong className="text-foreground font-mono">{selected.refNumber}</strong></span>
              <span>Effectivity: <strong className="text-foreground">{selected.effectivityDate}</strong></span>
              <span>Published by: <strong className="text-foreground">{selected.publishedBy}</strong></span>
              <span>Date: <strong className="text-foreground">{selected.publishedDate}</strong></span>
            </div>
          </div>

          {/* Body */}
          <div className="px-8 py-6">
            <div className="prose max-w-none text-sm text-foreground leading-relaxed space-y-4">
              {paragraphs.map((para, i) => {
                if (para.startsWith('•') || para.includes('\n•')) {
                  const lines = para.split('\n');
                  return (
                    <div key={i}>
                      {lines.map((line, j) => (
                        line.startsWith('•')
                          ? <div key={j} className="flex gap-2 ml-4"><span className="text-primary mt-1 flex-shrink-0">•</span><span>{line.slice(2)}</span></div>
                          : <p key={j} className={line ? '' : 'hidden'}>{line}</p>
                      ))}
                    </div>
                  );
                }
                return <p key={i} className="whitespace-pre-wrap">{para}</p>;
              })}
            </div>

            {/* Attached File */}
            {selected.attachedFile && (
              <div className="mt-6 pt-5 border-t border-border">
                <button className="flex items-center gap-3 px-4 py-3 bg-secondary rounded-xl hover:bg-border transition-colors">
                  <Paperclip size={16} className="text-muted-foreground" />
                  <div className="text-left">
                    <div className="text-sm font-medium text-foreground">{selected.attachedFile}</div>
                    <div className="text-xs text-muted-foreground">Click to download</div>
                  </div>
                  <Download size={15} className="text-muted-foreground ml-2" />
                </button>
              </div>
            )}

            {/* Acknowledgement Section */}
            {selected.requiresAcknowledgement && (
              <div className="mt-6 pt-5 border-t border-border">
                <div className="bg-secondary/60 rounded-xl p-5">
                  <h4 className="text-sm font-semibold text-foreground mb-3">Acknowledgement Required</h4>
                  {isAcked ? (
                    <div className="flex items-center gap-3 px-4 py-3 bg-emerald-50 border border-emerald-200 rounded-xl">
                      <CheckCircle2 size={20} className="text-emerald-600 flex-shrink-0" />
                      <div>
                        <div className="text-sm font-semibold text-emerald-700">Acknowledged ✅</div>
                        <div className="text-xs text-emerald-600 mt-0.5">{acknowledged[selected.id]}</div>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      <label className="flex items-start gap-3 cursor-pointer">
                        <div
                          onClick={() => setAckChecked(prev => ({ ...prev, [selected.id]: !prev[selected.id] }))}
                          className={`mt-0.5 w-5 h-5 rounded border-2 flex items-center justify-center flex-shrink-0 transition-colors ${isChecked ? 'bg-primary border-primary' : 'border-border bg-white'}`}
                        >
                          {isChecked && <Check size={12} className="text-white" />}
                        </div>
                        <span className="text-sm text-foreground">I have read and fully understood this document.</span>
                      </label>
                      <button
                        onClick={() => isChecked && handleAcknowledge(selected.id)}
                        disabled={!isChecked}
                        className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-white text-sm font-medium transition-all ${isChecked ? 'bg-primary hover:bg-primary/90' : 'bg-gray-300 cursor-not-allowed'}`}
                      >
                        <CheckCircle2 size={15} /> Acknowledge
                      </button>
                      <p className="text-xs text-muted-foreground italic">Your acknowledgement will be recorded and sent to HR.</p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      {/* Unread banner */}
      {requiresAck.length > 0 && (
        <div className="flex items-center gap-3 px-5 py-3.5 bg-amber-50 border border-amber-200 rounded-xl">
          <AlertTriangle size={16} className="text-amber-600 flex-shrink-0" />
          <p className="text-sm text-amber-800 font-medium">
            You have <strong>{requiresAck.length}</strong> unread announcement{requiresAck.length > 1 ? 's' : ''} requiring your acknowledgement.
          </p>
          <button onClick={() => setFilter('Unacknowledged')} className="ml-auto text-xs font-medium text-amber-700 underline hover:no-underline">View All</button>
        </div>
      )}

      {/* Filter Bar */}
      <div className="flex items-center gap-2 flex-wrap">
        {(['All', 'Unacknowledged', 'Advisory', 'Memorandum', 'Policy'] as FeedFilter[]).map(f => {
          const count = f === 'All' ? published.length
            : f === 'Unacknowledged' ? requiresAck.length
            : published.filter(a => a.type === f).length;
          const isActive = filter === f;
          return (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium transition-all border ${isActive ? 'bg-primary text-white border-primary' : 'border-border text-muted-foreground bg-white hover:border-primary/40'}`}
            >
              {f === 'Unacknowledged' && requiresAck.length > 0 && !isActive && (
                <span className="w-2 h-2 rounded-full bg-amber-500" />
              )}
              {f}
              <span className={`text-xs px-1.5 py-0.5 rounded-full ${isActive ? 'bg-white/20 text-white' : 'bg-secondary text-muted-foreground'}`}>{count}</span>
            </button>
          );
        })}
      </div>

      {/* Cards */}
      {filtered.length === 0 ? (
        <div className="text-center py-16 text-muted-foreground text-sm bg-card rounded-xl border border-border">No announcements to show.</div>
      ) : (
        <div className="space-y-3">
          {filtered.map(doc => {
            const cfg = typeConfig[doc.type];
            const TypeIcon = cfg.icon;
            const isAcked = !!acknowledged[doc.id];
            const needsAck = doc.requiresAcknowledgement && !isAcked;
            const excerpt = doc.content.replace(/\n/g, ' ').slice(0, 180);
            return (
              <div
                key={doc.id}
                className={`bg-white border border-border rounded-xl overflow-hidden border-l-4 ${cfg.borderColor} hover:shadow-sm transition-shadow`}
              >
                <div className="p-5">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-2">
                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold ${cfg.bg} ${cfg.color}`}>
                          <TypeIcon size={11} /> {doc.type}
                        </span>
                        {doc.publishedDate && (
                          <span className="text-xs text-muted-foreground">{doc.publishedDate}</span>
                        )}
                      </div>
                      <h3 className="font-bold text-foreground leading-tight mb-1">{doc.title}</h3>
                      <div className="text-xs text-muted-foreground mb-3 flex gap-3">
                        <span>Ref: {doc.refNumber}</span>
                        <span>Effectivity: {doc.effectivityDate}</span>
                      </div>
                      <p className="text-sm text-muted-foreground leading-relaxed line-clamp-2">
                        {excerpt}
                        {doc.content.length > 180 && '...'}
                      </p>
                      <button
                        onClick={() => setSelected(doc)}
                        className="mt-3 text-sm font-medium text-accent hover:underline"
                      >
                        Read More →
                      </button>
                    </div>
                    <div className="flex-shrink-0">
                      {doc.requiresAcknowledgement ? (
                        isAcked ? (
                          <span className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-50 text-emerald-700 text-xs font-medium rounded-full border border-emerald-200">
                            <CheckCircle2 size={12} /> Acknowledged ✅
                          </span>
                        ) : (
                          <span className="flex items-center gap-1.5 px-3 py-1.5 bg-amber-50 text-amber-700 text-xs font-medium rounded-full border border-amber-200">
                            <Clock size={12} /> Action Required 🕐
                          </span>
                        )
                      ) : (
                        <span className="flex items-center gap-1.5 px-3 py-1.5 bg-secondary text-muted-foreground text-xs rounded-full">
                          No action needed
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

function Check({ size, className }: { size: number; className?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={3} strokeLinecap="round" strokeLinejoin="round" className={className}>
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
}
