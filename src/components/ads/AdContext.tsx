// components/ads/AdContext.tsx
'use client';

import { createContext, useState, useContext, ReactNode } from 'react';

interface AdContextType {
  showModalAd: boolean;
  triggerModalAd: (show: boolean) => void;
  adImpressionCount: number;
  incrementImpression: () => void;
}

const AdContext = createContext<AdContextType | undefined>(undefined);

export function AdProvider({ children }: { children: ReactNode }) {
  const [showModalAd, setShowModalAd] = useState(false);
  const [adImpressionCount, setAdImpressionCount] = useState(0);

  const triggerModalAd = (show: boolean) => {
    if (show && adImpressionCount < 3) { // Limit to 3 impressions per session
      setShowModalAd(true);
      setAdImpressionCount(prev => prev + 1);
    } else {
      setShowModalAd(false);
    }
  };

  const incrementImpression = () => {
    setAdImpressionCount(prev => prev + 1);
  };

  return (
    <AdContext.Provider value={{ 
      showModalAd, 
      triggerModalAd,
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
