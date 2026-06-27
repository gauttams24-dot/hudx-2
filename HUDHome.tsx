/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { ReflectionEntry, CognitiveState } from '../types';
import { getDiagnosticTip } from '../utils/reflectionDb';
import { Activity, Trash2, ChevronDown, ChevronUp } from 'lucide-react';

interface HUDHomeProps {
  entries: ReflectionEntry[];
  onDeleteEntry: (id: string) => void;
  onNavigateToReflect: () => void;
}

export default function HUDHome({ entries, onDeleteEntry, onNavigateToReflect }: HUDHomeProps) {
  const [expandedId, setExpandedId] = useState<string | null>(null);

  // Compute stats from entries
  const latestEntry = entries[0];
  const stats: CognitiveState = latestEntry?.cognitiveState || {
    focus: 50,
    calm: 50,
    clarity: 50,
    energy: 50
  };

  const hasLogs = entries.length > 0;

  // Static objectives for cyber vibe
  const [objectives, setObjectives] = useState([
    { id: 1, label: '01. Calibrate Morning Neural Node', done: hasLogs },
    { id: 2, label: '02. Log Cognitive Stress Diagnostic', done: entries.some(e => e.cognitiveState.calm < 40) },
    { id: 3, label: '03. Sustain Core Energy Above 30%', done: stats.energy > 30 },
  ]);

  const toggleObjective = (id: number) => {
    setObjectives(prev =>
      prev.map(obj => (obj.id === id ? { ...obj, done: !obj.done } : obj))
    );
  };

  const coreIndex = Math.round((stats.focus + stats.calm + stats.clarity + stats.energy) / 4);

  return (
    <div id="hud-home" className="space-y-6 pb-24 font-mono">
      
      {/* Visual Header Grid - Synaptic Pulse HUD Ring */}
      <div className="bg-[#111111] border border-white/5 rounded-3xl p-6 relative overflow-hidden flex flex-col items-center justify-center min-h-[256px]">
        {/* Animated Synaptic Rings */}
        <div className="absolute inset-0 flex items-center justify-center opacity-20 pointer-events-none">
          <div className="w-56 h-56 border border-[#00F0FF] rounded-full animate-[ping_4s_linear_infinite]" />
          <div className="absolute w-40 h-40 border border-[#00F0FF] rounded-full" />
          <div className="absolute w-24 h-24 border border-white/10 rounded-full" />
        </div>

        {/* Tech Accents in card corners */}
        <div className="absolute top-4 left-4 text-[9px] text-zinc-600 font-mono tracking-widest uppercase">
          SCAN_MODE: ACTIVE
        </div>
        <div className="absolute bottom-4 right-4 text-[9px] text-zinc-600 font-mono tracking-widest uppercase">
          VECT_ID: {latestEntry ? '992-0X' : '000-STANDBY'}
        </div>

        {/* Center Readout */}
        <div className="z-10 text-center space-y-2">
          <div className="text-6xl font-extralight tracking-tighter text-white drop-shadow-[0_0_15px_rgba(0,240,255,0.4)]">
            {coreIndex}%
          </div>
          <div className="text-[10px] uppercase tracking-[0.2em] text-[#00F0FF] font-black">
            Clarity Index
          </div>
          <p className="text-[10px] text-zinc-500 max-w-[260px] mx-auto leading-normal mt-2">
            {latestEntry ? latestEntry.dominantVector : 'STANDBY MODE'} // {latestEntry ? 'NOMINAL SYNERGY' : 'DECK STANDBY'}
          </p>
        </div>
      </div>

      {/* Diagnostic Tip Panel */}
      <div className="bg-[#161616] border border-white/5 rounded-2xl p-4 space-y-2">
        <div className="flex justify-between items-center text-[9px] text-zinc-500 tracking-wider">
          <span className="flex items-center gap-1">
            <Activity className="w-3 h-3 text-[#00F0FF] animate-pulse" /> LIVE COGNITIVE VECTOR REPORT
          </span>
          <span>SYS_REPL: FIRESTORE</span>
        </div>
        <p className="text-xs text-zinc-300 leading-relaxed">
          {latestEntry ? getDiagnosticTip(latestEntry.dominantVector) : 'Initiate your first Daily Calibration log in the Reflection deck to generate cognitive diagnostic telemetry.'}
        </p>

        {!latestEntry && (
          <button 
            id="initiate-calibration-btn"
            onClick={onNavigateToReflect}
            className="w-full text-center text-[10px] font-mono text-[#00F0FF] bg-[#00F0FF]/10 hover:bg-[#00F0FF]/20 border border-[#00F0FF]/30 py-2 rounded-lg uppercase tracking-wider transition-all duration-300"
          >
            Initiate Calibration Sequence
          </button>
        )}
      </div>

      {/* Four Core HUD Metrics Horizontal Bars inside insights Grid */}
      <div className="grid grid-cols-2 gap-3">
        {[
          { label: 'FOCUS', value: stats.focus, color: 'bg-[#00F0FF]', glow: 'shadow-[0_0_6px_rgba(0,240,255,0.4)]' },
          { label: 'CALM', value: stats.calm, color: 'bg-white', glow: 'shadow-[0_0_6px_rgba(255,255,255,0.4)]' },
          { label: 'CLARITY', value: stats.clarity, color: 'bg-zinc-400', glow: 'shadow-[0_0_6px_rgba(161,161,170,0.4)]' },
          { label: 'ENERGY', value: stats.energy, color: 'bg-[#00F0FF]', glow: 'shadow-[0_0_6px_rgba(0,240,255,0.4)]' }
        ].map((metric) => (
          <div key={metric.label} className="bg-[#161616] border border-white/5 rounded-2xl p-4 font-mono">
            <div className="flex justify-between items-center text-[10px] mb-1">
              <span className="text-zinc-500 uppercase tracking-wider">{metric.label}</span>
              <span className="text-white font-bold">{metric.value}%</span>
            </div>
            {/* Visual tech-styled progress bar */}
            <div className="w-full h-1 bg-zinc-900 mt-2 rounded-full overflow-hidden">
              <div 
                className={`h-full ${metric.color} ${metric.glow} transition-all duration-500`}
                style={{ width: `${metric.value}%` }}
              />
            </div>
          </div>
        ))}
      </div>

      {/* Cyberpunk Optimization Objectives */}
      <div className="bg-[#161616] border border-white/5 rounded-2xl p-4 font-mono">
        <span className="text-[10px] text-zinc-500 font-bold tracking-widest block border-b border-white/5 pb-2 mb-3">
          OPTIMIZATION CHECKPOINTS
        </span>
        <div className="space-y-2.5">
          {objectives.map((obj) => (
            <button
              key={obj.id}
              onClick={() => toggleObjective(obj.id)}
              className="w-full flex items-center justify-between text-left text-xs text-zinc-300 hover:text-[#00F0FF] bg-[#0A0A0A]/30 hover:bg-[#0A0A0A]/80 p-3 rounded-xl border border-white/5 transition-all duration-300"
            >
              <span className={obj.done ? 'line-through text-zinc-600' : ''}>
                {obj.label}
              </span>
              <div className={`w-3.5 h-3.5 rounded border ${
                obj.done 
                  ? 'border-[#00F0FF] bg-[#00F0FF]/20 flex items-center justify-center' 
                  : 'border-zinc-700'
              }`}>
                {obj.done && <div className="w-1.5 h-1.5 bg-[#00F0FF] rounded-sm" />}
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Recent Thoughts Timeline Feed */}
      <div className="space-y-3">
        <div className="flex justify-between items-center font-mono text-[10px] text-zinc-500 px-1">
          <span className="tracking-widest uppercase">Recent Thoughts ({entries.length})</span>
          <span>REVERSE CHRONO</span>
        </div>

        {entries.length === 0 ? (
          <div className="bg-[#0A0A0A] border border-dashed border-white/5 rounded-2xl p-8 text-center">
            <p className="text-xs text-zinc-600 leading-relaxed">
              No calibration telemetry matches in this mainframe database.<br />
              <span className="text-[#00F0FF]/50">Run active reflection scan to populate logs.</span>
            </p>
          </div>
        ) : (
          <div className="space-y-2">
            {entries.map((entry) => {
              const isExpanded = expandedId === entry.id;
              const dateStr = new Date(entry.timestamp).toLocaleTimeString('en-US', {
                hour12: false,
                hour: '2-digit',
                minute: '2-digit'
              });

              return (
                <div 
                  key={entry.id}
                  id={`log-entry-${entry.id}`}
                  className="bg-[#161616] border border-white/5 rounded-2xl overflow-hidden transition-all duration-300"
                >
                  {/* Top Bar summary of item */}
                  <div 
                    onClick={() => setExpandedId(isExpanded ? null : entry.id)}
                    className="p-3.5 flex justify-between items-center cursor-pointer hover:bg-white/5 transition-all select-none"
                  >
                    <div className="space-y-1 flex-1 min-w-0 pr-2">
                      <div className="flex items-center space-x-2">
                        <span className="text-[8px] font-mono text-[#00F0FF] bg-[#00F0FF]/10 px-1.5 py-0.5 rounded tracking-wider font-semibold">
                          {entry.dominantVector}
                        </span>
                        <span className="text-[9px] font-mono text-zinc-500">{entry.promptCategory}</span>
                      </div>
                      <p className="text-sm text-zinc-300 truncate font-sans">
                        {entry.journal || 'No notes added.'}
                      </p>
                    </div>

                    <div className="flex items-center space-x-2 flex-shrink-0">
                      <span className="text-[10px] text-zinc-600">{dateStr}</span>
                      {isExpanded ? <ChevronUp className="w-4 h-4 text-zinc-500" /> : <ChevronDown className="w-4 h-4 text-zinc-500" />}
                    </div>
                  </div>

                  {/* Expanded Body details */}
                  {isExpanded && (
                    <div className="p-4 border-t border-white/5 bg-[#0A0A0A] font-mono space-y-3">
                      <div className="grid grid-cols-4 gap-2 text-center text-[9px]">
                        <div className="bg-[#111] p-2 rounded-xl border border-white/5">
                          <span className="text-zinc-600 block">FOC</span>
                          <span className="text-[#00F0FF] font-bold">{entry.cognitiveState.focus}%</span>
                        </div>
                        <div className="bg-[#111] p-2 rounded-xl border border-white/5">
                          <span className="text-zinc-600 block">CLM</span>
                          <span className="text-white font-bold">{entry.cognitiveState.calm}%</span>
                        </div>
                        <div className="bg-[#111] p-2 rounded-xl border border-white/5">
                          <span className="text-zinc-600 block">CLR</span>
                          <span className="text-zinc-300 font-bold">{entry.cognitiveState.clarity}%</span>
                        </div>
                        <div className="bg-[#111] p-2 rounded-xl border border-white/5">
                          <span className="text-zinc-600 block">ERG</span>
                          <span className="text-[#00F0FF] font-bold">{entry.cognitiveState.energy}%</span>
                        </div>
                      </div>

                      {entry.journal && (
                        <div className="bg-[#111] p-3.5 rounded-xl border border-white/5 text-xs text-zinc-300 leading-relaxed whitespace-pre-wrap font-sans">
                          {entry.journal}
                        </div>
                      )}

                      {entry.tags && entry.tags.length > 0 && (
                        <div className="flex flex-wrap gap-1">
                          {entry.tags.map((tag) => (
                            <span key={tag} className="text-[9px] bg-white/5 text-zinc-400 border border-white/5 px-2 py-0.5 rounded-full">
                              #{tag}
                            </span>
                          ))}
                        </div>
                      )}

                      <div className="flex justify-between items-center text-[9px] pt-1">
                        <span className="text-zinc-600">ID: {entry.id}</span>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onDeleteEntry(entry.id);
                          }}
                          className="flex items-center space-x-1 text-red-400 hover:text-red-300 font-semibold bg-red-950/20 hover:bg-red-950/40 px-2.5 py-1.5 rounded-xl border border-red-500/10 transition-all duration-300"
                        >
                          <Trash2 className="w-3 h-3" />
                          <span>WIPE LOG</span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

    </div>
  );
}
