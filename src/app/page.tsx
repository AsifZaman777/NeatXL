// app/page.tsx
'use client';

import { useState } from 'react';
import CSVUploader from '../components/CSVUploader';
import DataPreview from '../components/DataPreview';
import CleaningControls from '../components/CleaningControls';
import { CSVData } from '../types/types';
import { useAdContext } from '../components/ads/AdContext';

export default function Home() {
  const [csvData, setCsvData] = useState<CSVData | null>(null);
  const [uploadedFileType, setUploadedFileType] = useState<'csv' | 'xlsx' | null>(null);
  const [processing, setProcessing] = useState(false);
  const [cleanOptions, setCleanOptions] = useState({
    removeDuplicates: true,
    trimWhitespace: true
  });
  const { triggerModalAd } = useAdContext();

  const handleFileUpload = (data: CSVData, fileType?: 'csv' | 'xlsx') => {
    setCsvData(data);
    setUploadedFileType(fileType || 'csv');
    // Trigger ad on first upload
    triggerModalAd(true);
  };

  // Clean data based on options
  const getCleanedData = (data: CSVData | null, options: typeof cleanOptions): CSVData | null => {
    if (!data) return null;
    let cleanedData = [...data.data];
    const cleanedHeaders = [...data.headers];
    if (options.trimWhitespace) {
      cleanedData = cleanedData.map(row =>
        row.map((cell: string) => typeof cell === 'string' ? cell.trim() : cell)
      );
    }
    if (options.removeDuplicates) {
      const uniqueRows = new Set(cleanedData.map(row => JSON.stringify(row)));
      cleanedData = Array.from(uniqueRows).map(row => JSON.parse(row));
    }
    return {
      headers: cleanedHeaders,
      data: cleanedData
    };
  };

  // Update preview instantly when options change
  const cleanedCsvData = getCleanedData(csvData, cleanOptions);

  const handleDownload = () => {
    if (!csvData || !uploadedFileType) return;

    if (uploadedFileType === 'csv') {
      const csvContent = [
        csvData.headers.join(','),
        ...csvData.data.map((row: string[]) => row.join(','))
      ].join('\n');
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'neatsheet-cleaned-data.csv');
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } else if (uploadedFileType === 'xlsx') {
      // Dynamically import xlsx for client-side export
      import('xlsx').then(XLSX => {
        const worksheet = XLSX.utils.aoa_to_sheet([csvData.headers, ...csvData.data]);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1');
        XLSX.writeFile(workbook, 'neatsheet-cleaned-data.xlsx');
      });
    }
  };

  return (
    <div className="max-w-4xl mx-auto w-full">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-3">
          <span className="text-blue-600">Neat</span>Sheet
        </h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          Clean, transform, and analyze your CSV files in seconds
        </p>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        {!csvData ? (
          <div className="p-8">
            <CSVUploader onUpload={(data, fileType) => handleFileUpload(data, fileType)} />
          </div>
        ) : (
          <div className="divide-y divide-gray-200">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold text-gray-800">Data Preview</h2>
                <button 
                  onClick={() => setCsvData(null)}
                  className="text-sm text-blue-600 hover:text-blue-800"
                >
                  Upload Different File
                </button>
              </div>
              <DataPreview data={cleanedCsvData || csvData} />
            </div>

            <div className="p-6">
              <CleaningControls 
                options={cleanOptions}
                setOptions={setCleanOptions}
                processing={processing}
              />
            </div>

            <div className="p-6 bg-gray-50 flex justify-end">
              <button
                onClick={handleDownload}
                disabled={processing}
                className={`inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 ${processing ? 'opacity-70 cursor-not-allowed' : ''}`}
              >
                {processing ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Processing...
                  </>
                ) : (
                  'Download Cleaned CSV'
                )}
              </button>
            </div>
          </div>
        )}
      </div>

      <div className="mt-8 text-center text-sm text-gray-500">
        <p>Free version limited to 10,000 rows. <button 
          onClick={() => triggerModalAd(true)}
          className="text-blue-600 hover:underline"
        >
          Upgrade to Pro
        </button> for unlimited processing.</p>
      </div>
    </div>
  );
}
