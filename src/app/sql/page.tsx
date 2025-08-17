'use client';

import { useState, useEffect } from 'react';
import { useData } from '../../contexts/DataContext';
import { useRouter } from 'next/navigation';

export default function SQLPage() {
  const { csvData, reorderedData } = useData();
  const router = useRouter();
  const [sqlQuery, setSqlQuery] = useState('');
  const [tableName, setTableName] = useState('neatxl_data');
  const [copied, setCopied] = useState(false);

  // Get the current data (reordered data takes priority)
  const currentData = reorderedData || csvData;

  useEffect(() => {
    if (currentData) {
      generateSQL();
    }
  }, [currentData, tableName]);

  const generateSQL = () => {
    if (!currentData) return;

    // Generate CREATE TABLE statement
    const createTable = `CREATE TABLE ${tableName} (\n  id INT PRIMARY KEY AUTO_INCREMENT,\n${currentData.headers.map(header => 
      `  ${header.replace(/[^a-zA-Z0-9_]/g, '_').toLowerCase()} VARCHAR(255)`
    ).join(',\n')}\n);\n\n`;

    // Generate INSERT statements
    const insertStatements = currentData.data.map(row => {
      const values = row.map(cell => `'${String(cell).replace(/'/g, "''")}'`).join(', ');
      return `INSERT INTO ${tableName} (${currentData.headers.map(h => h.replace(/[^a-zA-Z0-9_]/g, '_').toLowerCase()).join(', ')}) VALUES (${values});`;
    }).join('\n');

    const fullSQL = createTable + insertStatements;
    setSqlQuery(fullSQL);
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(sqlQuery);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  const handleDownload = () => {
    const blob = new Blob([sqlQuery], { type: 'text/sql' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `${tableName}.sql`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (!currentData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 flex items-center justify-center">
        <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full mx-4">
          <div className="text-center">
            <div className="text-6xl mb-4">📊</div>
            <h2 className="text-2xl font-bold text-gray-800 mb-4">No Data Available</h2>
            <p className="text-gray-600 mb-6">
              Please upload a CSV file first to generate SQL queries.
            </p>
            <button
              onClick={() => router.push('/')}
              className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-bold py-3 px-6 rounded-lg transition-all transform hover:scale-105"
            >
              Upload Data
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 p-4">
      <div className="max-w-6xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white p-6">
            <h1 className="text-3xl font-bold mb-2">🗄️ SQL Query Generator</h1>
            <p className="text-blue-100">
              Generate CREATE TABLE and INSERT statements from your data
            </p>
          </div>

          {/* Table Name Input */}
          <div className="p-6 bg-gray-50 border-b">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Table Name:
            </label>
            <input
              type="text"
              value={tableName}
              onChange={(e) => setTableName(e.target.value.replace(/[^a-zA-Z0-9_]/g, '_'))}
              className="w-full max-w-md px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Enter table name"
            />
            <p className="text-sm text-gray-500 mt-1">
              Only letters, numbers, and underscores are allowed
            </p>
          </div>

          {/* Data Summary */}
          <div className="p-6 bg-blue-50 border-b">
            <h3 className="text-lg font-semibold text-gray-800 mb-2">Data Summary</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <div className="bg-white p-3 rounded border">
                <span className="font-medium text-gray-600">Rows:</span>
                <span className="ml-2 text-blue-600 font-bold">{currentData.data.length}</span>
              </div>
              <div className="bg-white p-3 rounded border">
                <span className="font-medium text-gray-600">Columns:</span>
                <span className="ml-2 text-blue-600 font-bold">{currentData.headers.length}</span>
              </div>
              <div className="bg-white p-3 rounded border">
                <span className="font-medium text-gray-600">Table:</span>
                <span className="ml-2 text-blue-600 font-bold">{tableName}</span>
              </div>
            </div>
          </div>

          {/* SQL Query Box */}
          <div className="p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-800">Generated SQL Query</h3>
              <div className="flex gap-2">
                <button
                  onClick={handleCopy}
                  className={`px-4 py-2 rounded-lg font-medium transition-all ${
                    copied 
                      ? 'bg-green-500 text-white' 
                      : 'bg-gray-200 hover:bg-gray-300 text-gray-700'
                  }`}
                >
                  {copied ? '✓ Copied!' : '📋 Copy'}
                </button>
                <button
                  onClick={handleDownload}
                  className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-medium transition-all"
                >
                  💾 Download
                </button>
              </div>
            </div>
            
            <textarea
              value={sqlQuery}
              readOnly
              className="w-full h-96 p-4 border border-gray-300 rounded-lg font-mono text-sm bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="SQL query will appear here..."
            />
          </div>

          {/* Instructions */}
          <div className="p-6 bg-gray-50 border-t">
            <h4 className="font-semibold text-gray-800 mb-2">How to use:</h4>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>• The query includes CREATE TABLE and INSERT statements</li>
              <li>• Column names are automatically sanitized for SQL compatibility</li>
              <li>• All columns are created as VARCHAR(255) - modify as needed</li>
              <li>• Copy the query or download as .sql file</li>
              <li>• Run the query in your database management tool</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
