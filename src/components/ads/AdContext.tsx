// components/ads/AdContext.tsx
'use client';

import { createContext, useState, useContext, ReactNode, useCallback } from 'react';

interface AdContextType {
  adImpressionCount: number;
  incrementImpression: () => void;
}

const AdContext = createContext<AdContextType | undefined>(undefined);

export function AdProvider({ children }: { children: ReactNode }) {
  const [adImpressionCount, setAdImpressionCount] = useState(0);

  const incrementImpression = useCallback(() => {
    setAdImpressionCount(prev => prev + 1);
  }, []);

  return (
    <AdContext.Provider value={{ 
      adImpressionCount,
      incrementImpression
    }}>
      {children}
    </AdContext.Provider>
  );
}

export function useAdContext() {
  const context = useContext(AdContext);
  if (!context) {
    throw new Error('useAdContext must be used within an AdProvider');
  }
  return context;
}
