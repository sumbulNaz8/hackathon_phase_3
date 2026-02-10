// components/ui/Input.tsx

import { InputHTMLAttributes } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export const Input = ({ label, error, className = '', ...props }: InputProps) => {
  const baseClasses = 'w-full px-4 py-3 bg-white border-2 rounded-lg text-[#3E2723] placeholder-[#BCAAA4] focus:outline-none focus:ring-0';
  const errorClasses = error ? 'border-[#EF5350] focus:border-[#EF5350]' : 'border-[#BCAAA4] focus:border-[#FFC107]';
  
  const classes = `${baseClasses} ${errorClasses} ${className}`;
  
  return (
    <div className="w-full">
      {label && <label className="block text-sm font-medium text-[#BCAAA4] mb-2">{label}</label>}
      <input 
        className={classes} 
        {...props} 
      />
      {error && <p className="mt-1 text-sm text-[#EF5350]">{error}</p>}
    </div>
  );
};