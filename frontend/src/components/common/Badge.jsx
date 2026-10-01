import React from 'react';
import { getStatusBadgeColor } from '../../utils/helpers';

export const Badge = ({ children, status, variant, className = '' }) => {
  let colorClass = 'bg-slate-100 text-slate-700 border-slate-200';

  if (status) {
    colorClass = getStatusBadgeColor(status);
  } else if (variant === 'indigo') {
    colorClass = 'bg-indigo-50 text-indigo-700 border-indigo-200';
  } else if (variant === 'emerald') {
    colorClass = 'bg-emerald-50 text-emerald-700 border-emerald-200';
  } else if (variant === 'amber') {
    colorClass = 'bg-amber-50 text-amber-700 border-amber-200';
  } else if (variant === 'rose') {
    colorClass = 'bg-rose-50 text-rose-700 border-rose-200';
  }

  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border ${colorClass} ${className}`}
    >
      {children}
    </span>
  );
};
