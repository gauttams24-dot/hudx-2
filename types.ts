/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface CognitiveState {
  focus: number;     // 0 - 100
  calm: number;      // 0 - 100
  clarity: number;   // 0 - 100
  energy: number;    // 0 - 100
}

export interface ReflectionEntry {
  id: string;
  timestamp: number; // UTC ms epoch
  cognitiveState: CognitiveState;
  journal: string;
  promptCategory: string; // e.g., "Overload Diagnostic", "Creative Spark", "Daily Tuning"
  dominantVector: string; // e.g., "Deep Resonance", "Hyper-Focus", "Depleted Energy"
  tags: string[];
}

export type HUDTab = 'home' | 'reflection' | 'settings';
