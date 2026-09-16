import React, { ReactNode } from 'react';

interface BadgeProps {
  children: ReactNode;
  variant?: 'terracotta' | 'sage' | 'neutral' | 'gold' | 'rose';
  size?: 'sm' | 'md';
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'neutral',
  size = 'sm',
  className = ''
}) => {
  const variantStyles = {
    terracotta: 'bg-[#FAF0ED] text-[#B95B3D] border border-[#F3DDD7]',
    sage: 'bg-[#EEF2EB] text-[#4D5D44] border border-[#DCE4D6]',
    neutral: 'bg-[#F3EFE9] text-[#594D3C] border border-[#E7DFD4]',
    gold: 'bg-[#FDF8EE] text-[#9A7025] border border-[#F4E8CB]',
    rose: 'bg-[#FDF2F2] text-[#A84848] border border-[#FAD6D6]'
  };

  const sizeStyles = {
    sm: 'text-xs px-2.5 py-0.5 rounded-full font-medium',
    md: 'text-sm px-3.5 py-1 rounded-full font-medium'
  };

  return (
    <span className={`inline-flex items-center gap-1.5 whitespace-nowrap select-none ${variantStyles[variant]} ${sizeStyles[size]} ${className}`}>
      {children}
    </span>
  );
};
