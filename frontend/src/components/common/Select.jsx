import React, { forwardRef } from 'react';

export const Select = forwardRef(({
  label,
  options = [],
  error,
  helperText,
  className = '',
  id,
  placeholder,
  ...props
}, ref) => {
  const selectId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

  return (
    <div className="w-full space-y-1.5">
      {label && (
        <label htmlFor={selectId} className="block text-xs font-semibold text-slate-700 tracking-wide uppercase">
          {label}
        </label>
      )}
      <select
        ref={ref}
        id={selectId}
        className={`block w-full rounded-xl border text-sm transition-all duration-150 bg-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent px-3.5 py-2.5 ${
          error
            ? 'border-rose-300 text-rose-900 focus:ring-rose-500 focus:border-rose-500 bg-rose-50/20'
            : 'border-slate-200 hover:border-slate-300'
        } ${className}`}
        {...props}
      >
        {placeholder && <option value="">{placeholder}</option>}
        {options.map((opt) => (
          <option key={opt.value ?? opt} value={opt.value ?? opt}>
            {opt.label ?? opt}
          </option>
        ))}
      </select>
      {error && <p className="text-xs text-rose-600 font-medium">{error}</p>}
      {helperText && !error && <p className="text-xs text-slate-500">{helperText}</p>}
    </div>
  );
});

Select.displayName = 'Select';
