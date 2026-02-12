// components/ui/Input.tsx

import { InputHTMLAttributes } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export const Input = ({ label, error, className = '', ...props }: InputProps) => {
  const baseClasses = 'w-full px-4 py-3 bg-slate-800/60 border-2 rounded-lg text-slate-50 placeholder-slate-500 focus:outline-none transition-all duration-200';
  const errorClasses = error
    ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20'
    : 'border-slate-600 focus:border-indigo-500 focus:ring-indigo-500/20';

  const classes = `${baseClasses} ${errorClasses} ${className}`;

  return (
    <div className="w-full">
      {label && <label className="block text-sm font-medium text-slate-400 mb-2">{label}</label>}
      <input
        className={classes}
        {...props}
      />
      {error && <p className="mt-1 text-sm text-red-500">{error}</p>}
    </div>
  );
};
