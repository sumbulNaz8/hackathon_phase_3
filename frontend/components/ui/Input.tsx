import { InputHTMLAttributes, ReactNode } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  icon?: ReactNode;
}

export const Input = ({ label, error, icon, className = '', ...props }: InputProps) => {
  const baseStyles = 'w-full px-5 py-3.5 font-body text-base text-deep-brown bg-white/80 border-2 border-amber-200/50 rounded-xl outline-none transition-all duration-300 placeholder:text-amber-200/60';

  const focusStyles = 'focus:border-amber-400 focus:shadow-lg focus:shadow-amber-100 focus:bg-white';

  const errorStyles = error ? 'border-rose-400 focus:border-rose-500 focus:shadow-rose-100' : '';

  const combinedStyles = `${baseStyles} ${focusStyles} ${errorStyles} ${className}`;

  return (
    <div className="w-full">
      {label && (
        <label className="block mb-2.5 text-sm font-semibold text-deep-brown font-heading tracking-wide">
          {label}
        </label>
      )}
      <div className="relative">
        {icon && (
          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-amber-600">
            {icon}
          </span>
        )}
        <input
          className={`${combinedStyles} ${icon ? 'pl-12' : ''}`}
          {...props}
        />
      </div>
      {error && (
        <p className="mt-2 text-sm text-rose-500 font-medium flex items-center gap-2 fade-in-up">
          <span>⚠</span>
          {error}
        </p>
      )}
    </div>
  );
};
