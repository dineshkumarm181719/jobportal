import React from 'react';
import { Loader2 } from 'lucide-react';

export const Button = ({
  children,
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled = false,
  className = '',
  icon: Icon,
  type = 'button',
  ...props
}) => {
  const baseClasses = 'inline-flex items-center justify-center font-medium rounded-xl transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed';

  const variants = {
    primary: 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-sm shadow-indigo-200 focus:ring-indigo-500',
    secondary: 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-50 hover:border-slate-300 shadow-xs focus:ring-slate-400',
    outline: 'border-2 border-indigo-600 text-indigo-600 hover:bg-indigo-50 focus:ring-indigo-500',
    ghost: 'text-slate-600 hover:bg-slate-100 hover:text-slate-900 focus:ring-slate-300',
    danger: 'bg-rose-600 text-white hover:bg-rose-700 shadow-sm shadow-rose-200 focus:ring-rose-500',
    success: 'bg-emerald-600 text-white hover:bg-emerald-700 shadow-sm shadow-emerald-200 focus:ring-emerald-500',
  };

  const sizes = {
    sm: 'px-3 py-1.5 text-xs gap-1.5',
    md: 'px-4 py-2.5 text-sm gap-2',
    lg: 'px-6 py-3 text-base gap-2.5',
  };

  return (
    <button
      type={type}
      disabled={disabled || loading}
      className={`${baseClasses} ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      {loading ? (
        <Loader2 className="w-4 h-4 animate-spin" />
      ) : Icon ? (
        <Icon className="w-4 h-4" />
      ) : null}
      {children}
    </button>
  );
};
