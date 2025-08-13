'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { CSVData } from '../types/types';

interface DataContextType {
  csvData: CSVData | null;
  setCsvData: (data: CSVData | null) => void;
  reorderedData: CSVData | null;
  setReorderedData: (data: CSVData | null) => void;
  clearAllData: () => void;
  hasData: boolean;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

interface DataProviderProps {
  children: ReactNode;
}

export const DataProvider: React.FC<DataProviderProps> = ({ children }) => {
  const [csvData, setCsvDataState] = useState<CSVData | null>(null);
  const [reorderedData, setReorderedDataState] = useState<CSVData | null>(null);

  // Load data from localStorage on mount
  useEffect(() => {
    const savedCsvData = localStorage.getItem('neatsheet-csv-data');
    const savedReorderedData = localStorage.getItem('neatsheet-reordered-data');
    
    if (savedCsvData) {
      try {
        setCsvDataState(JSON.parse(savedCsvData));
      } catch (error) {
        console.error('Error loading CSV data from localStorage:', error);
        localStorage.removeItem('neatsheet-csv-data');
      }
    }
    
    if (savedReorderedData) {
      try {
        setReorderedDataState(JSON.parse(savedReorderedData));
      } catch (error) {
        console.error('Error loading reordered data from localStorage:', error);
        localStorage.removeItem('neatsheet-reordered-data');
      }
    }
  }, []);

  const setCsvData = (data: CSVData | null) => {
    setCsvDataState(data);
    if (data) {
      localStorage.setItem('neatsheet-csv-data', JSON.stringify(data));
    } else {
      localStorage.removeItem('neatsheet-csv-data');
    }
  };

  const setReorderedData = (data: CSVData | null) => {
    setReorderedDataState(data);
    if (data) {
      localStorage.setItem('neatsheet-reordered-data', JSON.stringify(data));
    } else {
      localStorage.removeItem('neatsheet-reordered-data');
    }
  };

  const clearAllData = () => {
    setCsvDataState(null);
    setReorderedDataState(null);
    localStorage.removeItem('neatsheet-csv-data');
    localStorage.removeItem('neatsheet-reordered-data');
  };

  const hasData = csvData !== null;

  const contextValue: DataContextType = {
    csvData,
    setCsvData,
    reorderedData,
    setReorderedData,
    clearAllData,
    hasData,
  };

  return (
    <DataContext.Provider value={contextValue}>
      {children}
    </DataContext.Provider>
  );
};

export const useData = (): DataContextType => {
  const context = useContext(DataContext);
  if (context === undefined) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
};
