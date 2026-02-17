import { ButtonHTMLAttributes, ReactNode } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  variant?: 'primary' | 'secondary' | 'danger' | 'success' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  loadingText?: string;
  fullWidth?: boolean;
}

export const Button = ({
  children,
  variant = 'primary',
  size = 'md',
  isLoading = false,
  loadingText,
  fullWidth = false,
  className = '',
  disabled,
  ...props
}: ButtonProps) => {
  const baseStyles = 'inline-flex items-center justify-center gap-3 font-heading font-bold transition-all duration-300 cursor-pointer disabled:cursor-not-allowed disabled:opacity-50 relative overflow-hidden';

  const variantStyles = {
    primary: 'btn-primary text-deep-brown',
    secondary: 'text-white bg-gradient-to-r from-amber-600 to-amber-500 shadow-lg hover:shadow-xl hover:scale-105 active:scale-95 rounded-xl',
    danger: 'text-white bg-gradient-to-r from-red-500 to-rose-500 shadow-lg hover:shadow-xl hover:shadow-red-200 hover:scale-105 active:scale-95 rounded-xl',
    success: 'text-white bg-gradient-to-r from-emerald-500 to-emerald-400 shadow-lg hover:shadow-xl hover:shadow-emerald-200 hover:scale-105 active:scale-95 rounded-xl',
    outline: 'text-amber-700 border-2 border-amber-500 hover:bg-amber-50 hover:border-amber-400 active:scale-95 rounded-xl',
    ghost: 'text-amber-700 hover:bg-amber-50 active:scale-95 rounded-xl'
  };

  const sizeStyles = {
    sm: 'text-sm py-2.5 px-6',
    md: 'text-base py-3 px-8',
    lg: 'text-lg py-5 px-11'
  };

  const widthStyle = fullWidth ? 'w-full' : '';

  const shimmer = (
    <span className="absolute inset-0 shimmer opacity-0 hover:opacity-100 transition-opacity duration-500" />
  );

  return (
    <button
      className={`${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${widthStyle} ${className}`}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading ? (
        <>
          <span className="spinner" />
          {loadingText || 'Loading...'}
        </>
      ) : (
        <>
          {shimmer}
          {children}
        </>
      )}
    </button>
  );
};
