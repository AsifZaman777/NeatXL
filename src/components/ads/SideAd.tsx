'use client';

import { useEffect, useState } from 'react';
import { useAdContext } from './AdContext';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import teche from '../../../public/assets/ad-images/teche.png';
import arcedemy from '../../../public/assets/ad-images/arcedemy.png';

interface SideAdProps {
  position: 'left' | 'right';
}

// Sample ad data with images and content
const adData = [
  {
    id: 1,
    image: teche,
    title: 'Tech Enovative',
    subtitle: 'Get your ultimate business ERP solution',
    description: 'We provide the best ERP solutions for your business needs',
    link: 'https://techenovative.com/',
    bgColor: 'from-blue-200 to-blue-500',
    textColor: 'text-white',
  },
  {
    id: 2,
    image: arcedemy,
    title: 'Arcedemy LMS solution',
    subtitle: 'Arcedemy is a platform to learn, grow and play',
    description: 'LMS solution for Edexcel and Cambridge students',
    link: 'https://www.arcedemy.com/',
    bgColor: 'from-orange-200 to-orange-500',
    textColor: 'text-white',
  }
];

export default function SideAd({ position }: SideAdProps) {
  const router = useRouter();
  const { incrementImpression } = useAdContext();
  const [currentAdIndex, setCurrentAdIndex] = useState(0);

  useEffect(() => {
    if (adData.length <= 1) return;

    const interval = setInterval(() => {
      setCurrentAdIndex((prevIndex) => (prevIndex + 1) % adData.length);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    incrementImpression();
  }, [incrementImpression]);

  const currentAd = adData[currentAdIndex];
  const hasMultipleAds = adData.length > 1;

  return (
    <div
      className={`h-full w-full flex ${
        position === 'left' ? 'justify-end pr-2' : 'justify-start pl-2'
      }`}
    >
      <div className="w-full max-w-[180px] h-full bg-white shadow-lg border border-gray-200 overflow-hidden flex flex-col">
        {/* Ad Header */}
        <div className="bg-gray-100 px-3 py-2 border-b border-gray-200">
          <div className="text-xs text-gray-500 font-medium">Sponsored by</div>
        </div>

        {/* Carousel Container */}
        <div className="flex-1 relative overflow-hidden">
          {/* Background Gradient */}
          <div
            className={`absolute inset-0 bg-gradient-to-b ${currentAd.bgColor} transition-all duration-1000 ease-in-out`}
          />

          {/* Image & Content */}
          <div className="absolute inset-0 flex flex-col">
            {/* Image Area */}
            {currentAd.image && (
              <div className="flex-1 flex items-center justify-center p-4">
                <Image
                  src={currentAd.image}
                  alt={currentAd.title}
                  className="w-full h-auto max-h-full object-contain rounded-lg"
                  priority
                />
              </div>
            )}

            {/* Content Area */}
            <div className="bg-black/20 backdrop-blur-sm p-3 text-center">
              <h3
                className={`text-sm font-bold ${currentAd.textColor} animate-pulse mb-1 transition-all duration-500`}
              >
                {currentAd.title}
              </h3>
              <p
                className={`text-xs ${currentAd.textColor} mb-1 transition-all duration-500`}
              >
                {currentAd.subtitle}
              </p>
              <p
                className={`text-xs ${currentAd.textColor} mb-3 transition-all duration-500`}
              >
                {currentAd.description}
              </p>

              <button
                className="w-full px-3 py-2 bg-white/20 hover:bg-white/30 backdrop-blur-sm border border-white/30 rounded text-xs font-medium text-white transition-all duration-300 hover:scale-105"
                onClick={() => {
                 const target = currentAd.link || '/ads';
                 if (/^https?:\/\//i.test(target)) {
                   window.open(target, '_blank');
                 } else {
                   router.push(target);
                 }
                }}
              >
                Learn More
              </button>
            </div>
          </div>
        </div>

        {/* footer for debugging */}
        {/* {hasMultipleAds && (
          <div className="bg-gray-50 px-3 py-2 border-t border-gray-200">
            <div className="flex items-center justify-center text-xs text-gray-500">
              <div className="flex items-center gap-1">
                <div className="w-1 h-1 bg-green-500 rounded-full animate-pulse"></div>
                <span>Auto ({adData.length})</span>
              </div>
            </div>
          </div>
        )} */}
      </div>
    </div>
  );
}
