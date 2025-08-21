'use client';

import React, { useState, useMemo } from 'react';
import { CSVData } from '../../types/types';

interface StatisticalDashboardProps {
  data: CSVData;
}

export default function StatisticalDashboard({ data }: StatisticalDashboardProps) {
  const [selectedColumns, setSelectedColumns] = useState<string[]>([]);

  // Detect numeric columns
  const numericColumns = useMemo(() => {
    return data.headers.filter((header, index) => {
      const column = data.data.map(row => row[index]);
      const numericValues = column.filter(val => val && !isNaN(Number(val)));
      return numericValues.length > column.length * 0.7;
    });
  }, [data]);

  // Calculate basic statistics
  const statistics = useMemo(() => {
    if (selectedColumns.length === 0) return null;

    return selectedColumns.map(column => {
      const columnIndex = data.headers.indexOf(column);
      const values = data.data
        .map(row => Number(row[columnIndex]))
        .filter(val => !isNaN(val));

      if (values.length === 0) return null;

      const sorted = [...values].sort((a, b) => a - b);
      const mean = values.reduce((sum, val) => sum + val, 0) / values.length;
      const variance = values.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / values.length;
      const stdDev = Math.sqrt(variance);
      const median = sorted.length % 2 === 0 
        ? (sorted[sorted.length / 2 - 1] + sorted[sorted.length / 2]) / 2
        : sorted[Math.floor(sorted.length / 2)];

      return {
        column,
        count: values.length,
        mean,
        median,
        stdDev,
        variance,
        min: Math.min(...values),
        max: Math.max(...values),
        q1: sorted[Math.floor(sorted.length * 0.25)],
        q3: sorted[Math.floor(sorted.length * 0.75)]
      };
    }).filter(Boolean);
  }, [data, selectedColumns]);

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-200 p-6">
        <h3 className="text-lg font-semibold text-blue-800 mb-4">📊 Statistical Analysis Configuration</h3>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Select Columns to Analyze</label>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
            {numericColumns.map(col => (
              <label key={col} className="flex items-center">
                <input
                  type="checkbox"
                  checked={selectedColumns.includes(col)}
                  onChange={(e) => {
                    if (e.target.checked) {
                      setSelectedColumns([...selectedColumns, col]);
                    } else {
                      setSelectedColumns(selectedColumns.filter(c => c !== col));
                    }
                  }}
                  className="mr-2"
                />
                <span className="text-sm">{col}</span>
              </label>
            ))}
          </div>
        </div>
      </div>

      {statistics && statistics.length > 0 && (
        <div className="bg-white rounded-lg border overflow-hidden">
          <div className="px-6 py-4 border-b bg-gray-50">
            <h3 className="text-lg font-semibold text-gray-800">📈 Descriptive Statistics</h3>
          </div>
          
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Column</th>
                  <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase">Count</th>
                  <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase">Mean</th>
                  <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase">Median</th>
                  <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase">Std Dev</th>
                  <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase">Min</th>
                  <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase">Max</th>
                  <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase">Q1</th>
                  <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase">Q3</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {statistics.map((stat, index) => (
                  <tr key={index} className="hover:bg-gray-50">
                    <td className="px-4 py-3 text-sm font-medium text-gray-900">{stat?.column}</td>
                    <td className="px-4 py-3 text-sm text-center">{stat?.count}</td>
                    <td className="px-4 py-3 text-sm text-center">{stat?.mean.toFixed(2)}</td>
                    <td className="px-4 py-3 text-sm text-center">{stat?.median.toFixed(2)}</td>
                    <td className="px-4 py-3 text-sm text-center">{stat?.stdDev.toFixed(2)}</td>
                    <td className="px-4 py-3 text-sm text-center">{stat?.min.toFixed(2)}</td>
                    <td className="px-4 py-3 text-sm text-center">{stat?.max.toFixed(2)}</td>
                    <td className="px-4 py-3 text-sm text-center">{stat?.q1.toFixed(2)}</td>
                    <td className="px-4 py-3 text-sm text-center">{stat?.q3.toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
