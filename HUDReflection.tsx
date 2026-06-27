/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, FormEvent } from 'react';
import { CognitiveState, ReflectionEntry } from '../types';
import { computeDominantVector, getDiagnosticTip } from '../utils/reflectionDb';
import { Save, BrainCircuit, RefreshCw, Layers, CheckCircle } from 'lucide-react';

interface HUDReflectionProps {
  onSaveEntry: (entry: Omit<ReflectionEntry, 'id'>) => Promise<void>;
}

interface PromptPreset {
  id: string;
  label: string;
  desc: string;
  prompt: string;
  defaultState: CognitiveState;
}

const PROMPT_PRESETS: PromptPreset[] = [
  {
    id: 'recon',
    label: '01. AM_PULSE',
    desc: 'Morning tuning & objective setup',
    prompt: 'Define your main cognitive objective for this execution window. What single thread requires absolute focus?',
    defaultState: { focus: 70, calm: 65, clarity: 75, energy: 80 }
  },
  {
    id: 'overload',
    label: '02. OVERLOAD_DIAG',
    desc: 'Stress or mental block venting',
    prompt: 'Identify the active background subroutines consuming mental memory. What holds you back or causes cognitive static?',
    defaultState: { focus: 50, calm: 25, clarity: 40, energy: 60 }
  },
  {
    id: 'spark',
    label: '03. SPARK_FLOW',
    desc: 'Creative visioning & idea capture',
    prompt: 'A core mental spark is active. Detail the architecture of your current brainstorm or breakthrough.',
    defaultState: { focus: 85, calm: 50, clarity: 80, energy: 75 }
  },
  {
    id: 'shutdown',
    label: '04. PM_ARCHIVE',
    desc: 'Evening cool-down & reflection',
    prompt: 'Execution cycle complete. What was the most systemically efficient node of your day? Archive any uncompleted tasks.',
    defaultState: { focus: 40, calm: 80, clarity: 70, energy: 30 }
  }
];

