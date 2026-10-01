import React from 'react';
import { FolderSearch } from 'lucide-react';
import { Button } from './Button';

export const EmptyState = ({
  icon: Icon = FolderSearch,
  title = 'No items found',
  description = 'There are no items matching your criteria right now.',
  actionText,
  onAction,
  className = '',
}) => {
  return (
    <div className={`flex flex-col items-center justify-center p-12 text-center rounded-2xl border-2 border-dashed border-slate-200 bg-white/50 ${className}`}>
      <div className="w-14 h-14 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center mb-4">
        <Icon className="w-7 h-7" />
      </div>
      <h4 className="text-base font-bold text-slate-800 mb-1">{title}</h4>
      <p className="text-sm text-slate-500 max-w-sm mb-6 leading-relaxed">{description}</p>
      {actionText && onAction && (
        <Button variant="primary" onClick={onAction}>
          {actionText}
        </Button>
      )}
    </div>
  );
};
