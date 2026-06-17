interface StatusBadgeProps {
  status: string;
  size?: 'sm' | 'md';
}

const statusConfig: Record<string, { bg: string; text: string; dot: string }> = {
  Active: { bg: 'bg-emerald-50', text: 'text-emerald-700', dot: 'bg-emerald-500' },
  'On Leave': { bg: 'bg-blue-50', text: 'text-blue-700', dot: 'bg-blue-500' },
  Inactive: { bg: 'bg-gray-100', text: 'text-gray-500', dot: 'bg-gray-400' },
  Present: { bg: 'bg-emerald-50', text: 'text-emerald-700', dot: 'bg-emerald-500' },
  Late: { bg: 'bg-amber-50', text: 'text-amber-700', dot: 'bg-amber-500' },
  Absent: { bg: 'bg-red-50', text: 'text-red-600', dot: 'bg-red-500' },
  Undertime: { bg: 'bg-orange-50', text: 'text-orange-700', dot: 'bg-orange-500' },
  Pending: { bg: 'bg-amber-50', text: 'text-amber-700', dot: 'bg-amber-500' },
  Approved: { bg: 'bg-emerald-50', text: 'text-emerald-700', dot: 'bg-emerald-500' },
  Rejected: { bg: 'bg-red-50', text: 'text-red-600', dot: 'bg-red-500' },
  Processed: { bg: 'bg-blue-50', text: 'text-blue-700', dot: 'bg-blue-500' },
  Paid: { bg: 'bg-emerald-50', text: 'text-emerald-700', dot: 'bg-emerald-500' },
};

export function StatusBadge({ status, size = 'sm' }: StatusBadgeProps) {
  const config = statusConfig[status] ?? { bg: 'bg-gray-100', text: 'text-gray-600', dot: 'bg-gray-400' };
  const padding = size === 'md' ? 'px-3 py-1' : 'px-2.5 py-0.5';
  const textSize = size === 'md' ? 'text-xs' : 'text-xs';
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full ${padding} ${config.bg} ${config.text} ${textSize} font-medium`}>
      <span className={`w-1.5 h-1.5 rounded-full ${config.dot}`} />
      {status}
    </span>
  );
}
