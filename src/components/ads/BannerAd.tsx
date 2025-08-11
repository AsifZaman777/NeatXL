// components/ads/BannerAd.tsx
'use client';

import { useEffect } from 'react';
import { useAdContext } from './AdContext';

export default function BannerAd() {
  const { incrementImpression } = useAdContext();

  useEffect(() => {
    incrementImpression();
  }, [incrementImpression]);

  return (
    <div className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white">
      <div className="container mx-auto px-4 py-2 flex flex-col sm:flex-row items-center justify-between gap-2">
        <div className="text-center sm:text-left">
          <span className="font-medium">✨ Try NeatSheet Pro:</span> 
          <span className="ml-1">Unlimited processing and no ads!</span>
        </div>
        <button 
          className="text-sm bg-white text-blue-600 px-4 py-1 rounded-full font-medium hover:bg-gray-100 transition-colors whitespace-nowrap"
          onClick={() => {
            // Track click
            console.log('Banner ad clicked');
          }}
        >
          Upgrade Now
        </button>
      </div>
    </div>
  );
}
