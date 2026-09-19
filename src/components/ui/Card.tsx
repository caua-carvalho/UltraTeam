import React from 'react';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'active' | 'elevated' | 'alert';
  cornerTicks?: boolean;
  headerRight?: React.ReactNode;
  headerTitle?: string;
  headerSubtitle?: string;
}

export const Card: React.FC<CardProps> = ({
  children,
  variant = 'default',
  cornerTicks = false,
  headerTitle,
  headerSubtitle,
  headerRight,
  className = '',
  ...props
}) => {
  const variantStyles = {
    default: 'bg-[#14171A] border-[#2A343D] text-[#e3e2e5]',
    active: 'bg-[#14171A] border-[#00FF66] text-[#FFFFFF] shadow-reticle',
    elevated: 'bg-[#1A1F24] border-[#2A343D] text-[#e3e2e5]',
    alert: 'bg-[#14171A] border-[#FF2A3D] text-[#FFFFFF] shadow-reticle-red',
  };

  return (
    <div
      className={`relative border p-4 sm:p-5 ${variantStyles[variant]} ${className}`}
      {...props}
    >
      {/* Tactical Corner Reticle Markers */}
      {cornerTicks && (
        <>
          <div className="absolute top-0 left-0 w-2 h-2 border-t-2 border-l-2 border-[#00FF66] pointer-events-none -translate-x-[1px] -translate-y-[1px]" />
          <div className="absolute top-0 right-0 w-2 h-2 border-t-2 border-r-2 border-[#00FF66] pointer-events-none translate-x-[1px] -translate-y-[1px]" />
          <div className="absolute bottom-0 left-0 w-2 h-2 border-b-2 border-l-2 border-[#00FF66] pointer-events-none -translate-x-[1px] translate-y-[1px]" />
          <div className="absolute bottom-0 right-0 w-2 h-2 border-b-2 border-r-2 border-[#00FF66] pointer-events-none translate-x-[1px] translate-y-[1px]" />
        </>
      )}

      {(headerTitle || headerRight) && (
        <div className="flex items-center justify-between border-b border-[#2A343D] pb-3 mb-4">
          <div>
            {headerTitle && (
              <h3 className="font-heading font-bold text-base sm:text-lg tracking-heading text-[#FFFFFF] uppercase">
                {headerTitle}
              </h3>
            )}
            {headerSubtitle && (
              <p className="font-mono text-[11px] text-[#8F9CA8] uppercase tracking-tactical">
                {headerSubtitle}
              </p>
            )}
          </div>
          {headerRight && <div>{headerRight}</div>}
        </div>
      )}

      {children}
    </div>
  );
};
