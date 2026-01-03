import React from 'react';

export const Logo: React.FC<{ className?: string }> = ({ className = "" }) => {
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <div className="relative w-10 h-10 flex items-center justify-center bg-gray-900 border border-cyan-500/50 rounded-lg neon-border-blue transform -skew-x-12">
        <span className="text-2xl font-bold text-cyan-400 font-orbitron brand-font">X</span>
        <div className="absolute inset-0 bg-cyan-500/10 rounded-lg animate-pulse"></div>
      </div>
      <div className="flex flex-col">
        <span className="text-xl font-bold tracking-wider text-white brand-font">
          Create<span className="text-cyan-400 neon-text-blue">X</span>.ai
        </span>
        <span className="text-[0.6rem] text-gray-500 uppercase tracking-[0.2em] font-semibold">
          By Nitro Studio
        </span>
      </div>
    </div>
  );
};