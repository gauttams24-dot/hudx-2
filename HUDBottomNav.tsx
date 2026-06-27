/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Home, Brain, ShieldAlert } from 'lucide-react';
import { HUDTab } from '../types';

interface HUDBottomNavProps {
  activeTab: HUDTab;
  setActiveTab: (tab: HUDTab) => void;
}

export default function HUDBottomNav({ activeTab, setActiveTab }: HUDBottomNavProps) {
  const tabs: { id: HUDTab; label: string; icon: typeof Home }[] = [
    { id: 'home', label: 'SYSTEM', icon: Home },
    { id: 'reflection', label: 'REFLECT', icon: Brain },
    { id: 'settings', label: 'COGNITIVE', icon: ShieldAlert },
  ];

  return (
    <nav 
      id="hud-bottom-nav"
      className="fixed bottom-0 left-0 right-0 z-50 bg-[#0F0F0F]/95 border-t border-white/10 backdrop-blur-md px-6 pb-safe-bottom"
    >
      <div className="max-w-md mx-auto flex justify-around items-center h-16">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          
          return (
            <button
              key={tab.id}
              id={`nav-btn-${tab.id}`}
              onClick={() => setActiveTab(tab.id)}
              className="relative flex flex-col items-center justify-center w-20 h-full transition-all duration-300 group"
            >
              {/* Sci-fi top glow bar for active button */}
              <div 
                className={`absolute top-0 w-12 h-[2px] transition-all duration-300 ${
                  isActive ? 'bg-[#00F0FF] shadow-[0_0_10px_rgba(0,240,255,0.8)]' : 'bg-transparent'
                }`} 
              />
              
              <Icon 
                className={`w-5 h-5 transition-all duration-300 ${
                  isActive 
                    ? 'text-[#00F0FF] drop-shadow-[0_0_5px_rgba(0,240,255,0.6)]' 
                    : 'text-zinc-500 group-hover:text-[#00F0FF]/60'
                }`}
              />
              
              <span 
                className={`text-[9px] font-mono tracking-widest mt-1 transition-all duration-300 ${
                  isActive 
                    ? 'text-[#00F0FF] font-bold' 
                    : 'text-zinc-500 group-hover:text-[#00F0FF]/60'
                }`}
              >
                {tab.label}
              </span>

              {/* Matrix corner lines for visual polish */}
              {isActive && (
                <>
                  <div className="absolute top-1 left-2 w-1 h-1 border-t border-l border-[#00F0FF]/30" />
                  <div className="absolute top-1 right-2 w-1 h-1 border-t border-r border-[#00F0FF]/30" />
                  <div className="absolute bottom-1 left-2 w-1 h-1 border-b border-l border-[#00F0FF]/30" />
                  <div className="absolute bottom-1 right-2 w-1 h-1 border-b border-r border-[#00F0FF]/30" />
                </>
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
}
