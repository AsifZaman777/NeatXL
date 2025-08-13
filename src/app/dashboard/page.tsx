'use client';

import { useState } from 'react';
import { CSVData } from '../../types/types';
import CSVUploader from '../../components/CSVUploader';
import ChartVisualization from '../../components/dashboard/ChartVisualization';
import DataSummary from '../../components/dashboard/DataSummary';

export default function Dashboard() {
  const [csvData, setCsvData] = useState<CSVData | null>(null);
  const [activeView, setActiveView] = useState<'charts' | 'summary'>('charts');
  const [uploadedFileType, setUploadedFileType] = useState<'csv' | 'xlsx' | null>(null);

  const handleDataUpload = (data: CSVData) => {
    setCsvData(data);
    setUploadedFileType('csv'); // Default to csv since we can't determine from CSVUploader
  };

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
        {!csvData && (
          <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
            <CSVUploader 
              onUpload={handleDataUpload}
            />
          </div>
        )}

        {/* Dashboard Content */}
        {csvData && (
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
                      📄 Data loaded: {csvData.data.length} rows × {csvData.headers.length} columns
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
                <ChartVisualization data={csvData} />
              )}
              {activeView === 'summary' && (
                <DataSummary data={csvData} />
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
