import React, { ReactNode } from 'react';

interface CardProps {
  children: ReactNode;
  className?: string;
  hoverEffect?: boolean;
  onClick?: () => void;
}

export const Card: React.FC<CardProps> = ({
  children,
  className = '',
  hoverEffect = false,
  onClick
}) => {
  return (
    <div
      onClick={onClick}
      className={`bg-white rounded-2xl border border-[#E7DFD4]/80 p-5 md:p-6 transition-all duration-200 ${
        hoverEffect ? 'hover:border-[#D2C4B1] hover:shadow-md cursor-pointer' : ''
      } ${className}`}
    >
      {children}
    </div>
  );
};
