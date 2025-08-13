// app/page.tsx
'use client';

import { useState } from 'react';
import CSVUploader from '../components/CSVUploader';
import DataPreview from '../components/DataPreview';
import CleaningControls from '../components/CleaningControls';
import { CSVData } from '../types/types';

export default function Home() {
  const [csvData, setCsvData] = useState<CSVData | null>(null);
  const [reorderedData, setReorderedData] = useState<CSVData | null>(null);
  const [processing, setProcessing] = useState(false);
  const [cleanOptions, setCleanOptions] = useState({
    // Basic cleaning
    removeDuplicates: true,
    trimWhitespace: true,
    removeEmptyRows: true,
    standardizeCase: false,
    removeSpecialChars: false,
    
    // Text & String cleaning
    fixEncoding: false,
    removeExtraSpaces: false,
    removeLineBreaks: false,
    removeHtmlTags: false,
    normalizeQuotes: false,
    
    // Data type & format cleaning
    standardizePhones: false,
    standardizeEmails: false,
    standardizeDates: false,
    cleanCurrency: false,
    fixNumbers: false,
    standardizeBooleans: false,
    
    // Data quality & validation
    removeEmptyColumns: false,
    fillEmptyWith: '',
    removeMissingCritical: false,
    flagSuspiciousData: false,
    
    // Advanced text processing
    removeProfanity: false,
    spellCheck: false,
    removeStopWords: false,
    extractUrls: false,
    extractEmails: false,
    maskSensitive: false,
    
    // Data transformation
    splitNames: false,
    mergeColumns: false,
    addTimestamp: false,
    generateIds: false,
  });
  

  const handleFileUpload = (data: CSVData, fileType?: 'csv' | 'xlsx') => {
    setCsvData(data);
    setReorderedData(null); // Reset reordered data when new file is uploaded
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
    let cleanedHeaders = [...data.headers];
    
    // Helper functions for cleaning
    const cleanText = (text: string): string => {
      let cleaned = text;
      
      // Fix encoding issues
      if (options.fixEncoding) {
        cleaned = cleaned.replace(/â€™/g, "'")
                        .replace(/â€œ/g, '"')
                        .replace(/â€\u009D/g, '"')
                        .replace(/â€"/g, '—');
      }
      
      // Remove HTML tags
      if (options.removeHtmlTags) {
        cleaned = cleaned.replace(/<[^>]*>/g, '');
      }
      
      // Remove line breaks
      if (options.removeLineBreaks) {
        cleaned = cleaned.replace(/[\r\n]+/g, ' ');
      }
      
      // Remove extra spaces
      if (options.removeExtraSpaces) {
        cleaned = cleaned.replace(/\s+/g, ' ');
      }
      
      // Trim whitespace
      if (options.trimWhitespace) {
        cleaned = cleaned.trim();
      }
      
      // Normalize quotes
      if (options.normalizeQuotes) {
        cleaned = cleaned.replace(/[""]/g, '"').replace(/['']/g, "'");
      }
      
      // Remove special characters
      if (options.removeSpecialChars) {
        cleaned = cleaned.replace(/[^\w\s]/gi, '');
      }
      
      // Standardize case
      if (options.standardizeCase) {
        cleaned = cleaned.toLowerCase();
      }
      
      return cleaned;
    };
    
    const standardizePhone = (phone: string): string => {
      const digits = phone.replace(/\D/g, '');
      if (digits.length === 10) {
        return `(${digits.slice(0,3)}) ${digits.slice(3,6)}-${digits.slice(6)}`;
      } else if (digits.length === 11 && digits[0] === '1') {
        return `+1 (${digits.slice(1,4)}) ${digits.slice(4,7)}-${digits.slice(7)}`;
      }
      return phone;
    };
    
    const standardizeEmail = (email: string): string => {
      return email.toLowerCase().trim();
    };
    
    const standardizeDate = (date: string): string => {
      const parsed = new Date(date);
      if (!isNaN(parsed.getTime())) {
        return parsed.toLocaleDateString('en-US');
      }
      return date;
    };
    
    const cleanCurrencyValue = (value: string): string => {
      return value.replace(/[$€£¥,]/g, '').trim();
    };
    
    const fixNumber = (value: string): string => {
      return value.replace(/,/g, '');
    };
    
    const standardizeBoolean = (value: string): string => {
      const lower = value.toLowerCase().trim();
      if (['yes', 'y', 'true', '1', 'on'].includes(lower)) return 'true';
      if (['no', 'n', 'false', '0', 'off'].includes(lower)) return 'false';
      return value;
    };
    
    const removeProfanityWords = (text: string): string => {
      const profanityList = ['damn', 'hell', 'crap', 'stupid']; // Basic list
      let cleaned = text;
      profanityList.forEach(word => {
        cleaned = cleaned.replace(new RegExp(word, 'gi'), '***');
      });
      return cleaned;
    };
    
    const removeStopWords = (text: string): string => {
      const stopWords = ['the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of', 'with', 'by', 'is', 'are', 'was', 'were', 'be', 'been', 'being', 'have', 'has', 'had', 'do', 'does', 'did', 'will', 'would', 'could', 'should'];
      return text.split(' ')
                .filter(word => !stopWords.includes(word.toLowerCase()))
                .join(' ');
    };
    
    const maskSensitiveData = (text: string): string => {
      // Mask SSN pattern
      text = text.replace(/\b\d{3}-\d{2}-\d{4}\b/g, '***-**-****');
      // Mask credit card pattern
      text = text.replace(/\b\d{4}[\s-]?\d{4}[\s-]?\d{4}[\s-]?\d{4}\b/g, '****-****-****-****');
      return text;
    };
    
    // Apply text cleaning to all cells
    cleanedData = cleanedData.map(row =>
      row.map(cell => typeof cell === 'string' ? cleanText(cell) : String(cell))
    );
    
    // Apply format standardization
    if (options.standardizePhones) {
      cleanedData = cleanedData.map(row =>
        row.map(cell => {
          if (typeof cell === 'string' && /\d/.test(cell) && cell.length >= 10) {
            return standardizePhone(cell);
          }
          return cell;
        })
      );
    }
    
    if (options.standardizeEmails) {
      cleanedData = cleanedData.map(row =>
        row.map(cell => {
          if (typeof cell === 'string' && cell.includes('@')) {
            return standardizeEmail(cell);
          }
          return cell;
        })
      );
    }
    
    if (options.standardizeDates) {
      cleanedData = cleanedData.map(row =>
        row.map(cell => {
          if (typeof cell === 'string' && /\d{1,2}[\/\-]\d{1,2}[\/\-]\d{2,4}/.test(cell)) {
            return standardizeDate(cell);
          }
          return cell;
        })
      );
    }
    
    if (options.cleanCurrency) {
      cleanedData = cleanedData.map(row =>
        row.map(cell => {
          if (typeof cell === 'string' && /[$€£¥]/.test(cell)) {
            return cleanCurrencyValue(cell);
          }
          return cell;
        })
      );
    }
    
    if (options.fixNumbers) {
      cleanedData = cleanedData.map(row =>
        row.map(cell => {
          if (typeof cell === 'string' && /^\d{1,3}(,\d{3})*(\.\d{2})?$/.test(cell)) {
            return fixNumber(cell);
          }
          return cell;
        })
      );
    }
    
    if (options.standardizeBooleans) {
      cleanedData = cleanedData.map(row =>
        row.map(cell => {
          if (typeof cell === 'string') {
            return standardizeBoolean(cell);
          }
          return cell;
        })
      );
    }
    
    // Advanced text processing
    if (options.removeProfanity) {
      cleanedData = cleanedData.map(row =>
        row.map(cell => typeof cell === 'string' ? removeProfanityWords(cell) : cell)
      );
    }
    
    if (options.removeStopWords) {
      cleanedData = cleanedData.map(row =>
        row.map(cell => typeof cell === 'string' ? removeStopWords(cell) : cell)
      );
    }
    
    if (options.maskSensitive) {
      cleanedData = cleanedData.map(row =>
        row.map(cell => typeof cell === 'string' ? maskSensitiveData(cell) : cell)
      );
    }
    
    // Fill empty cells
    if (options.fillEmptyWith && options.fillEmptyWith.trim() !== '') {
      cleanedData = cleanedData.map(row =>
        row.map(cell => (cell === '' || cell == null) ? options.fillEmptyWith : cell)
      );
    }
    
    // Remove empty rows
    if (options.removeEmptyRows) {
      cleanedData = cleanedData.filter(row =>
        row.some((cell) => {
          const s = typeof cell === 'string' ? cell : String(cell ?? '');
          return s.trim() !== '';
        })
      );
    }
    
    // Remove empty columns
    if (options.removeEmptyColumns) {
      const nonEmptyColumnIndices: number[] = [];
      for (let colIndex = 0; colIndex < cleanedHeaders.length; colIndex++) {
        const hasData = cleanedData.some(row => {
          const cell = row[colIndex];
          const s = typeof cell === 'string' ? cell : String(cell ?? '');
          return s.trim() !== '';
        });
        if (hasData) {
          nonEmptyColumnIndices.push(colIndex);
        }
      }
      
      cleanedHeaders = nonEmptyColumnIndices.map(i => cleanedHeaders[i]);
      cleanedData = cleanedData.map(row =>
        nonEmptyColumnIndices.map(i => row[i])
      );
    }
    
    // Data transformation
    if (options.addTimestamp) {
      cleanedHeaders.push('Processed_At');
      const timestamp = new Date().toISOString();
      cleanedData = cleanedData.map(row => [...row, timestamp]);
    }
    
    if (options.generateIds) {
      cleanedHeaders.unshift('ID');
      cleanedData = cleanedData.map((row, index) => [String(index + 1), ...row]);
    }
    
    // Remove duplicates (do this last)
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
    <div className="w-full 2xl:max-w-6xl 2xl:mx-auto border-2 border-green-500 rounded-lg bg-gradient-to-br from-green-50 to-emerald-100 p-4">
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
        <p className="font-medium">Free version limited to 10,000 rows.
        </p>
      </div>
    </div>
  );
}
