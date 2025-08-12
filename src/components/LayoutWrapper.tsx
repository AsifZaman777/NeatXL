// components/LayoutWrapper.tsx
'use client';

import { useState, useEffect } from 'react';
import SideAd from './ads/SideAd';
import BannerAd from './ads/BannerAd';
import Header from './NavBar';

export default function LayoutWrapper({ children }: { children: React.ReactNode }) {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  return (
    <div className="h-screen flex flex-col">
      <BannerAd />
      <Header />
      
      <div className="flex flex-1 overflow-hidden min-h-0">
        {isClient && (
          <>
            {/* Left Side Ad - Desktop Only */}
            <div className="hidden lg:flex w-40 xl:w-48 h-full overflow-hidden">
              <SideAd position="left" />
            </div>
            
            {/* Main Content */}
            <main className="flex-1 h-full overflow-auto px-4 py-6 max-w-6xl mx-auto w-full">
              {children}
            </main>
            
            {/* Right Side Ad - Desktop Only */}
            <div className="hidden lg:flex w-40 xl:w-48 h-full overflow-hidden">
              <SideAd position="right" />
            </div>
          </>
        )}
      </div>
      
      <footer className="py-6 border-t border-gray-200 text-center text-gray-500 text-sm">
        <p>© {new Date().getFullYear()} NeatSheet - Simple CSV cleaning tool</p>
      </footer>

    </div>
  );
}