export default function HUDReflection({ onSaveEntry }: HUDReflectionProps) {
  // Current cognitive tuning sliders state
  const [state, setState] = useState<CognitiveState>({
    focus: 60,
    calm: 60,
    clarity: 60,
    energy: 60
  });

  const [activePreset, setActivePreset] = useState<string>('recon');
  const [journal, setJournal] = useState<string>('');
  const [selectedPrompt, setSelectedPrompt] = useState<string>(PROMPT_PRESETS[0].prompt);
  const [isSaving, setIsSaving] = useState(false);
  const [success, setSuccess] = useState(false);

  // Auto-set slider state on preset change
  const handlePresetSelect = (preset: PromptPreset) => {
    setActivePreset(preset.id);
    setSelectedPrompt(preset.prompt);
    setState(preset.defaultState);
  };

  const handleSliderChange = (metric: keyof CognitiveState, value: number) => {
    setState(prev => ({ ...prev, [metric]: value }));
  };

  const currentVector = computeDominantVector(state);
  const currentTip = getDiagnosticTip(currentVector);

  // Generate automated tags based on scores
  const getGeneratedTags = (): string[] => {
    const tags: string[] = ['hudx'];
    const preset = PROMPT_PRESETS.find(p => p.id === activePreset);
    if (preset) {
      tags.push(preset.id);
    }
    if (state.focus > 75) tags.push('hyperfocus');
    if (state.calm > 75) tags.push('deepcalm');
    if (state.energy < 30) tags.push('rest_mode');
    if (state.clarity > 75) tags.push('peakclarity');
    return tags;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (isSaving) return;

    setIsSaving(true);
    setSuccess(false);

    try {
      const activeCategoryLabel = PROMPT_PRESETS.find(p => p.id === activePreset)?.label || 'AM_PULSE';
      
      const newEntry: Omit<ReflectionEntry, 'id'> = {
        timestamp: Date.now(),
        cognitiveState: state,
        journal,
        promptCategory: activeCategoryLabel,
        dominantVector: currentVector,
        tags: getGeneratedTags()
      };

      await onSaveEntry(newEntry);
      
      setSuccess(true);
      setJournal('');
      
      // Clear success visual indicator after a short duration
      setTimeout(() => {
        setSuccess(false);
      }, 4000);
    } catch (err) {
      console.error(err);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <form id="hud-reflection" onSubmit={handleSubmit} className="space-y-6 pb-24 font-mono">
      
      {/* Step 1: Subroutine Preset Deck */}
      <div className="space-y-2">
        <label className="text-[10px] text-zinc-500 tracking-widest uppercase block px-1">
          Select Subroutine Preset
        </label>
        <div className="grid grid-cols-2 gap-2">
          {PROMPT_PRESETS.map((preset) => (
            <button
              key={preset.id}
              type="button"
              id={`preset-${preset.id}`}
              onClick={() => handlePresetSelect(preset)}
              className={`p-3 rounded-2xl border text-left transition-all duration-300 relative overflow-hidden ${
                activePreset === preset.id
                  ? 'bg-[#00F0FF]/10 border-[#00F0FF]/80 text-[#00F0FF] shadow-[0_0_8px_rgba(0,240,255,0.25)]'
                  : 'bg-[#111111] border-white/5 text-zinc-400 hover:border-white/10'
              }`}
            >
              <div className="text-[11px] font-bold tracking-wider">{preset.label}</div>
              <div className="text-[8px] text-zinc-500 mt-0.5 truncate">{preset.desc}</div>
              {activePreset === preset.id && (
                <div className="absolute top-2 right-3 w-1.5 h-1.5 bg-[#00F0FF] rounded-full shadow-[0_0_4px_#00F0FF]" />
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Step 2: Interactive Slider Deck */}
      <div className="bg-[#111] border border-white/5 rounded-3xl p-5 space-y-4 relative">
        <div className="flex justify-between items-center border-b border-white/5 pb-2.5 mb-2 text-[10px] text-zinc-500">
          <span className="flex items-center gap-1">
            <Layers className="w-3 h-3 text-[#00F0FF]" /> ACTIVE ANALOG TUNERS
          </span>
          <span>CALIBRATE VALUES</span>
        </div>

        {/* Sliders loop */}
        {[
          { key: 'focus' as keyof CognitiveState, label: 'FOCUS', desc: 'Attention lock and task tenacity', color: 'accent-[#00F0FF]' },
          { key: 'calm' as keyof CognitiveState, label: 'CALM', desc: 'Stress buffer and tranquil reserve', color: 'accent-white' },
          { key: 'clarity' as keyof CognitiveState, label: 'CLARITY', desc: 'Active mental buffer clarity', color: 'accent-zinc-400' },
          { key: 'energy' as keyof CognitiveState, label: 'ENERGY', desc: 'Available neural power reserves', color: 'accent-[#00F0FF]' }
        ].map((item) => (
          <div key={item.key} id={`slider-group-${item.key}`} className="space-y-1.5 select-none">
            <div className="flex justify-between items-end text-xs">
              <div>
                <span className="text-zinc-300 font-medium tracking-wide">{item.label}</span>
                <span className="text-[8px] text-zinc-600 uppercase ml-2 tracking-wide hidden sm:inline">{item.desc}</span>
              </div>
              <span className="text-[#00F0FF] font-bold">{state[item.key]}%</span>
            </div>

            <div className="flex items-center space-x-3">
              <input
                type="range"
                id={`slider-${item.key}`}
                min="0"
                max="100"
                step="5"
                value={state[item.key]}
                onChange={(e) => handleSliderChange(item.key, parseInt(e.target.value))}
                className={`w-full h-1 bg-zinc-900 rounded-full appearance-none cursor-pointer border border-white/5 ${item.color}`}
              />
            </div>
          </div>
        ))}
      </div>

      {/* Real-time Diagnostic Screen */}
      <div className="bg-[#161616] border border-white/5 rounded-2xl p-4 space-y-2 relative overflow-hidden">
        <div className="flex items-center space-x-1.5 text-[10px] text-[#00F0FF] font-bold">
          <BrainCircuit className="w-3.5 h-3.5 animate-pulse" />
          <span>REAL-TIME TELEMETRY DIAGNOSTIC</span>
        </div>

        <div className="space-y-1">
          <div className="text-xs text-white font-black tracking-wider uppercase">
            VECTOR: {currentVector}
          </div>
          <p className="text-[11px] text-zinc-400 leading-relaxed bg-[#0A0A0A]/40 p-2.5 rounded-lg border border-white/5">
            {currentTip}
          </p>
        </div>
      </div>

      {/* Prompt Display & Thought Logger */}
      <div className="space-y-2">
        <div className="bg-[#111] border border-white/5 p-4 rounded-2xl">
          <div className="text-[9px] text-zinc-500 uppercase font-bold tracking-widest mb-1">
            Core Inquiry Prompt
          </div>
          <p className="text-xs text-zinc-300 leading-relaxed italic">
            "{selectedPrompt}"
          </p>
        </div>

        <div className="relative">
          <textarea
            id="reflection-journal-input"
            rows={4}
            value={journal}
            onChange={(e) => setJournal(e.target.value)}
            placeholder="Input active neural thoughts. Standardize entry strings..."
            className="w-full bg-[#0A0A0A] border border-white/10 rounded-2xl p-4 text-xs font-mono text-zinc-300 placeholder-zinc-700 focus:outline-none focus:border-[#00F0FF]/50 focus:ring-1 focus:ring-[#00F0FF]/50 transition-all duration-300 resize-none shadow-[inset_0_2px_4px_rgba(0,0,0,0.8)]"
          />
          {/* Futuristic flashing caret inside empty text area */}
          {!journal && (
            <div className="absolute left-4 top-[17px] w-1.5 h-3.5 bg-[#00F0FF]/40 animate-pulse pointer-events-none" />
          )}
        </div>
      </div>

      {/* Generated Tags and Calibration Button */}
      <div className="space-y-3">
        {/* Dynamic Tags Preview */}
        <div className="flex flex-wrap items-center gap-1.5 px-1">
          <span className="text-[9px] text-zinc-600 uppercase tracking-widest mr-1">Generated Tags:</span>
          {getGeneratedTags().map((tag) => (
            <span key={tag} className="text-[9px] bg-[#111] text-zinc-400 border border-white/5 px-2 py-0.5 rounded-full">
              #{tag}
            </span>
          ))}
        </div>

        {/* Submit action button */}
        <button
          type="submit"
          id="save-tuning-btn"
          disabled={isSaving}
          className={`w-full py-4 rounded-2xl font-bold tracking-widest text-xs uppercase transition-all duration-500 flex items-center justify-center space-x-2 relative overflow-hidden ${
            success
              ? 'bg-white text-black font-black shadow-[0_0_15px_rgba(255,255,255,0.6)]'
              : 'bg-[#00F0FF] hover:bg-[#00F0FF]/95 text-black hover:shadow-[0_0_15px_rgba(0,240,255,0.5)] cursor-pointer'
          }`}
        >
          {isSaving ? (
            <>
              <RefreshCw className="w-4 h-4 animate-spin" />
              <span>WRITING TO CORE MEMORY...</span>
            </>
          ) : success ? (
            <>
              <CheckCircle className="w-4 h-4" />
              <span>CALIBRATION SEQUENCE RECORDED!</span>
            </>
          ) : (
            <>
              <Save className="w-4 h-4" />
              <span>INITIATE MEMORY RECORD WRITE</span>
            </>
          )}

          {/* Glowing particle layer */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full hover:animate-[shimmer_1.5s_infinite]" />
        </button>
      </div>

    </form>
  );
}
