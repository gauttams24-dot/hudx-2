/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import { Cpu, Wifi, ShieldCheck, Activity } from 'lucide-react';

export default function HUDHeader() {
  const [time, setTime] = useState<string>('');
  const [date, setDate] = useState<string>('');
  const [ping, setPing] = useState<number>(34);

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTime(now.toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' }));
      setDate(now.toLocaleDateString('en-US', { year: 'numeric', month: '2-digit', day: '2-digit' }).replace(/\//g, '.'));
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);

    // Dynamic fake ping/vital fluctuate slightly
    const pingInterval = setInterval(() => {
      setPing(prev => Math.max(12, Math.min(99, prev + Math.floor(Math.random() * 11) - 5)));
    }, 4000);

    return () => {
      clearInterval(interval);
      clearInterval(pingInterval);
    };
  }, []);

  return (
    <header 
      id="hud-header"
      className="bg-[#0A0A0A]/80 border-b border-white/5 backdrop-blur-md sticky top-0 z-50 px-4 py-3 select-none"
    >
      <div className="max-w-md mx-auto flex justify-between items-center font-mono">
        {/* Brand with cyber styling */}
        <div className="flex items-center space-x-2">
          <div className="relative">
            <div className="w-2 h-2 bg-[#00F0FF] rounded-full animate-pulse shadow-[0_0_8px_rgba(0,240,255,0.8)]" />
            <div className="absolute inset-0 w-2 h-2 bg-[#00F0FF] rounded-full animate-ping opacity-75" />
          </div>
          <div className="flex flex-col">
            <span className="text-[#00F0FF] font-black tracking-widest text-sm drop-shadow-[0_0_2px_rgba(0,240,255,0.6)]">HUDX</span>
            <span className="text-[7px] text-[#00F0FF]/60 uppercase tracking-widest">Cognitive Calibration</span>
          </div>
        </div>

        {/* Realtime clock display */}
        <div className="flex flex-col items-center">
          <span className="text-[#00F0FF] font-bold text-xs tracking-wider">{time}</span>
          <span className="text-[7px] text-zinc-500 tracking-widest">{date}</span>
        </div>

        {/* Telemetry quick vitals */}
        <div className="flex items-center space-x-3 text-[10px] text-zinc-400">
          <div className="flex items-center space-x-1" title={`System Latency: ${ping}ms`}>
            <Wifi className="w-3 h-3 text-[#00F0FF]" />
            <span className="text-[9px] text-[#00F0FF]/80">{ping}ms</span>
          </div>
          <div className="flex items-center space-x-1" title="Firebase Connectivity Active">
            <Cpu className="w-3 h-3 text-[#00F0FF]" />
            <span className="text-[9px] text-[#00F0FF]/80">CORE</span>
          </div>
        </div>
      </div>

      {/* Futuristic technical lines */}
      <div className="max-w-md mx-auto flex justify-between items-center text-[6px] text-zinc-500/50 mt-1.5 px-1">
        <span>SYS.STATUS: NOMINAL // CALIBRATION ACTIVE</span>
        <span>DB_REPL: FIRESTORE_UP_ACTIVE</span>
      </div>
    </header>
  );
}
