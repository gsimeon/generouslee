import React, { ButtonHTMLAttributes, ReactNode } from 'react';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'sage';
  size?: 'sm' | 'md' | 'lg';
  children: ReactNode;
  icon?: ReactNode;
  isLoading?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  children,
  icon,
  isLoading = false,
  className = '',
  disabled,
  ...props
}) => {
  const baseStyles = 'inline-flex items-center justify-center font-medium transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed select-none whitespace-nowrap cursor-pointer';

  const sizeStyles = {
    sm: 'text-xs px-3 py-1.5 rounded-full gap-1.5 min-h-[36px]',
    md: 'text-sm px-5 py-2.5 rounded-full gap-2 min-h-[44px]',
    lg: 'text-base px-7 py-3 rounded-full gap-2.5 min-h-[48px]'
  };

  const variantStyles = {
    primary: 'bg-[#B95B3D] text-white hover:bg-[#9E4A30] active:scale-[0.98] shadow-sm focus-visible:ring-[#B95B3D]',
    secondary: 'bg-[#F3EFE9] text-[#24211D] hover:bg-[#E7DFD4] active:scale-[0.98] focus-visible:ring-[#A8957C]',
    outline: 'border border-[#D2C4B1] text-[#383025] hover:bg-[#FAF8F5] hover:border-[#A8957C] active:scale-[0.98] focus-visible:ring-[#A8957C]',
    ghost: 'text-[#594D3C] hover:bg-[#F3EFE9] hover:text-[#211C15] active:scale-[0.98] focus-visible:ring-[#A8957C]',
    sage: 'bg-[#5D7052] text-white hover:bg-[#4D5D44] active:scale-[0.98] shadow-sm focus-visible:ring-[#5D7052]'
  };

  return (
    <button
      className={`${baseStyles} ${sizeStyles[size]} ${variantStyles[variant]} ${className}`}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading ? (
        <span className="inline-block w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin mr-1" />
      ) : icon ? (
        <span className="shrink-0">{icon}</span>
      ) : null}
      <span>{children}</span>
    </button>
  );
};
