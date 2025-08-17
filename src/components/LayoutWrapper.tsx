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
            <div className="hidden lg:flex w-40 xl:w-48 h-full overflow-hidden flex-shrink-0">
              <SideAd position="left" />
            </div>
            
            {/* Main Content */}
            <main className="flex-1 h-full overflow-auto max-w-6xl mx-auto px-4 py-6 min-w-0">
              <div className="w-full">
                {children}
              </div>
            </main>
            
            {/* Right Side Ad - Desktop Only */}
            <div className="hidden lg:flex w-40 xl:w-48 h-full overflow-hidden flex-shrink-0">
              <SideAd position="right" />
            </div>
          </>
        )}
      </div>
      
      <footer className="py-6 border-t border-gray-200 text-center text-gray-500 text-sm">
        <div className="flex flex-wrap items-center justify-center gap-4 text-xs">
          <span>© {new Date().getFullYear()} NeatXL - Simple CSV cleaning tool</span>
          <span>•</span>
          <a
            href="mailto:asifzaman3123@gmail.com"
            className="font-medium text-green-700 hover:text-green-800"
          >
            asifzaman3123@gmail.com
          </a>
          <span>•</span>
          <span className="text-gray-400">MIT License — Copyright (c) 2025 Asif Zaman</span>
        </div>
      </footer>

    </div>
  );
}
