/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import { User, RotateCcw, AlertOctagon } from 'lucide-react';

interface HUDSettingsProps {
  onClearAllEntries: () => Promise<void>;
  entriesCount: number;
}

export default function HUDSettings({ onClearAllEntries, entriesCount }: HUDSettingsProps) {
  const [energyAlert, setEnergyAlert] = useState(true);
  const [overloadProtection, setOverloadProtection] = useState(false);
  const [wiping, setWiping] = useState(false);

  // Load from local storage on mount
  useEffect(() => {
    const savedEnergy = localStorage.getItem('hudx_energy_alert');
    const savedOverload = localStorage.getItem('hudx_overload_protection');
    if (savedEnergy) setEnergyAlert(savedEnergy === 'true');
    if (savedOverload) setOverloadProtection(savedOverload === 'true');
  }, []);

  const handleToggleEnergy = () => {
    const nextVal = !energyAlert;
    setEnergyAlert(nextVal);
    localStorage.setItem('hudx_energy_alert', String(nextVal));
  };

  const handleToggleOverload = () => {
    const nextVal = !overloadProtection;
    setOverloadProtection(nextVal);
    localStorage.setItem('hudx_overload_protection', String(nextVal));
  };

  const handleClearData = async () => {
    if (window.confirm("ARE YOU SURE YOU WANT TO WIPE ALL RECOGNITION DATA FROM SECURE STORAGE? THIS ACTION CANNOT BE UNDONE.")) {
      setWiping(true);
      try {
        await onClearAllEntries();
      } finally {
        setWiping(false);
      }
    }
  };

  return (
    <div id="hud-settings" className="space-y-6 pb-24 font-mono">
      
      {/* Profile / Bio Identity Section */}
      <div className="bg-[#111111] border border-white/5 rounded-2xl p-4 relative">
        <div className="flex items-center space-x-3.5">
          <div className="w-12 h-12 bg-[#00F0FF]/10 border border-[#00F0FF]/30 rounded-xl flex items-center justify-center relative">
            <User className="w-5 h-5 text-[#00F0FF]" />
            <div className="absolute -bottom-1 -right-1 w-3.5 h-3.5 bg-[#00F0FF] rounded-full border border-black flex items-center justify-center">
              <span className="text-[7px] font-black text-black">A1</span>
            </div>
          </div>
          <div>
            <span className="text-[8px] text-zinc-500 uppercase tracking-widest block">BIO-LOGICAL IDENTIFIER</span>
            <span className="text-xs text-[#00F0FF] font-bold block truncate max-w-[240px]">GauttamS24@gmail.com</span>
            <span className="text-[7px] text-[#00F0FF]/50 uppercase tracking-widest block mt-0.5">COGNITIVE ARCHITECT // SECURE MATRIX USER</span>
          </div>
        </div>
      </div>

      {/* Threshold & Preference Setup */}
      <div className="bg-[#161616] border border-white/5 rounded-2xl p-4 space-y-4">
        <span className="text-[10px] text-zinc-500 font-bold tracking-widest block border-b border-white/5 pb-2 mb-1">
          COGNITIVE SENSORS SETUP
        </span>

        {/* Energy Checkbox */}
        <button
          onClick={handleToggleEnergy}
          className="w-full flex items-start justify-between text-left group cursor-pointer"
        >
          <div className="space-y-0.5 pr-2">
            <span className="text-xs text-zinc-300 group-hover:text-[#00F0FF] transition-colors">
              Low Energy Diagnostic Alerts
            </span>
            <p className="text-[8px] text-zinc-500 leading-normal">
              Flag cognitive alerts and warnings if measured energy drop under 30%.
            </p>
          </div>
          <div className={`w-4 h-4 rounded border mt-0.5 flex-shrink-0 flex items-center justify-center transition-all ${
            energyAlert ? 'border-[#00F0FF] bg-[#00F0FF]/20' : 'border-zinc-700'
          }`}>
            {energyAlert && <div className="w-2 h-2 bg-[#00F0FF] rounded-sm" />}
          </div>
        </button>

        {/* Stress Overload dampener */}
        <button
          onClick={handleToggleOverload}
          className="w-full flex items-start justify-between text-left group cursor-pointer"
        >
          <div className="space-y-0.5 pr-2">
            <span className="text-xs text-zinc-300 group-hover:text-[#00F0FF] transition-colors">
              Mental Dampener Suggestions
            </span>
            <p className="text-[8px] text-zinc-500 leading-normal">
              Schedules visual cooldown breathing triggers if stress points peak during calibration.
            </p>
          </div>
          <div className={`w-4 h-4 rounded border mt-0.5 flex-shrink-0 flex items-center justify-center transition-all ${
            overloadProtection ? 'border-[#00F0FF] bg-[#00F0FF]/20' : 'border-zinc-700'
          }`}>
            {overloadProtection && <div className="w-2 h-2 bg-[#00F0FF] rounded-sm" />}
          </div>
        </button>

        {/* Database Sync Toggle */}
        <div className="flex items-start justify-between">
          <div className="space-y-0.5 pr-2">
            <span className="text-xs text-zinc-300">
              Live Cloud Replication Sync
            </span>
            <p className="text-[8px] text-zinc-500 leading-normal">
              Replicate cognitive matrices immediately to secure Firebase Firestore server.
            </p>
          </div>
          <div className="w-4 h-4 rounded border mt-0.5 flex-shrink-0 flex items-center justify-center border-[#00F0FF] bg-[#00F0FF]/20 cursor-not-allowed">
            <div className="w-2 h-2 bg-[#00F0FF] rounded-sm" />
          </div>
        </div>
      </div>

      {/* Cloud DB Metrics Telemetry */}
      <div className="bg-[#111111] border border-white/5 rounded-2xl p-4 space-y-3">
        <span className="text-[10px] text-zinc-500 font-bold tracking-widest block border-b border-white/5 pb-2 mb-1">
          DATABASE DIAGNOSTIC TELEMETRY
        </span>

        <div className="space-y-1.5 text-[9px] text-zinc-400">
          <div className="flex justify-between border-b border-white/5 pb-1">
            <span className="text-zinc-600">DATABASE PLATFORM</span>
            <span className="text-[#00F0FF] font-bold">FIREBASE FIRESTORE v9+</span>
          </div>
          <div className="flex justify-between border-b border-white/5 pb-1">
            <span className="text-zinc-600">PROJECT ID</span>
            <span className="text-[#00F0FF]">silicon-aviary-wcwq9</span>
          </div>
          <div className="flex justify-between border-b border-white/5 pb-1">
            <span className="text-zinc-600">DATABASE ID</span>
            <span className="text-[#00F0FF] font-mono truncate max-w-[150px]">ai-studio-hudx-...</span>
          </div>
          <div className="flex justify-between border-b border-white/5 pb-1">
            <span className="text-zinc-600">RECORD METRIC COUNT</span>
            <span className="text-[#00F0FF] font-bold">{entriesCount} ACTIVE RECORDS</span>
          </div>
          <div className="flex justify-between">
            <span className="text-zinc-600">SYNC CHANNEL STATUS</span>
            <span className="text-[#00F0FF] font-bold flex items-center gap-1">
              <span className="w-1.5 h-1.5 bg-[#00F0FF] rounded-full animate-ping" />
              ONLINE
            </span>
          </div>
        </div>
      </div>

      {/* System Wipe Area */}
      <div className="bg-red-950/10 border border-red-500/20 rounded-2xl p-4 space-y-3">
        <div className="flex items-center space-x-2 text-xs text-red-400 font-bold">
          <AlertOctagon className="w-4 h-4 text-red-400 animate-pulse" />
          <span>SYS.DESTRUCTION PROTOCOLS</span>
        </div>
        <p className="text-[8px] text-red-400/70 leading-normal">
          Wiping the cognitive logs triggers clean operations. This resets Firestore data, empties internal indices, and wipes browser localStorage memories completely.
        </p>
        <button
          type="button"
          id="wipe-data-btn"
          disabled={wiping}
          onClick={handleClearData}
          className="w-full bg-red-500/10 hover:bg-red-500/20 text-red-400 hover:text-red-300 border border-red-500/30 rounded-2xl py-2.5 text-xs tracking-widest font-bold uppercase transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          {wiping ? 'PURGING MEMORIES...' : 'WIPE INTEGRAL MEMORY CORE'}
        </button>
      </div>

    </div>
  );
}
