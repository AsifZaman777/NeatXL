// components/FixedDataPreview.tsx
'use client';

import { useState } from 'react';
import DataPreview from './DataPreview';
import { CSVData } from '../types/types';

interface FixedDataPreviewProps {
  data: CSVData;
  cleanedData: CSVData | null;
  reorderedData: CSVData | null;
  statistics: {
    totalRows: number;
    totalCols: number;
    numericCols: any[];
  } | null;
  onReorderColumns: (oldIndex: number, newIndex: number) => void;
  onReorderRows: (oldIndex: number, newIndex: number) => void;
  onResetOrder: () => void;
  onUploadNew: () => void;
}

export default function FixedDataPreview({
  data,
  cleanedData,
  reorderedData,
  statistics,
  onReorderColumns,
  onReorderRows,
  onResetOrder,
  onUploadNew
}: FixedDataPreviewProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const currentDisplayData = cleanedData || data;

  if (!isModalOpen) {
    return (
      <button
        onClick={() => setIsModalOpen(true)}
        className="fixed bottom-6 right-6 z-50 px-6 py-3 bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white font-bold rounded-full shadow-2xl transition-all transform hover:scale-105 border-2 border-purple-500"
      >
        📊 Preview Data
      </button>
    );
  }

  return (
    <>
      {/* Modal Backdrop */}
      <div 
        className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
        onClick={() => setIsModalOpen(false)}
      >
        {/* Modal Content */}
        <div
          className="bg-white rounded-2xl shadow-2xl border-2 border-purple-300 w-full max-w-6xl max-h-[90vh] overflow-hidden"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Modal Header */}
          <div className="bg-gradient-to-r from-purple-600 to-purple-700 px-6 py-4 flex justify-between items-center">
            <h2 className="text-2xl font-bold text-white flex items-center gap-2">
              📊 Data Spreadsheet Preview
            </h2>
            <div className="flex items-center gap-3">
              {reorderedData && (
                <button
                  onClick={onResetOrder}
                  className="px-4 py-2 text-sm text-purple-100 hover:text-white font-medium bg-purple-500 hover:bg-purple-400 rounded-lg border border-purple-400 transition-all"
                >
                  ↩️ Reset Order
                </button>
              )}
              <button
                onClick={onUploadNew}
                className="px-4 py-2 text-sm text-purple-100 hover:text-white font-medium bg-purple-500 hover:bg-purple-400 rounded-lg border border-purple-400 transition-all"
              >
                🔄 Upload New
              </button>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-white hover:text-purple-200 text-2xl font-bold px-3 py-1 hover:bg-purple-600 rounded-lg transition-all"
              >
                ×
              </button>
            </div>
          </div>

          {/* Modal Body */}
          <div className="p-6 overflow-auto max-h-[70vh]">
            <DataPreview
              data={currentDisplayData}
              onReorderColumns={onReorderColumns}
              onReorderRows={onReorderRows}
              isDraggable={true}
            />
          </div>

          {/* Modal Footer with Statistics */}
          {statistics && (
            <div className="bg-gradient-to-r from-purple-50 to-purple-100 px-6 py-4 border-t border-purple-200">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="text-lg font-bold text-purple-800 mb-2">📊 Data Statistics</h3>
                  <div className="flex gap-4 text-sm text-purple-700 font-medium">
                    <span className="bg-white px-3 py-2 rounded-lg border border-purple-200">
                      📋 Rows: {statistics.totalRows}
                    </span>
                    <span className="bg-white px-3 py-2 rounded-lg border border-purple-200">
                      📊 Columns: {statistics.totalCols}
                    </span>
                  </div>
                </div>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="px-6 py-2 bg-purple-600 hover:bg-purple-700 text-white font-medium rounded-lg transition-all"
                >
                  Close Preview
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
