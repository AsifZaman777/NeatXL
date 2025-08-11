// components/CleaningControls.tsx
'use client';

import { useState } from 'react';

interface CleaningControlsProps {
  onClean: (options: {
    removeDuplicates: boolean;
    trimWhitespace: boolean;
  }) => Promise<void>;
  processing: boolean;
}

export default function CleaningControls({ 
  onClean,
  processing
}: CleaningControlsProps) {
  const [options, setOptions] = useState({
    removeDuplicates: true,
    trimWhitespace: true
  });

  const handleClean = async () => {
    await onClean(options);
  };

  return (
    <div className="mt-6 p-6 bg-gray-50 rounded-lg border border-gray-200">
      <h3 className="text-lg font-medium text-gray-900 mb-4">Cleaning Options</h3>
      
      <div className="space-y-4">
        <div className="flex items-center">
          <input
            id="trim-whitespace"
            name="trim-whitespace"
            type="checkbox"
            checked={options.trimWhitespace}
            onChange={(e) => setOptions({...options, trimWhitespace: e.target.checked})}
            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            disabled={processing}
          />
          <label htmlFor="trim-whitespace" className="ml-2 block text-sm text-gray-700">
            Trim whitespace from all cells
          </label>
        </div>

        <div className="flex items-center">
          <input
            id="remove-duplicates"
            name="remove-duplicates"
            type="checkbox"
            checked={options.removeDuplicates}
            onChange={(e) => setOptions({...options, removeDuplicates: e.target.checked})}
            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            disabled={processing}
          />
          <label htmlFor="remove-duplicates" className="ml-2 block text-sm text-gray-700">
            Remove duplicate rows
          </label>
        </div>

        <div className="pt-4">
          <button
            onClick={handleClean}
            disabled={processing}
            className={`inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${
              processing ? 'opacity-70 cursor-not-allowed' : ''
            }`}
          >
            {processing ? 'Cleaning...' : 'Clean Data'}
          </button>
        </div>
      </div>
    </div>
  );
}
