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
  const [reorderedData, setReorderedData] = useState<CSVData | null>(null);
  const [uploadedFileType, setUploadedFileType] = useState<'csv' | 'xlsx' | null>(null);
  const [processing, setProcessing] = useState(false);
  const [cleanOptions, setCleanOptions] = useState({
    removeDuplicates: true,
    trimWhitespace: true,
    removeEmptyRows: true,
    standardizeCase: false,
    removeSpecialChars: false
  });
  const { triggerModalAd } = useAdContext();

  const handleFileUpload = (data: CSVData, fileType?: 'csv' | 'xlsx') => {
    setCsvData(data);
    setReorderedData(null); // Reset reordered data when new file is uploaded
    setUploadedFileType(fileType || 'csv');
    // Trigger ad on first upload
    triggerModalAd(true);
  };

  // Function to handle column reordering
  const handleReorderColumns = (oldIndex: number, newIndex: number) => {
    const currentData = reorderedData || csvData;
    if (!currentData) return;

    // Reorder headers
    const newHeaders = [...currentData.headers];
    const [movedHeader] = newHeaders.splice(oldIndex, 1);
    newHeaders.splice(newIndex, 0, movedHeader);

    // Reorder data columns
    const newData = currentData.data.map(row => {
      const newRow = [...row];
      const [movedCell] = newRow.splice(oldIndex, 1);
      newRow.splice(newIndex, 0, movedCell);
      return newRow;
    });

    setReorderedData({
      headers: newHeaders,
      data: newData
    });
  };

  // Function to handle row reordering
  const handleReorderRows = (oldIndex: number, newIndex: number) => {
    const currentData = reorderedData || csvData;
    if (!currentData) return;

    const newData = [...currentData.data];
    const [movedRow] = newData.splice(oldIndex, 1);
    newData.splice(newIndex, 0, movedRow);

    setReorderedData({
      headers: [...currentData.headers],
      data: newData
    });
  };

  // Clean data based on options
  const getCleanedData = (data: CSVData | null, options: typeof cleanOptions): CSVData | null => {
    if (!data) return null;
    let cleanedData = [...data.data];
    const cleanedHeaders = [...data.headers];
    
    // Remove empty rows
    if (options.removeEmptyRows) {
      cleanedData = cleanedData.filter(row => 
        row.some(cell => cell && cell.trim() !== '')
      );
    }
    
    // Trim whitespace
    if (options.trimWhitespace) {
      cleanedData = cleanedData.map(row =>
        row.map((cell: string) => typeof cell === 'string' ? cell.trim() : cell)
      );
    }
    
    // Standardize case
    if (options.standardizeCase) {
      cleanedData = cleanedData.map(row =>
        row.map((cell: string) => typeof cell === 'string' ? cell.toLowerCase() : cell)
      );
    }
    
    // Remove special characters
    if (options.removeSpecialChars) {
      cleanedData = cleanedData.map(row =>
        row.map((cell: string) => typeof cell === 'string' ? cell.replace(/[^\w\s]/gi, '') : cell)
      );
    }
    
    // Remove duplicates
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
  const currentData = reorderedData || csvData;
  const cleanedCsvData = getCleanedData(currentData, cleanOptions);

  const handleDownloadCSV = () => {
    if (!cleanedCsvData) return;
    const csvContent = [
      cleanedCsvData.headers.join(','),
      ...cleanedCsvData.data.map((row: string[]) => row.join(','))
    ].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'neatsheet-cleaned-data.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleDownloadXLSX = () => {
    if (!cleanedCsvData) return;
    import('xlsx').then(XLSX => {
      const worksheet = XLSX.utils.aoa_to_sheet([cleanedCsvData.headers, ...cleanedCsvData.data]);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1');
      XLSX.writeFile(workbook, 'neatsheet-cleaned-data.xlsx');
    });
  };

  const handleDownloadJSON = () => {
    if (!cleanedCsvData) return;
    const jsonData = cleanedCsvData.data.map(row => {
      const obj: Record<string, string> = {};
      cleanedCsvData.headers.forEach((header, index) => {
        obj[header] = row[index] || '';
      });
      return obj;
    });
    const jsonContent = JSON.stringify(jsonData, null, 2);
    const blob = new Blob([jsonContent], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'neatsheet-cleaned-data.json');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Statistics calculation
  const getStatistics = () => {
    if (!cleanedCsvData) return null;
    const totalRows = cleanedCsvData.data.length;
    const totalCols = cleanedCsvData.headers.length;
    const numericCols = cleanedCsvData.headers.map((_, colIndex) => {
      const values = cleanedCsvData.data.map(row => parseFloat(row[colIndex])).filter(val => !isNaN(val));
      return values.length > 0 ? {
        min: Math.min(...values),
        max: Math.max(...values),
        avg: values.reduce((a, b) => a + b, 0) / values.length
      } : null;
    });
    return { totalRows, totalCols, numericCols };
  };

  const statistics = getStatistics();

  return (
    <div className="max-w-6xl mx-auto w-full bg-gradient-to-br from-green-50 to-emerald-100 min-h-screen p-4">
      <div className="text-center mb-8">
        <div className="flex justify-center items-center mb-4">
          <h1 className="text-5xl font-bold text-green-800 mb-3">
            <span className="text-emerald-600">Neat</span><span className="text-green-700">Sheet</span>
          </h1>
        </div>
        <p className="text-xl text-green-700 max-w-2xl mx-auto font-medium">
          Clean, transform, and analyze your CSV files in seconds
        </p>
      </div>

      <div className="rounded-xl shadow-lg border-2 border-green-200 overflow-hidden backdrop-blur-sm bg-white/90">
        {!csvData ? (
          <div className="p-8">
            <CSVUploader onUpload={(data: CSVData, fileType?: 'csv' | 'xlsx') => handleFileUpload(data, fileType)} />
          </div>
        ) : (
          <div className="divide-y divide-green-200">
            <div className="p-6 bg-gradient-to-r from-green-50 to-emerald-50">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold text-green-800">📊 Data Spreadsheet</h2>
                <div className="flex gap-2">
                  {reorderedData && (
                    <button 
                      onClick={() => setReorderedData(null)}
                      className="px-4 py-2 text-sm text-blue-600 hover:text-blue-800 font-medium bg-blue-50 hover:bg-blue-100 rounded-lg border border-blue-300 transition-all"
                    >
                      ↩️ Reset Order
                    </button>
                  )}
                  <button 
                    onClick={() => {
                      setCsvData(null);
                      setReorderedData(null);
                    }}
                    className="px-4 py-2 text-sm text-green-600 hover:text-green-800 font-medium bg-green-50 hover:bg-green-100 rounded-lg border border-green-300 transition-all"
                  >
                    🔄 Upload New File
                  </button>
                </div>
              </div>
              {(cleanedCsvData || currentData) && (
                <DataPreview 
                  data={cleanedCsvData || currentData!} 
                  onReorderColumns={handleReorderColumns}
                  onReorderRows={handleReorderRows}
                  isDraggable={true}
                />
              )}
              
              {/* Statistics */}
              {statistics && (
                <div className="mt-4 p-4 bg-gradient-to-r from-green-100 to-emerald-100 rounded-lg border border-green-200">
                  <h3 className="text-sm font-bold text-green-800 mb-2">📊 Statistics</h3>
                  <div className="text-sm text-green-700 font-medium">
                    <span className="bg-white px-2 py-1 rounded mr-2">Rows: {statistics.totalRows}</span>
                    <span className="bg-white px-2 py-1 rounded">Columns: {statistics.totalCols}</span>
                  </div>
                </div>
              )}
            </div>

            <div className="p-6">
              <CleaningControls 
                options={cleanOptions}
                setOptions={setCleanOptions}
                processing={processing}
              />
            </div>

            <div className="p-6 bg-gradient-to-r from-green-50 to-emerald-50 flex justify-end gap-4">
              <button
                onClick={handleDownloadCSV}
                disabled={processing}
                className={`inline-flex items-center px-6 py-3 border-2 border-green-300 text-base font-bold rounded-xl shadow-lg text-white bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 focus:outline-none focus:ring-4 focus:ring-green-300 transform hover:scale-105 transition-all ${processing ? 'opacity-70 cursor-not-allowed' : ''}`}
              >
                📄 Download CSV
              </button>
              <button
                onClick={handleDownloadXLSX}
                disabled={processing}
                className={`inline-flex items-center px-6 py-3 border-2 border-emerald-300 text-base font-bold rounded-xl shadow-lg text-white bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 focus:outline-none focus:ring-4 focus:ring-emerald-300 transform hover:scale-105 transition-all ${processing ? 'opacity-70 cursor-not-allowed' : ''}`}
              >
                📊 Download XLSX
              </button>
              <button
                onClick={handleDownloadJSON}
                disabled={processing}
                className={`inline-flex items-center px-6 py-3 border-2 border-green-400 text-base font-bold rounded-xl shadow-lg text-white bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 focus:outline-none focus:ring-4 focus:ring-green-400 transform hover:scale-105 transition-all ${processing ? 'opacity-70 cursor-not-allowed' : ''}`}
              >
                🗂️ Download JSON
              </button>
            </div>
          </div>
        )}
      </div>

      <div className="mt-8 text-center text-sm text-green-600">
        <p className="font-medium">Free version limited to 10,000 rows. <button 
          onClick={() => triggerModalAd(true)}
          className="text-green-700 hover:text-green-800 font-bold underline decoration-2 decoration-green-400 hover:decoration-green-600 transition-all"
        >
          🚀 Upgrade to Pro
        </button> for unlimited processing.</p>
      </div>
    </div>
  );
}
