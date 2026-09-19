import React, { forwardRef } from 'react';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
  leftIcon?: React.ReactNode;
  rightElement?: React.ReactNode;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, helperText, leftIcon, rightElement, className = '', id, ...props }, ref) => {
    const inputId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

    return (
      <div className="w-full space-y-1.5 text-left">
        {label && (
          <label
            htmlFor={inputId}
            className="block font-mono text-[11px] font-bold tracking-tactical uppercase text-[#8F9CA8]"
          >
            {label}
          </label>
        )}
        <div className="relative flex items-center">
          {leftIcon && (
            <div className="absolute left-3 text-[#8F9CA8] pointer-events-none flex items-center justify-center">
              {leftIcon}
            </div>
          )}
          <input
            id={inputId}
            ref={ref}
            className={`w-full bg-[#0A0A0A] border ${
              error ? 'border-[#FF2A3D] focus:border-[#FF2A3D]' : 'border-[#2A343D] focus:border-[#00FF66]'
            } text-[#FFFFFF] placeholder-[#505D68] px-3.5 py-2.5 font-mono text-sm tracking-wide rounded-none focus:outline-none transition-colors duration-150 ${
              leftIcon ? 'pl-10' : ''
            } ${rightElement ? 'pr-12' : ''} ${className}`}
            {...props}
          />
          {rightElement && (
            <div className="absolute right-3 flex items-center text-xs font-mono text-[#8F9CA8]">
              {rightElement}
            </div>
          )}
        </div>
        {error && (
          <p className="font-mono text-[11px] text-[#FF2A3D] tracking-wide flex items-center space-x-1">
            <span>[!]</span>
            <span>{error}</span>
          </p>
        )}
        {helperText && !error && (
          <p className="font-mono text-[11px] text-[#505D68] tracking-wide">{helperText}</p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';
