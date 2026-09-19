import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'danger' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  chamfered?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  isLoading = false,
  chamfered = false,
  className = '',
  disabled,
  ...props
}) => {
  const baseStyles =
    'relative inline-flex items-center justify-center font-mono font-bold tracking-tactical uppercase transition-all duration-150 select-none focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed';

  const sizeStyles = {
    sm: 'text-xs px-3 py-1.5 h-8',
    md: 'text-xs px-4 py-2.5 h-10',
    lg: 'text-sm px-6 py-3 h-12',
  };

  const variantStyles = {
    primary:
      'bg-[#00FF66] text-[#060709] hover:bg-[#00e55b] active:translate-y-[1px] hover:shadow-reticle border border-[#00FF66]',
    secondary:
      'bg-[#14171A] text-[#FFFFFF] border border-[#2A343D] hover:border-[#8F9CA8] hover:bg-[#1A1F24] active:translate-y-[1px]',
    outline:
      'bg-transparent text-[#00FF66] border border-[#00FF66]/60 hover:border-[#00FF66] hover:bg-[#00FF66]/10 active:translate-y-[1px]',
    danger:
      'bg-[#FF2A3D]/10 text-[#FF2A3D] border border-[#FF2A3D]/60 hover:bg-[#FF2A3D]/20 hover:border-[#FF2A3D] active:translate-y-[1px]',
    ghost:
      'bg-transparent text-[#8F9CA8] hover:text-[#FFFFFF] hover:bg-[#14171A]',
  };

  const chamferClass = chamfered
    ? '[clip-path:polygon(0_0,calc(100%-8px)_0,100%_8px,100%_100%,0_100%)]'
    : '';

  return (
    <button
      className={`${baseStyles} ${sizeStyles[size]} ${variantStyles[variant]} ${chamferClass} ${className}`}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading ? (
        <div className="flex items-center space-x-2">
          <div className="w-3.5 h-3.5 border-2 border-current border-t-transparent animate-spin" />
          <span>PROCESSANDO...</span>
        </div>
      ) : (
        children
      )}
    </button>
  );
};
