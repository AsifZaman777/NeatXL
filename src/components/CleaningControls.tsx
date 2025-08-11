// components/CleaningControls.tsx
'use client';

import { useState } from 'react';

interface CleaningControlsProps {
  options: {
    removeDuplicates: boolean;
    trimWhitespace: boolean;
    removeEmptyRows: boolean;
    standardizeCase: boolean;
    removeSpecialChars: boolean;
  };
  setOptions: (opts: { 
    removeDuplicates: boolean; 
    trimWhitespace: boolean;
    removeEmptyRows: boolean;
    standardizeCase: boolean;
    removeSpecialChars: boolean;
  }) => void;
  processing: boolean;
}

export default function CleaningControls({ 
  options,
  setOptions,
  processing
}: CleaningControlsProps) {

  return (
    <div className="mt-6 p-6 bg-gradient-to-br from-green-50 to-emerald-100 rounded-xl border-2 border-green-200 shadow-lg">
      <h3 className="text-xl font-bold text-green-800 mb-6 flex items-center">
        🛠️ Cleaning Options
      </h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="flex items-center p-3 bg-white rounded-lg border border-green-200 hover:border-green-300 transition-all">
          <input
            id="trim-whitespace"
            name="trim-whitespace"
            type="checkbox"
            checked={options.trimWhitespace}
            onChange={(e) => setOptions({...options, trimWhitespace: e.target.checked})}
            className="h-5 w-5 text-green-600 focus:ring-green-500 border-green-300 rounded"
            disabled={processing}
          />
          <label htmlFor="trim-whitespace" className="ml-3 block text-sm font-medium text-green-800">
            ✂️ Trim whitespace from all cells
          </label>
        </div>

        <div className="flex items-center p-3 bg-white rounded-lg border border-green-200 hover:border-green-300 transition-all">
          <input
            id="remove-duplicates"
            name="remove-duplicates"
            type="checkbox"
            checked={options.removeDuplicates}
            onChange={(e) => setOptions({...options, removeDuplicates: e.target.checked})}
            className="h-5 w-5 text-green-600 focus:ring-green-500 border-green-300 rounded"
            disabled={processing}
          />
          <label htmlFor="remove-duplicates" className="ml-3 block text-sm font-medium text-green-800">
            🗑️ Remove duplicate rows
          </label>
        </div>

        <div className="flex items-center p-3 bg-white rounded-lg border border-green-200 hover:border-green-300 transition-all">
          <input
            id="remove-empty-rows"
            name="remove-empty-rows"
            type="checkbox"
            checked={options.removeEmptyRows}
            onChange={(e) => setOptions({...options, removeEmptyRows: e.target.checked})}
            className="h-5 w-5 text-green-600 focus:ring-green-500 border-green-300 rounded"
            disabled={processing}
          />
          <label htmlFor="remove-empty-rows" className="ml-3 block text-sm font-medium text-green-800">
            🧹 Remove empty rows
          </label>
        </div>

        <div className="flex items-center p-3 bg-white rounded-lg border border-green-200 hover:border-green-300 transition-all">
          <input
            id="standardize-case"
            name="standardize-case"
            type="checkbox"
            checked={options.standardizeCase}
            onChange={(e) => setOptions({...options, standardizeCase: e.target.checked})}
            className="h-5 w-5 text-green-600 focus:ring-green-500 border-green-300 rounded"
            disabled={processing}
          />
          <label htmlFor="standardize-case" className="ml-3 block text-sm font-medium text-green-800">
            🔤 Convert to lowercase
          </label>
        </div>

        <div className="flex items-center p-3 bg-white rounded-lg border border-green-200 hover:border-green-300 transition-all">
          <input
            id="remove-special-chars"
            name="remove-special-chars"
            type="checkbox"
            checked={options.removeSpecialChars}
            onChange={(e) => setOptions({...options, removeSpecialChars: e.target.checked})}
            className="h-5 w-5 text-green-600 focus:ring-green-500 border-green-300 rounded"
            disabled={processing}
          />
          <label htmlFor="remove-special-chars" className="ml-3 block text-sm font-medium text-green-800">
            🚫 Remove special characters
          </label>
        </div>

  {/* Cleaning happens instantly, no button needed */}
      </div>
    </div>
  );
}
