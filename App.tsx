/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import HUDHeader from './components/HUDHeader';
import HUDBottomNav from './components/HUDBottomNav';
import HUDHome from './components/HUDHome';
import HUDReflection from './components/HUDReflection';
import HUDSettings from './components/HUDSettings';
import { ReflectionEntry, HUDTab } from './types';
import { fetchReflections, saveReflection, removeReflection } from './utils/reflectionDb';
import { ShieldAlert, RefreshCw } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState<HUDTab>('home');
  const [entries, setEntries] = useState<ReflectionEntry[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [systemAlert, setSystemAlert] = useState<string | null>(null);

  // Load reflections on mount
  useEffect(() => {
    const loadData = async () => {
      try {
        const results = await fetchReflections();
        setEntries(results);
      } catch (err) {
        console.error("Data load error:", err);
        setSystemAlert("SYS_WARN: DB REPLICATION ERROR");
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  const handleSaveEntry = async (newEntry: Omit<ReflectionEntry, 'id'>) => {
    try {
      const addedId = await saveReflection(newEntry);
      const entryWithId: ReflectionEntry = { ...newEntry, id: addedId };
      setEntries(prev => [entryWithId, ...prev]);
    } catch (err) {
      console.error(err);
      throw err;
    }
  };

  const handleDeleteEntry = async (id: string) => {
    try {
      await removeReflection(id);
      setEntries(prev => prev.filter(item => item.id !== id));
    } catch (err) {
      console.error(err);
    }
  };

  const handleClearAllEntries = async () => {
    try {
      // Clear all items one by one
      for (const entry of entries) {
        await removeReflection(entry.id);
      }
      setEntries([]);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div id="hudx-root" className="min-h-screen bg-[#050505] text-zinc-100 flex flex-col relative overflow-x-hidden antialiased selection:bg-[#00F0FF]/20 selection:text-[#00F0FF]">
      
      {/* Dynamic Digital Scanlines Vibe */}
      <div className="pointer-events-none fixed inset-0 z-50 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.03),rgba(0,255,0,0.01),rgba(0,0,255,0.03))] bg-[length:100%_4px,6px_100%] opacity-20" />

      {/* Header */}
      <HUDHeader />

      {/* Top Banner Alert (if any) */}
      {systemAlert && (
        <div className="bg-amber-500/10 border-b border-amber-500/20 px-4 py-1.5 flex items-center justify-center gap-2 font-mono text-[9px] text-amber-400">
          <ShieldAlert className="w-3.5 h-3.5 animate-pulse" />
          <span>{systemAlert}</span>
        </div>
      )}

      {/* Loading Scanning Screen */}
      {loading ? (
        <main className="flex-1 flex flex-col items-center justify-center font-mono space-y-4">
          <div className="relative">
            <RefreshCw className="w-8 h-8 text-[#00F0FF] animate-spin" />
            <div className="absolute inset-0 w-8 h-8 border border-[#00F0FF] rounded-full animate-ping opacity-25" />
          </div>
          <div className="text-center">
            <span className="text-[#00F0FF] font-bold text-xs tracking-widest block animate-pulse">BOOTING HUD MAIN DECK</span>
            <span className="text-[8px] text-zinc-500 uppercase tracking-widest block mt-1">FIRESTORE SYNC ACTIVE</span>
          </div>
        </main>
      ) : (
        /* Main Viewport Grid */
        <main className="flex-1 max-w-md mx-auto w-full px-4 pt-4 pb-20 overflow-y-auto">
          {activeTab === 'home' && (
            <HUDHome 
              entries={entries} 
              onDeleteEntry={handleDeleteEntry}
              onNavigateToReflect={() => setActiveTab('reflection')}
            />
          )}

          {activeTab === 'reflection' && (
            <HUDReflection 
              onSaveEntry={handleSaveEntry} 
            />
          )}

          {activeTab === 'settings' && (
            <HUDSettings 
              onClearAllEntries={handleClearAllEntries} 
              entriesCount={entries.length}
            />
          )}
        </main>
      )}

      {/* Bottom Nav */}
      <HUDBottomNav activeTab={activeTab} setActiveTab={setActiveTab} />
    </div>
  );
}
