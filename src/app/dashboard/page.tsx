'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { CSVData } from '../../types/types';
import CSVUploader from '../../components/CSVUploader';
import ChartVisualization from '../../components/dashboard/ChartVisualization';
import DataSummary from '../../components/dashboard/DataSummary';
import { useData } from '../../contexts/DataContext';

export default function Dashboard() {
  const router = useRouter();
  const { csvData, setCsvData, reorderedData } = useData();
  const [activeView, setActiveView] = useState<'charts' | 'summary'>('charts');
  const [uploadedFileType, setUploadedFileType] = useState<'csv' | 'xlsx' | null>(null);

  const handleDataUpload = (data: CSVData) => {
    setCsvData(data);
    setUploadedFileType('csv'); // Default to csv since we can't determine from CSVUploader
  };

  // Use reordered data if available, otherwise use original data
  const currentData = reorderedData || csvData;

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-green-800 mb-4">
            📊 Data Dashboard
          </h1>
          <p className="text-lg text-green-600 max-w-3xl mx-auto">
            Upload your Excel/CSV data to create interactive charts and get insights
          </p>
        </div>

        {/* Upload Section */}
        {!currentData && (
          <>
            {/* Home Navigation Banner */}
            <div className="bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-200 rounded-xl p-6 mb-8">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">🏠</span>
                  <div>
                    <h3 className="text-lg font-bold text-green-800">No Data Available</h3>
                    <p className="text-green-600">
                      Go to the Home page to upload and clean your CSV/Excel files first.
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => router.push("/")}
                  className="px-6 py-3 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-bold rounded-lg shadow-lg transition-all transform hover:scale-105"
                >
                  🏠 Go to Home
                </button>
              </div>
            </div>
            
            {/* Alternative Upload Section */}
            <div className="bg-white rounded-xl shadow-lg p-8">
              <div className="text-center mb-6">
                <h3 className="text-xl font-semibold text-gray-800 mb-2">Or Upload Directly Here</h3>
                <p className="text-gray-600">Upload your file to start creating visualizations</p>
              </div>
              <CSVUploader 
                onUpload={handleDataUpload}
              />
            </div>
          </>
        )}

        {/* Dashboard Content */}
        {currentData && (
          <>
           
            {/* Navigation Tabs */}
            <div className="bg-white rounded-xl shadow-lg mb-8">
              <div className="border-b border-gray-200">
                <nav className="flex space-x-8 px-8 py-4">
                  <button
                    onClick={() => setActiveView('charts')}
                    className={`py-2 px-4 border-b-2 font-medium text-sm transition-colors duration-200 ${
                      activeView === 'charts'
                        ? 'border-green-500 text-green-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    📈 Charts & Visualizations
                  </button>
                  <button
                    onClick={() => setActiveView('summary')}
                    className={`py-2 px-4 border-b-2 font-medium text-sm transition-colors duration-200 ${
                      activeView === 'summary'
                        ? 'border-green-500 text-green-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    📋 Data Summary
                  </button>
                </nav>
              </div>

              {/* File Info */}
              <div className="px-8 py-4 bg-gray-50">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <span className="text-sm text-gray-600">
                      📄 Data loaded: {currentData.data.length} rows × {currentData.headers.length} columns
                    </span>
                    <span className="text-sm text-gray-500">
                      Format: {uploadedFileType?.toUpperCase()}
                    </span>
                  </div>
                  <button
                    onClick={() => {
                      setCsvData(null);
                      setUploadedFileType(null);
                    }}
                    className="px-4 py-2 text-sm bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition-colors"
                  >
                    🗑️ Clear Data
                  </button>
                </div>
              </div>
            </div>

            {/* Content Views */}
            <div className="bg-white rounded-xl shadow-lg p-8">
              {activeView === 'charts' && (
                <ChartVisualization data={currentData} />
              )}
              {activeView === 'summary' && (
                <DataSummary data={currentData} />
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
