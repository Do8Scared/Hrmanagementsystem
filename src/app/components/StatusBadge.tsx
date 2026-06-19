interface StatusBadgeProps {
  status: string;
  size?: 'sm' | 'md';
}

const statusConfig: Record<string, { bg: string; text: string; dot: string }> = {
  // Employee statuses
  Active:        { bg: 'bg-emerald-100', text: 'text-emerald-800', dot: 'bg-emerald-500' },
  'On Leave':    { bg: 'bg-amber-100',   text: 'text-amber-800',   dot: 'bg-amber-500'   },
  Inactive:      { bg: 'bg-gray-100',    text: 'text-gray-500',    dot: 'bg-gray-400'    },
  // Attendance
  Present:       { bg: 'bg-emerald-100', text: 'text-emerald-800', dot: 'bg-emerald-500' },
  Late:          { bg: 'bg-amber-100',   text: 'text-amber-800',   dot: 'bg-amber-500'   },
  Absent:        { bg: 'bg-red-100',     text: 'text-red-700',     dot: 'bg-red-500'     },
  Undertime:     { bg: 'bg-orange-100',  text: 'text-orange-800',  dot: 'bg-orange-500'  },
  // Leave / payroll
  Pending:       { bg: 'bg-amber-100',   text: 'text-amber-800',   dot: 'bg-amber-500'   },
  Approved:      { bg: 'bg-emerald-100', text: 'text-emerald-800', dot: 'bg-emerald-500' },
  Rejected:      { bg: 'bg-red-100',     text: 'text-red-700',     dot: 'bg-red-500'     },
  Processed:     { bg: 'bg-violet-100',  text: 'text-violet-800',  dot: 'bg-violet-500'  },
  Paid:          { bg: 'bg-emerald-100', text: 'text-emerald-800', dot: 'bg-emerald-500' },
};

export function StatusBadge({ status, size = 'sm' }: StatusBadgeProps) {
  const config = statusConfig[status] ?? { bg: 'bg-gray-100', text: 'text-gray-600', dot: 'bg-gray-400' };
  const padding = size === 'md' ? 'px-3 py-1' : 'px-2.5 py-0.5';
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full ${padding} ${config.bg} ${config.text} text-xs font-semibold`}>
      <span className={`w-1.5 h-1.5 rounded-full ${config.dot}`} />
      {status}
    </span>
  );
}
