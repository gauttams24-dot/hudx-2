/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { collection, addDoc, getDocs, query, orderBy, limit, doc, deleteDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { ReflectionEntry, CognitiveState } from '../types';

const REFLECTIONS_COLLECTION = 'reflections';

// Classify the cognitive state into high-vibe cyberpunk system status tags
export function computeDominantVector(state: CognitiveState): string {
  const { focus, calm, clarity, energy } = state;

  if (energy < 25) {
    return 'CRITICAL DEPLETION';
  }
  if (focus > 75 && calm > 70 && clarity > 75) {
    return 'ZEN FLOW HARMONY';
  }
  if (focus > 80 && calm < 40) {
    return 'HYPER-DRIVE OVERCLOCK';
  }
  if (calm > 80 && focus < 40) {
    return 'COGNITIVE SUSPENSION';
  }
  if (clarity > 80 && energy > 70) {
    return 'PEAK RESOLUTION';
  }
  if (focus < 40 && clarity < 40) {
    return 'COGNITIVE FOG/STATIC';
  }
  
  return 'BALANCED CALIBRATION';
}

// Get diagnostic text based on the vector
export function getDiagnosticTip(vector: string): string {
  switch (vector) {
    case 'CRITICAL DEPLETION':
      return 'Core power reserves depleted. Recommend immediate sleep cycle or high-energy refueling.';
    case 'ZEN FLOW HARMONY':
      return 'Optimal neural synergy. Ideal for highly complex tasks, architectural design, or strategic planning.';
    case 'HYPER-DRIVE OVERCLOCK':
      return 'Extreme cognitive acceleration. High stress indicator. Introduce calming frequency blocks or cyclic deep breaths.';
    case 'COGNITIVE SUSPENSION':
      return 'Idle deep standby mode. Excellent for mental recovery, passive listening, or restorative rest.';
    case 'PEAK RESOLUTION':
      return 'Maximum resolution achieved. Thoughts are perfectly aligned. Initiate creative brainstorm subroutines.';
    case 'COGNITIVE FOG/STATIC':
      return 'High mental static detected. Clear active buffers with brief physical exercises or workspace disconnect.';
    default:
      return 'Operational stability within normal tolerances. Continuous system monitoring recommended.';
  }
}

// Fetch list of reflections
export async function fetchReflections(): Promise<ReflectionEntry[]> {
  try {
    const q = query(
      collection(db, REFLECTIONS_COLLECTION),
      orderBy('timestamp', 'desc'),
      limit(25)
    );
    const querySnapshot = await getDocs(q);
    const results: ReflectionEntry[] = [];
    querySnapshot.forEach((docSnap) => {
      const data = docSnap.data();
      results.push({
        id: docSnap.id,
        timestamp: data.timestamp || Date.now(),
        cognitiveState: data.cognitiveState || { focus: 50, calm: 50, clarity: 50, energy: 50 },
        journal: data.journal || '',
        promptCategory: data.promptCategory || 'Standard Diagnostic',
        dominantVector: data.dominantVector || 'BALANCED CALIBRATION',
        tags: data.tags || []
      });
    });
    return results;
  } catch (err) {
    console.warn("Firestore fetch error, loading from localStorage backup:", err);
    const local = localStorage.getItem('hudx_reflections');
    if (local) {
      try {
        return JSON.parse(local);
      } catch {
        return [];
      }
    }
    return [];
  }
}

// Add a reflection
export async function saveReflection(entry: Omit<ReflectionEntry, 'id'>): Promise<string> {
  try {
    const docRef = await addDoc(collection(db, REFLECTIONS_COLLECTION), entry);
    
    // Also mirror to local storage for instant query resiliency
    const localEntries = await fetchReflections();
    const newEntry: ReflectionEntry = { ...entry, id: docRef.id };
    localStorage.setItem('hudx_reflections', JSON.stringify([newEntry, ...localEntries]));
    
    return docRef.id;
  } catch (err) {
    console.error("Firestore save failed, fallback to local-only:", err);
    const tempId = 'local_' + Math.random().toString(36).substr(2, 9);
    const localEntries = localStorage.getItem('hudx_reflections');
    const list: ReflectionEntry[] = localEntries ? JSON.parse(localEntries) : [];
    const newEntry: ReflectionEntry = { ...entry, id: tempId };
    list.unshift(newEntry);
    localStorage.setItem('hudx_reflections', JSON.stringify(list));
    return tempId;
  }
}

// Delete a reflection
export async function removeReflection(id: string): Promise<void> {
  try {
    if (!id.startsWith('local_')) {
      const docRef = doc(db, REFLECTIONS_COLLECTION, id);
      await deleteDoc(docRef);
    }
    // Update localStorage mirror
    const localEntries = localStorage.getItem('hudx_reflections');
    if (localEntries) {
      const list: ReflectionEntry[] = JSON.parse(localEntries);
      const updated = list.filter(item => item.id !== id);
      localStorage.setItem('hudx_reflections', JSON.stringify(updated));
    }
  } catch (err) {
    console.error("Failed to delete document:", err);
  }
}
