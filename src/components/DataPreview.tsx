// components/DataPreview.tsx
import { CSVData } from '../types/types';

interface DataPreviewProps {
  data: CSVData;
}

export default function DataPreview({ data }: DataPreviewProps) {
  return (
    <div className="border border-gray-300 rounded-lg bg-white shadow-sm">
      {/* Spreadsheet-like header with column numbers */}
      <div className="bg-gray-100 border-b border-gray-300 px-2 py-1 text-xs text-gray-600 font-medium">
        📊 Spreadsheet View - {data.data.length} rows × {data.headers.length} columns
      </div>
      
      <div className="overflow-auto max-h-96">
        <table className="min-w-full border-collapse">
          {/* Header row with column letters like Excel */}
          <thead className="sticky top-0 bg-gray-100 border-b-2 border-gray-300">
            <tr>
              {/* Row number column header */}
              <th className="w-12 px-2 py-2 text-center text-xs font-bold text-gray-600 bg-gray-200 border-r border-gray-300">
                #
              </th>
              {data.headers.map((header, index) => (
                <th 
                  key={index}
                  className="px-3 py-2 text-left text-xs font-bold text-gray-700 bg-gray-100 border-r border-gray-300 min-w-32"
                  style={{ minWidth: '120px' }}
                >
                  <span className="truncate" title={header}>
                    {header}
                  </span>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.data.slice(0, 100).map((row, rowIndex) => (
              <tr 
                key={rowIndex} 
                className={`border-b border-gray-200 hover:bg-blue-50 ${
                  rowIndex % 2 === 0 ? 'bg-white' : 'bg-gray-50'
                }`}
              >
                {/* Row number */}
                <td className="w-12 px-2 py-2 text-center text-xs font-medium text-gray-500 bg-gray-100 border-r border-gray-300">
                  {rowIndex + 1}
                </td>
                {row.map((cell, cellIndex) => (
                  <td 
                    key={cellIndex}
                    className="px-3 py-2 text-sm text-gray-700 border-r border-gray-200 whitespace-nowrap overflow-hidden text-ellipsis"
                    style={{ maxWidth: '200px', minWidth: '120px' }}
                    title={String(cell)}
                  >
                    <div className="truncate">
                      {cell || <span className="text-gray-400 italic">empty</span>}
                    </div>
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      {/* Footer with row count info */}
      {data.data.length > 100 && (
        <div className="px-3 py-2 bg-gray-50 border-t border-gray-300 text-xs text-gray-600 flex justify-between items-center">
          <span>📄 Showing first 100 of {data.data.length} rows</span>
          <span className="text-green-600 font-medium">
            Total: {data.data.length.toLocaleString()} rows
          </span>
        </div>
      )}
    </div>
  );
}
