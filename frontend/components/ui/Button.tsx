// components/ui/Button.tsx

import { ButtonHTMLAttributes, ReactNode } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  variant?: 'primary' | 'secondary' | 'danger' | 'success' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
}

export const Button = ({
  children,
  variant = 'primary',
  size = 'md',
  isLoading = false,
  className = '',
  ...props
}: ButtonProps) => {
  const baseClasses = 'font-semibold rounded-lg transition-all duration-150 flex items-center justify-center';

  const variantClasses = {
    primary: 'bg-gradient-to-r from-indigo-500 to-violet-500 text-white hover:scale-102 hover:brightness-110 hover:shadow-glow-primary active:scale-95',
    secondary: 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white hover:scale-102 hover:brightness-110 hover:shadow-glow-blue active:scale-95',
    danger: 'bg-gradient-to-r from-red-500 to-rose-500 text-white hover:scale-102 hover:brightness-110 hover:shadow-glow-rose active:scale-95',
    success: 'bg-gradient-to-r from-emerald-500 to-teal-500 text-white hover:scale-102 hover:brightness-110 hover:shadow-glow-emerald active:scale-95',
    outline: 'border-2 border-indigo-500 text-indigo-400 hover:bg-indigo-500/10 hover:border-violet-500 hover:text-violet-400 active:scale-95',
  };

  const sizeClasses = {
    sm: 'text-sm py-2 px-4',
    md: 'text-base py-3 px-6',
    lg: 'text-lg py-4 px-8',
  };

  const disabledClasses = isLoading ? 'opacity-50 cursor-not-allowed' : '';

  const classes = `${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${disabledClasses} ${className}`;

  return (
    <button className={classes} disabled={isLoading || props.disabled} {...props}>
      {isLoading ? (
        <span className="flex items-center">
          <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-current" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          Loading...
        </span>
      ) : children}
    </button>
  );
};
