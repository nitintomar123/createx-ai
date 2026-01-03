import React from 'react';
import { MessageSquare, Video, Settings, LogOut, Zap } from 'lucide-react';
import { Logo } from './Logo';
import { AppMode } from '../types';

interface SidebarProps {
  currentMode: AppMode;
  setMode: (mode: AppMode) => void;
  isMobileOpen: boolean;
  closeMobile: () => void;
  onLogout: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ currentMode, setMode, isMobileOpen, closeMobile, onLogout }) => {
  const navItems = [
    { id: AppMode.CHAT, icon: MessageSquare, label: "AI Chat" },
    { id: AppMode.CREATOR, icon: Video, label: "Content Studio" },
  ];

  return (
    <>
      {/* Mobile Overlay */}
      {isMobileOpen && (
        <div 
          className="fixed inset-0 bg-black/80 z-40 md:hidden backdrop-blur-sm"
          onClick={closeMobile}
        />
      )}

      {/* Sidebar Container */}
      <div className={`
        fixed inset-y-0 left-0 z-50 w-64 bg-gray-950 border-r border-gray-800 transform transition-transform duration-300 ease-in-out
        md:translate-x-0 md:static flex flex-col
        ${isMobileOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <div className="p-6 border-b border-gray-800/50">
          <Logo />
        </div>

        <nav className="flex-1 p-4 space-y-2">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => {
                setMode(item.id);
                closeMobile();
              }}
              className={`
                w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group
                ${currentMode === item.id 
                  ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 shadow-[0_0_15px_rgba(6,182,212,0.15)]' 
                  : 'text-gray-400 hover:bg-gray-900 hover:text-white'
                }
              `}
            >
              <item.icon size={20} className={currentMode === item.id ? "animate-pulse" : ""} />
              <span className="font-medium tracking-wide">{item.label}</span>
              {currentMode === item.id && (
                <div className="ml-auto w-1.5 h-1.5 rounded-full bg-cyan-400 shadow-[0_0_8px_rgba(6,182,212,1)]" />
              )}
            </button>
          ))}
        </nav>

        <div className="p-4 border-t border-gray-800/50">
          <div className="bg-gradient-to-br from-purple-900/20 to-blue-900/20 border border-white/5 rounded-xl p-4 mb-4">
            <div className="flex items-center gap-2 mb-2 text-purple-400">
              <Zap size={16} />
              <span className="text-xs font-bold uppercase tracking-wider">Nitro Pro</span>
            </div>
            <p className="text-xs text-gray-400 mb-3">Upgrade for 4K rendering and unlimited generation.</p>
            <button className="w-full py-2 bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold rounded-lg transition-colors neon-text-purple shadow-[0_0_10px_rgba(147,51,234,0.3)]">
              UPGRADE
            </button>
          </div>
          
          <button 
            onClick={onLogout}
            className="flex items-center gap-3 px-4 py-2 text-gray-500 hover:text-red-400 transition-colors w-full"
          >
            <LogOut size={18} />
            <span className="text-sm font-medium">Disconnect</span>
          </button>
        </div>
      </div>
    </>
  );
};