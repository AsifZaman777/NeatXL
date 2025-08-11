// components/DataPreview.tsx
import { CSVData } from '../types/types';

interface DataPreviewProps {
  data: CSVData;
}

export default function DataPreview({ data }: DataPreviewProps) {
  return (
    <div className="overflow-x-auto border rounded-lg">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            {data.headers.map((header, index) => (
              <th 
                key={index}
                className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {data.data.slice(0, 10).map((row, rowIndex) => (
            <tr key={rowIndex} className={rowIndex % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
              {row.map((cell, cellIndex) => (
                <td 
                  key={cellIndex}
                  className="px-4 py-3 text-sm text-gray-500 max-w-xs truncate"
                  title={String(cell)}
                >
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
      {data.data.length > 10 && (
        <div className="px-4 py-3 bg-gray-50 text-sm text-gray-500 border-t border-gray-200">
          Showing first 10 of {data.data.length} rows
        </div>
      )}
    </div>
  );
}
