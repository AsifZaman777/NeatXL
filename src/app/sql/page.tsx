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
  const [includeCreateTable, setIncludeCreateTable] = useState(true);
  const [includeInserts, setIncludeInserts] = useState(true);

  // Get the current data (reordered data takes priority)
  const currentData = reorderedData || csvData;

  // Detect column types
  const detectColumnTypes = () => {
    if (!currentData) return [];
    
    return currentData.headers.map(header => {
      const columnIndex = currentData.headers.indexOf(header);
      const columnData = currentData.data.map(row => row[columnIndex]).filter(value => value !== '' && value != null);
      
      // Check if column is numeric
      const numericData = columnData.map(value => parseFloat(String(value))).filter(value => !isNaN(value));
      const isNumeric = numericData.length > columnData.length * 0.7; // More than 70% numeric
      
      // Check if column contains dates
      const dateData = columnData.filter(value => {
        const dateRegex = /^\d{4}-\d{2}-\d{2}$|^\d{2}\/\d{2}\/\d{4}$|^\d{2}-\d{2}-\d{4}$/;
        return dateRegex.test(String(value)) || !isNaN(Date.parse(String(value)));
      });
      const isDate = dateData.length > columnData.length * 0.7;
      
      // Check if column contains booleans
      const booleanData = columnData.filter(value => {
        const val = String(value).toLowerCase();
        return ['true', 'false', '1', '0', 'yes', 'no', 'y', 'n'].includes(val);
      });
      const isBoolean = booleanData.length > columnData.length * 0.7;
      
      // Check if column contains emails
      const emailData = columnData.filter(value => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(String(value));
      });
      const isEmail = emailData.length > columnData.length * 0.7;
      
      // Determine max length for VARCHAR
      const maxLength = Math.max(...columnData.map(value => String(value).length));
      
      // Determine SQL data type
      let sqlType = 'VARCHAR(255)';
      if (isBoolean) {
        sqlType = 'BOOLEAN';
      } else if (isDate) {
        sqlType = 'DATE';
      } else if (isEmail) {
        sqlType = 'VARCHAR(100)';
      } else if (isNumeric) {
        // Check if integers or decimals
        const hasDecimals = numericData.some(val => val % 1 !== 0);
        if (hasDecimals) {
          sqlType = 'DECIMAL(10,2)';
        } else {
          // Check range for INT vs BIGINT
          const maxVal = Math.max(...numericData);
          const minVal = Math.min(...numericData);
          if (maxVal > 2147483647 || minVal < -2147483648) {
            sqlType = 'BIGINT';
          } else {
            sqlType = 'INT';
          }
        }
      } else {
        // Text data - optimize VARCHAR length
        if (maxLength <= 50) {
          sqlType = `VARCHAR(${Math.max(50, maxLength + 10)})`;
        } else if (maxLength <= 255) {
          sqlType = `VARCHAR(${maxLength + 50})`;
        } else {
          sqlType = 'TEXT';
        }
      }
      
      return {
        name: header,
        type: sqlType,
        isNumeric,
        isDate,
        isBoolean,
        isEmail,
        maxLength
      };
    });
  };

  useEffect(() => {
    if (currentData) {
      generateSQL();
    }
  }, [currentData, tableName, includeCreateTable, includeInserts]);

  const generateSQL = () => {
    if (!currentData) {
      setSqlQuery('-- No data available. Please upload a CSV file first.');
      return;
    }

    const columnTypes = detectColumnTypes();
    let sql = '';

    // Generate Normal SQL with intelligent column types
    if (includeCreateTable) {
      sql += `-- Create table statement with optimized data types\n`;
      sql += `CREATE TABLE ${tableName} (\n`;
      sql += `  id INT PRIMARY KEY AUTO_INCREMENT,\n`;
      sql += columnTypes.map(col => {
        const columnName = col.name.replace(/[^a-zA-Z0-9_]/g, '_').toLowerCase();
        return `  ${columnName} ${col.type} COMMENT '${col.name}'`;
      }).join(',\n');
      sql += `\n);\n\n`;
    }

    if (includeInserts) {
      sql += `-- Insert data statements (${currentData.data.length} rows)\n`;
      const columnNames = columnTypes.map(col => col.name.replace(/[^a-zA-Z0-9_]/g, '_').toLowerCase()).join(', ');
      
      currentData.data.forEach((row, index) => {
        const values = row.map((cell, colIndex) => {
          const col = columnTypes[colIndex];
          const cellStr = String(cell || '');
          
          if (col.type.includes('INT') || col.type.includes('DECIMAL')) {
            const numValue = parseFloat(cellStr);
            return isNaN(numValue) ? 'NULL' : numValue;
          } else if (col.type === 'BOOLEAN') {
            const val = cellStr.toLowerCase();
            if (['true', '1', 'yes', 'y'].includes(val)) return 'TRUE';
            if (['false', '0', 'no', 'n'].includes(val)) return 'FALSE';
            return 'NULL';
          } else if (col.type === 'DATE') {
            const date = new Date(cellStr);
            return !isNaN(date.getTime()) ? `'${date.toISOString().split('T')[0]}'` : 'NULL';
          } else {
            return `'${cellStr.replace(/'/g, "''")}'`;
          }
        }).join(', ');
        
        sql += `INSERT INTO ${tableName} (${columnNames}) VALUES (${values});\n`;
        
        // Add a comment every 100 rows for better readability
        if ((index + 1) % 100 === 0) {
          sql += `-- Inserted ${index + 1} rows\n\n`;
        }
      });
    }

    setSqlQuery(sql);
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

          {/* Configuration Section */}
          <div className="p-6 bg-gray-50 border-b">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">⚙️ Configuration</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {/* Table Name */}
              <div className='bg-neutral-100 rounded-lg p-4 space-y-3 shadow-md'>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Table Name:
                </label>
                <input
                  type="text"
                  value={tableName}
                  onChange={(e) => setTableName(e.target.value.replace(/[^a-zA-Z0-9_]/g, '_'))}
                  className="w-full px-3 py-2 border border-neutral-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter table name"
                />
                <span
                className='text-green-800 text-xs animate-pulse' 
                >Insert appropiate table name</span>
              </div>

              {/* Include Options */}
              <div className="bg-neutral-100 rounded-lg p-4 space-y-3 shadow-md">
                <label className="block text-sm font-medium text-gray-700">
                  Include:
                </label>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={includeCreateTable}
                    onChange={(e) => setIncludeCreateTable(e.target.checked)}
                    className="mr-2 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <span className="text-sm text-gray-700">CREATE TABLE</span>
                </label>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={includeInserts}
                    onChange={(e) => setIncludeInserts(e.target.checked)}
                    className="mr-2 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <span className="text-sm text-gray-700">INSERT statements</span>
                </label>
              </div>

              {/* Column Types Preview */}
              <div className='bg-neutral-100 rounded-lg p-4 shadow-md'>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Detected Types:
                </label>
                <div className="max-h-20 overflow-y-auto text-xs space-y-1">
                  {detectColumnTypes().slice(0, 100).map((col, index) => (
                    <div key={index} className="bg-white p-1 rounded border text-gray-600">
                      <span className="font-medium">{col.name}:</span> {col.type}
                    </div>
                  ))}
                  {currentData.headers.length > 100 && (
                    <div className="text-gray-500 text-center">
                      +{currentData.headers.length - 100} more columns
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Data Summary */}
          <div className="p-6 bg-neutral-100 border-b">
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
