'use client';

import { useMemo } from 'react';
import { CSVData } from '../../types/types';

interface NumericStats {
  column: string;
  type: 'numeric';
  count: number;
  unique: number;
  missing: number;
  min: number;
  max: number;
  mean: number;
  median: number;
  std: number;
}

interface CategoricalStats {
  column: string;
  type: 'categorical';
  count: number;
  unique: number;
  missing: number;
  mostCommon: { value: string; count: number } | null;
}

type ColumnStats = NumericStats | CategoricalStats;

interface DataSummaryProps {
  data: CSVData;
}

export default function DataSummary({ data }: DataSummaryProps) {
  const statistics = useMemo((): ColumnStats[] => {
    const stats = data.headers.map(header => {
      const columnIndex = data.headers.indexOf(header);
      const columnData = data.data.map(row => row[columnIndex]).filter(value => value !== '');
      
      // Check if column is numeric
      const numericData = columnData.map(value => parseFloat(value)).filter(value => !isNaN(value));
      const isNumeric = numericData.length > columnData.length * 0.5; // More than 50% numeric
      
      if (isNumeric && numericData.length > 0) {
        const sorted = [...numericData].sort((a, b) => a - b);
        const sum = numericData.reduce((acc, val) => acc + val, 0);
        const mean = sum / numericData.length;
        const median = sorted.length % 2 === 0 
          ? (sorted[sorted.length / 2 - 1] + sorted[sorted.length / 2]) / 2
          : sorted[Math.floor(sorted.length / 2)];
        
        return {
          column: header,
          type: 'numeric' as const,
          count: numericData.length,
          unique: new Set(numericData).size,
          missing: data.data.length - columnData.length,
          min: Math.min(...numericData),
          max: Math.max(...numericData),
          mean: mean,
          median: median,
          std: Math.sqrt(numericData.reduce((acc, val) => acc + Math.pow(val - mean, 2), 0) / numericData.length)
        };
      } else {
        // Text/categorical data
        const valueCounts = columnData.reduce((acc, val) => {
          acc[val] = (acc[val] || 0) + 1;
          return acc;
        }, {} as Record<string, number>);
        
        const mostCommon = Object.entries(valueCounts).sort((a, b) => b[1] - a[1])[0];
        
        return {
          column: header,
          type: 'categorical' as const,
          count: columnData.length,
          unique: Object.keys(valueCounts).length,
          missing: data.data.length - columnData.length,
          mostCommon: mostCommon ? { value: mostCommon[0], count: mostCommon[1] } : null
        };
      }
    });
    
    return stats;
  }, [data]);

  const overallStats = useMemo(() => {
    const totalCells = data.headers.length * data.data.length;
    const emptyCells = data.data.reduce((count, row) => 
      count + row.filter(cell => cell === '').length, 0
    );
    
    return {
      totalRows: data.data.length,
      totalColumns: data.headers.length,
      totalCells,
      emptyCells,
      completeness: ((totalCells - emptyCells) / totalCells * 100).toFixed(1)
    };
  }, [data]);

  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-800 mb-6">📋 Data Summary & Statistics</h2>
      
      {/* Overall Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-8">
        <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white p-4 rounded-lg">
          <div className="text-2xl font-bold">{overallStats.totalRows}</div>
          <div className="text-blue-100">Total Rows</div>
        </div>
        <div className="bg-gradient-to-r from-green-500 to-green-600 text-white p-4 rounded-lg">
          <div className="text-2xl font-bold">{overallStats.totalColumns}</div>
          <div className="text-green-100">Total Columns</div>
        </div>
        <div className="bg-gradient-to-r from-purple-500 to-purple-600 text-white p-4 rounded-lg">
          <div className="text-2xl font-bold">{overallStats.totalCells}</div>
          <div className="text-purple-100">Total Cells</div>
        </div>
        <div className="bg-gradient-to-r from-red-500 to-red-600 text-white p-4 rounded-lg">
          <div className="text-2xl font-bold">{overallStats.emptyCells}</div>
          <div className="text-red-100">Empty Cells</div>
        </div>
        <div className="bg-gradient-to-r from-teal-500 to-teal-600 text-white p-4 rounded-lg">
          <div className="text-2xl font-bold">{overallStats.completeness}%</div>
          <div className="text-teal-100">Data Completeness</div>
        </div>
      </div>

      {/* Column Statistics */}
      <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
        <div className="bg-gray-50 px-6 py-3 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-800">Column-wise Statistics</h3>
        </div>
        
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Column Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Type
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Count
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Unique
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Missing
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Statistics
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {statistics.map((stat, index) => (
                <tr key={index} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {stat.column}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      stat.type === 'numeric' ? 'bg-blue-100 text-blue-800' : 'bg-green-100 text-green-800'
                    }`}>
                      {stat.type === 'numeric' ? '🔢 Numeric' : '📝 Text'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {stat.count}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {stat.unique}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <span className={stat.missing > 0 ? 'text-red-600 font-semibold' : 'text-green-600'}>
                      {stat.missing}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    {stat.type === 'numeric' ? (
                      <div className="space-y-1">
                        <div>Min: {stat.min.toFixed(2)}, Max: {stat.max.toFixed(2)}</div>
                        <div>Mean: {stat.mean.toFixed(2)}, Median: {stat.median.toFixed(2)}</div>
                        <div>Std Dev: {stat.std.toFixed(2)}</div>
                      </div>
                    ) : (
                      <div>
                        {stat.mostCommon && (
                          <div>Most common: &quot;{stat.mostCommon.value}&quot; ({stat.mostCommon.count}x)</div>
                        )}
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Data Quality Insights */}
      <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <h4 className="text-lg font-semibold text-gray-800 mb-4">🔍 Data Quality Insights</h4>
          <div className="space-y-3">
            <div className="flex items-start space-x-2">
              <span className="text-green-500">✅</span>
              <div>
                <div className="font-medium">Data Completeness: {overallStats.completeness}%</div>
                <div className="text-sm text-gray-600">
                  {parseFloat(overallStats.completeness) > 90 ? 'Excellent data quality' : 
                   parseFloat(overallStats.completeness) > 75 ? 'Good data quality' : 'Needs improvement'}
                </div>
              </div>
            </div>
            
            <div className="flex items-start space-x-2">
              <span className="text-blue-500">📊</span>
              <div>
                <div className="font-medium">Column Types</div>
                <div className="text-sm text-gray-600">
                  {statistics.filter(s => s.type === 'numeric').length} numeric, {' '}
                  {statistics.filter(s => s.type === 'categorical').length} text columns
                </div>
              </div>
            </div>

            <div className="flex items-start space-x-2">
              <span className="text-yellow-500">⚠️</span>
              <div>
                <div className="font-medium">Missing Data</div>
                <div className="text-sm text-gray-600">
                  {statistics.filter(s => s.missing > 0).length} columns have missing values
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <h4 className="text-lg font-semibold text-gray-800 mb-4">💡 Recommendations</h4>
          <div className="space-y-3 text-sm">
            {parseFloat(overallStats.completeness) < 90 && (
              <div className="flex items-start space-x-2">
                <span className="text-orange-500">🔧</span>
                <div>Consider cleaning missing data for better analysis</div>
              </div>
            )}
            
            {statistics.some(s => s.type === 'numeric') && (
              <div className="flex items-start space-x-2">
                <span className="text-green-500">📈</span>
                <div>Use numeric columns for statistical analysis and visualizations</div>
              </div>
            )}
            
            {statistics.some(s => s.unique === 1) && (
              <div className="flex items-start space-x-2">
                <span className="text-red-500">🗑️</span>
                <div>Remove columns with only one unique value (they add no information)</div>
              </div>
            )}
            
            {statistics.some(s => s.unique > s.count * 0.9) && (
              <div className="flex items-start space-x-2">
                <span className="text-blue-500">🔑</span>
                <div>High unique value columns might be good identifiers</div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
