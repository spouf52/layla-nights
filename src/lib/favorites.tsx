import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from 'react';
import * as Haptics from 'expo-haptics';

type FavoritesCtx = {
  ids: string[];
  has: (id: string) => boolean;
  toggle: (id: string) => void;
  count: number;
};

const Ctx = createContext<FavoritesCtx | null>(null);

export function FavoritesProvider({ children }: { children: ReactNode }) {
  const [ids, setIds] = useState<string[]>([]);
  const toggle = useCallback((id: string) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
    setIds((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));
  }, []);
  const value = useMemo<FavoritesCtx>(
    () => ({ ids, has: (id) => ids.includes(id), toggle, count: ids.length }),
    [ids, toggle],
  );
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useFavorites(): FavoritesCtx {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error('useFavorites must be used inside FavoritesProvider');
  return ctx;
}
