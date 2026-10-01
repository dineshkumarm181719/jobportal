import React from 'react';
import { Loader2 } from 'lucide-react';

export const LoadingSpinner = ({ text = 'Loading data...', size = 'md', className = '' }) => {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12',
  };

  return (
    <div className={`flex flex-col items-center justify-center p-12 text-center ${className}`}>
      <Loader2 className={`${sizeClasses[size]} animate-spin text-indigo-600 mb-3`} />
      {text && <p className="text-sm font-medium text-slate-500">{text}</p>}
    </div>
  );
};
