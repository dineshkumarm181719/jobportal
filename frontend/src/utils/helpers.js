export const formatCurrency = (amount) => {
  if (!amount) return 'Negotiable';
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(amount);
};

export const formatDate = (dateString) => {
  if (!dateString) return 'N/A';
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
};

export const formatRelativeTime = (dateString) => {
  if (!dateString) return '';
  const now = new Date();
  const date = new Date(dateString);
  const diffInSeconds = Math.floor((now - date) / 1000);

  if (diffInSeconds < 60) return 'Just now';
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
  if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)}d ago`;
  return formatDate(dateString);
};

export const getStatusBadgeColor = (status) => {
  switch (status) {
    case 'OPEN':
    case 'ACTIVE':
    case 'SELECTED':
      return 'bg-emerald-50 text-emerald-700 border-emerald-200 ring-emerald-600/20';
    case 'SHORTLISTED':
    case 'INTERVIEW_SCHEDULED':
      return 'bg-indigo-50 text-indigo-700 border-indigo-200 ring-indigo-600/20';
    case 'APPLIED':
      return 'bg-sky-50 text-sky-700 border-sky-200 ring-sky-600/20';
    case 'REJECTED':
    case 'INACTIVE':
    case 'CANCELLED':
      return 'bg-rose-50 text-rose-700 border-rose-200 ring-rose-600/20';
    case 'WITHDRAWN':
    case 'CLOSED':
    case 'DRAFT':
      return 'bg-slate-100 text-slate-700 border-slate-200 ring-slate-600/20';
    default:
      return 'bg-slate-50 text-slate-600 border-slate-200';
  }
};

export const formatEmploymentType = (type) => {
  if (!type) return '';
  return type.replace('_', ' ').toLowerCase().replace(/\b\w/g, l => l.toUpperCase());
};
