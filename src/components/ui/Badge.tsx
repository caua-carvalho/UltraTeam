import React from 'react';
import { getActivityTypeBadgeColor, formatActivityType } from '@/lib/utils';

interface BadgeProps {
  type?: 'tiro' | 'longo' | 'leve' | 'curto' | string;
  variant?: 'green' | 'amber' | 'red' | 'slate' | 'muted';
  children?: React.ReactNode;
  size?: 'sm' | 'md';
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({
  type,
  variant,
  children,
  size = 'md',
  className = '',
}) => {
  const sizeClasses = size === 'sm' ? 'text-[9px] px-1.5 py-0.5' : 'text-[11px] px-2.5 py-0.5';

  if (type) {
    const colors = getActivityTypeBadgeColor(type);
    return (
      <span
        className={`inline-flex items-center font-mono font-bold tracking-tactical uppercase border ${colors.bg} ${colors.text} ${colors.border} ${sizeClasses} ${className}`}
      >
        {children || formatActivityType(type)}
      </span>
    );
  }

  const variantStyles = {
    green: 'bg-[#00FF66]/10 text-[#00FF66] border-[#00FF66]/40',
    amber: 'bg-[#FFB800]/10 text-[#FFB800] border-[#FFB800]/40',
    red: 'bg-[#FF2A3D]/10 text-[#FF2A3D] border-[#FF2A3D]/40',
    slate: 'bg-[#2A343D]/40 text-[#BDC8D3] border-[#2A343D]',
    muted: 'bg-[#8F9CA8]/10 text-[#8F9CA8] border-[#8F9CA8]/30',
  };

  const style = variant ? variantStyles[variant] : variantStyles.slate;

  return (
    <span
      className={`inline-flex items-center font-mono font-bold tracking-tactical uppercase border ${style} ${sizeClasses} ${className}`}
    >
      {children}
    </span>
  );
};
