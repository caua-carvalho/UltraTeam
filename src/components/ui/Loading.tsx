import React from 'react';

interface LoadingProps {
  message?: string;
  fullScreen?: boolean;
}

export const Loading: React.FC<LoadingProps> = ({
  message = 'SINCRONIZANDO TELEMETRIA...',
  fullScreen = false,
}) => {
  const content = (
    <div className="flex flex-col items-center justify-center p-8 space-y-4">
      <div className="relative w-12 h-12 flex items-center justify-center">
        {/* Reticle Spinner */}
        <div className="absolute inset-0 border-2 border-[#2A343D] rounded-none" />
        <div className="absolute inset-0 border-2 border-t-[#00FF66] border-r-transparent border-b-transparent border-l-transparent animate-spin" />
        <div className="w-2 h-2 bg-[#00FF66] animate-pulse" />
      </div>
      <div className="text-center space-y-1">
        <p className="font-mono text-xs font-bold tracking-tactical text-[#00FF66] uppercase animate-pulse">
          {message}
        </p>
        <p className="font-mono text-[10px] text-[#8F9CA8] uppercase tracking-wider">
          STATUS: CONECTANDO AO SERVIDOR
        </p>
      </div>
    </div>
  );

  if (fullScreen) {
    return (
      <div className="fixed inset-0 bg-[#060709] z-50 flex items-center justify-center">
        {content}
      </div>
    );
  }

  return content;
};

export const SkeletonCard: React.FC = () => {
  return (
    <div className="border border-[#2A343D] bg-[#14171A] p-4 space-y-4 animate-pulse">
      <div className="flex justify-between items-center">
        <div className="h-4 bg-[#2A343D] w-1/3" />
        <div className="h-4 bg-[#2A343D] w-1/5" />
      </div>
      <div className="space-y-2">
        <div className="h-3 bg-[#1A1F24] w-full" />
        <div className="h-3 bg-[#1A1F24] w-4/5" />
      </div>
      <div className="flex justify-between pt-2 border-t border-[#2A343D]">
        <div className="h-5 bg-[#2A343D] w-20" />
        <div className="h-5 bg-[#2A343D] w-16" />
      </div>
    </div>
  );
};
