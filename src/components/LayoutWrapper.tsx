// components/LayoutWrapper.tsx
'use client';

import { useState, useEffect } from 'react';
import { useAdContext } from './ads/AdContext';
import ModalAd from './ads/ModalAd';
import SideAd from './ads/SideAd';
import BannerAd from './ads/BannerAd';
import Header from './Header';

export default function LayoutWrapper({ children }: { children: React.ReactNode }) {
  const { triggerModalAd } = useAdContext();
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    
    // Show modal ad after 30 seconds
    const timer = setTimeout(() => {
      triggerModalAd(true);
    }, 30000);

    return () => clearTimeout(timer);
  }, [triggerModalAd]);

  return (
    <div className="min-h-screen flex flex-col">
      <BannerAd />
      <Header />
      
      <div className="flex flex-1">
        {isClient && (
          <>
            {/* Left Side Ad - Desktop Only */}
            <div className="hidden lg:block w-40 xl:w-48 sticky top-0 h-[calc(100vh-4rem)]">
              <SideAd position="left" />
            </div>
            
            {/* Main Content */}
            <main className="flex-1 px-4 py-6 max-w-6xl mx-auto w-full">
              {children}
            </main>
            
            {/* Right Side Ad - Desktop Only */}
            <div className="hidden lg:block w-40 xl:w-48 sticky top-0 h-[calc(100vh-4rem)]">
              <SideAd position="right" />
            </div>
          </>
        )}
      </div>
      
      <footer className="py-6 border-t border-gray-200 text-center text-gray-500 text-sm">
        <p>© {new Date().getFullYear()} NeatSheet - Simple CSV cleaning tool</p>
      </footer>
      
      <ModalAd />
    </div>
  );
}
