import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';

export type Meal = { id: string; name: string; subtitle: string; icon: string; carbs: number; protein: number; targetCarbs: number; targetProtein: number; completed: boolean; notes?: string };
export type WeightEntry = { date: string; weight: number };
export type Profile = { name: string; weight: number; goalWeight: number; carbTarget: number; proteinTarget: number; waterTarget: number };
type DailyLog = { date: string; meals: Meal[]; waterMl: number };
type Store = { profile: Profile; logs: Record<string, DailyLog>; weights: WeightEntry[] };

const todayKey = () => new Date().toISOString().slice(0, 10);
const defaultMeals = (): Meal[] => [
  { id: 'breakfast', name: 'Breakfast', subtitle: 'Bread sandwich', icon: 'sunrise', carbs: 1, protein: 0, targetCarbs: 1, targetProtein: 0, completed: false },
  { id: 'lunch', name: 'Lunch', subtitle: 'Rice', icon: 'coffee', carbs: 3, protein: 0, targetCarbs: 3, targetProtein: 0, completed: false },
  { id: 'preworkout', name: 'Pre-workout', subtitle: 'Bread sandwich', icon: 'zap', carbs: 1, protein: 0, targetCarbs: 1, targetProtein: 0, completed: false },
  { id: 'dinner', name: 'Dinner', subtitle: 'Rice + chicken', icon: 'moon', carbs: 3, protein: 2, targetCarbs: 3, targetProtein: 2, completed: false },
];
const initial: Store = { profile: { name: 'Adhil', weight: 61.2, goalWeight: 70, carbTarget: 7, proteinTarget: 2, waterTarget: 3000 }, logs: {}, weights: [{ date: todayKey(), weight: 61.2 }] };

type ContextValue = { profile: Profile; meals: Meal[]; waterMl: number; weights: WeightEntry[]; hydrated: boolean; updateMeal: (id: string, patch: Partial<Meal>) => void; addPortion: (id: string, type: 'carbs' | 'protein', amount: number) => void; toggleMeal: (id: string) => void; addWater: (ml: number) => void; addWeight: (weight: number) => void; updateProfile: (patch: Partial<Profile>) => void; resetHistory: () => void };
const BulkContext = createContext<ContextValue | null>(null);
export function BulkProvider({ children }: { children: React.ReactNode }) {
  const [store, setStore] = useState<Store>(initial); const [hydrated, setHydrated] = useState(false); const key = todayKey();
  useEffect(() => { AsyncStorage.getItem('bulk-coach-store').then(raw => { if (raw) { try { setStore(JSON.parse(raw)); } catch {} } setHydrated(true); }); }, []);
  useEffect(() => { if (hydrated) AsyncStorage.setItem('bulk-coach-store', JSON.stringify(store)); }, [store, hydrated]);
  const today = store.logs[key] ?? { date: key, meals: defaultMeals(), waterMl: 0 };
  const updateToday = (fn: (d: DailyLog) => DailyLog) => setStore(s => ({ ...s, logs: { ...s.logs, [key]: fn(s.logs[key] ?? { date: key, meals: defaultMeals(), waterMl: 0 }) } }));
  const value = useMemo<ContextValue>(() => ({ profile: store.profile, meals: today.meals, waterMl: today.waterMl, weights: store.weights, hydrated, updateMeal: (id, patch) => updateToday(d => ({ ...d, meals: d.meals.map(m => m.id === id ? { ...m, ...patch } : m) })), addPortion: (id, type, amount) => updateToday(d => ({ ...d, meals: d.meals.map(m => m.id === id ? { ...m, [type]: Math.max(0, m[type] + amount) } : m) })), toggleMeal: id => updateToday(d => ({ ...d, meals: d.meals.map(m => m.id === id ? { ...m, completed: !m.completed } : m) })), addWater: ml => updateToday(d => ({ ...d, waterMl: Math.max(0, d.waterMl + ml) })), addWeight: weight => setStore(s => ({ ...s, profile: { ...s.profile, weight }, weights: [...s.weights.filter(w => w.date !== key), { date: key, weight }].slice(-60) })), updateProfile: patch => setStore(s => ({ ...s, profile: { ...s.profile, ...patch } })), resetHistory: () => setStore(s => ({ ...initial, profile: s.profile, logs: {}, weights: [] })) }), [store, today, hydrated]);
  return <BulkContext.Provider value={value}>{children}</BulkContext.Provider>;
}
export const useBulk = () => { const ctx = useContext(BulkContext); if (!ctx) throw new Error('useBulk must be used inside BulkProvider'); return ctx; };