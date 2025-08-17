'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { ReactNode, useEffect, useState } from 'react';

interface SmoothDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onOpen: () => void;
  title: string;
  subtitle?: string;
  children: ReactNode;
  minHeight?: number;
  maxHeight?: number;
  initialHeight?: number;
  showPeek?: boolean;
}

export default function SmoothDrawer({
  isOpen,
  onClose,
  onOpen,
  title,
  subtitle,
  children,
  minHeight = 200,
  maxHeight = 600,
  initialHeight = 400,
  showPeek = false,
}: SmoothDrawerProps) {
  const [drawerHeight, setDrawerHeight] = useState(initialHeight);
  const [isDragging, setIsDragging] = useState(false);
  const [startY, setStartY] = useState(0);
  const [startHeight, setStartHeight] = useState(0);

  // Handle resize functionality
  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setStartY(e.clientY);
    setStartHeight(drawerHeight);
    e.preventDefault();
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (!isDragging) return;
    
    const deltaY = startY - e.clientY;
    
    // If drawer is closed (peek mode) and user drags up, open it
    if (!isOpen && deltaY > 10) {
      onOpen();
      setStartY(e.clientY);
      setStartHeight(initialHeight);
      return;
    }
    
    // If drawer is open, handle resizing
    if (isOpen) {
      const newHeight = startHeight + deltaY;
      setDrawerHeight(Math.max(minHeight, Math.min(newHeight, maxHeight)));
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [isDragging, startY, startHeight]);

  // Prevent scroll when dragging
  useEffect(() => {
    if (isDragging) {
      document.body.style.userSelect = 'none';
      document.body.style.cursor = isOpen ? 'ns-resize' : 'n-resize';
    } else {
      document.body.style.userSelect = '';
      document.body.style.cursor = '';
    }
  }, [isDragging, isOpen]);

  return (
    <AnimatePresence>
      {(isOpen || showPeek) && (
        <div className="fixed inset-0 z-50 pointer-events-none">
          {/* Backdrop - only show when fully open */}
          {isOpen && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="absolute inset-0 bg-black/20 backdrop-blur-sm pointer-events-auto"
              onClick={onClose}
            />
          )}

          {/* Drawer */}
          <motion.div
            initial={{ y: '100%' }}
            animate={{ 
              y: isOpen ? 0 : showPeek ? `calc(100% - 80px)` : '100%'
            }}
            exit={{ y: '100%' }}
            transition={{
              type: 'spring',
              damping: 30,
              stiffness: 100,
              duration: 0.3,
            }}
            className="absolute bottom-0 left-0 right-0 pointer-events-auto"
            style={{ height: isOpen ? `${drawerHeight}px` : '80px' }}
          >
            <div className="h-full bg-gradient-to-r from-green-200 to-green-400 border-t-2 border-green-500 shadow-2xl rounded-t-xl overflow-hidden">
              {/* Resize Handle */}
              <div
                className={`w-full h-6 bg-gradient-to-b from-green-400 to-green-600 hover:from-green-600 hover:to-green-700 flex items-center justify-center group transition-all duration-200 ${
                  isOpen ? 'cursor-ns-resize' : 'cursor-n-resize'
                }`}
                onMouseDown={handleMouseDown}
              >
                <div className="flex flex-col items-center space-y-1">
                  <div className={`w-12 h-1 rounded-full group-hover:bg-green-300 transition-all duration-200 ${
                    isOpen ? 'bg-green-200' : 'bg-green-200'
                  }`}></div>
                  <div className={`w-8 h-1 rounded-full group-hover:bg-green-300 transition-all duration-200 ${
                    isOpen ? 'bg-green-200' : 'bg-green-200'
                  }`}></div>
                </div>
              </div>

              {/* Header */}
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1, duration: 0.3 }}
                className="flex items-center justify-between p-4 border-b border-gray-500 bg-gradient-to-r from-green-100 to-emerald-400"
              >
                <div className="flex items-center space-x-3">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.2, type: 'spring', stiffness: 400, damping: 25 }}
                    className="bg-green-200  p-2 rounded-lg"
                  >
                    <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4" />
                    </svg>
                  </motion.div>
                  <div>
                    <h3 className="text-lg font-bold text-green-800">{title}</h3>
                    {subtitle && (
                      <p className="text-sm text-green-600">{subtitle}</p>
                    )}
                  </div>
                </div>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={onClose}
                  className="bg-gray-100 hover:bg-gray-200 p-2 rounded-lg transition-colors duration-200"
                >
                  <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </motion.button>
              </motion.div>

              {/* Content */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.15, duration: 0.3 }}
                className="overflow-y-auto scrollbar-thin scrollbar-thumb-green-300 scrollbar-track-green-50"
                style={{ height: `${drawerHeight - 140}px` }}
              >
                <div className="p-4">
                  {children}
                </div>
              </motion.div>

              {/* Footer */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.3 }}
                className="absolute bottom-0 left-0 right-0 border-t border-gray-200 p-3 bg-gradient-to-r from-gray-50 to-green-50 flex justify-center items-center"
              >
                <div className="text-sm text-gray-600 text-center flex items-center space-x-2">
                  <span>© 2025 NeatXL - Simple CSV cleaning tool</span>
                  <span className="text-gray-400">•</span>
                  <span className="text-blue-600 hover:text-blue-800 transition-colors">asifzaman3123@gmail.com</span>
                  <span className="text-gray-400">•</span>
                  <span className="text-gray-500">MIT License — Copyright (c) 2025 Asif Zaman</span>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
