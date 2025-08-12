// components/ads/SideAd.tsx
'use client';

import { useEffect } from 'react';
import { useAdContext } from './AdContext';

interface SideAdProps {
  position: 'left' | 'right';
}

export default function SideAd({ position }: SideAdProps) {
  const { incrementImpression } = useAdContext();

  // Simulate ad impression tracking
  useEffect(() => {
    incrementImpression();
  }, [incrementImpression]);

  return (
    <div className={`h-full w-full flex ${position === 'left' ? 'justify-end pr-4' : 'justify-start pl-4'} pt-8`}>
      <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 w-36 h-fit">
        <div className="text-xs text-gray-400 mb-1">Sponsored</div>
        <div className="bg-gray-200 border-2 border-dashed rounded-lg w-full h-32 flex items-center justify-center text-gray-500 mb-2">
          Ad Content
        </div>
        <div className="text-xs font-medium text-gray-700 mb-1">DataTools Pro</div>
        <div className="text-[0.65rem] text-gray-500 mb-2">Advanced data processing made easy</div>
        <button 
          className="text-xs text-blue-600 hover:text-blue-800 w-full text-center"
          onClick={() => {
            // Track ad click
            console.log('Side ad clicked');
          }}
        >
          Learn More
        </button>
      </div>
    </div>
  );
}
