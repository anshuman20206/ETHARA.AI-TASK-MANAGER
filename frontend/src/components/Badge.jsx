const statusClasses = {
  TODO: 'bg-slate-100 text-slate-700',
  IN_PROGRESS: 'bg-blue-100 text-blue-700',
  DONE: 'bg-green-100 text-green-700',
};

const priorityClasses = {
  LOW: 'bg-green-100 text-green-700',
  MEDIUM: 'bg-yellow-100 text-yellow-800',
  HIGH: 'bg-red-100 text-red-700',
};

export function StatusBadge({ value }) {
  return <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${statusClasses[value]}`}>{value?.replace('_', ' ')}</span>;
}

export function PriorityBadge({ value }) {
  return <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${priorityClasses[value]}`}>{value}</span>;
}
