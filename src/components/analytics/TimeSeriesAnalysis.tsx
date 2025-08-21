'use client';

import React, { useState, useMemo } from 'react';
import { CSVData } from '../../types/types';

interface TimeSeriesAnalysisProps {
  data: CSVData;
}

export default function TimeSeriesAnalysis({ data }: TimeSeriesAnalysisProps) {
  const [dateColumn, setDateColumn] = useState<string>('');
  const [valueColumn, setValueColumn] = useState<string>('');

  // Detect date columns
  const dateColumns = useMemo(() => {
    return data.headers.filter((header, index) => {
      const column = data.data.map(row => row[index]);
      const dateValues = column.filter(val => val && !isNaN(Date.parse(val)));
      return dateValues.length > column.length * 0.5;
    });
  }, [data]);

  // Detect numeric columns
  const numericColumns = useMemo(() => {
    return data.headers.filter((header, index) => {
      const column = data.data.map(row => row[index]);
      const numericValues = column.filter(val => val && !isNaN(Number(val)));
      return numericValues.length > column.length * 0.7;
    });
  }, [data]);

  const timeSeriesData = useMemo(() => {
    if (!dateColumn || !valueColumn) return null;

    const dateIndex = data.headers.indexOf(dateColumn);
    const valueIndex = data.headers.indexOf(valueColumn);

    const timeSeries = data.data
      .map(row => ({
        date: new Date(row[dateIndex]),
        value: Number(row[valueIndex])
      }))
      .filter(item => !isNaN(item.date.getTime()) && !isNaN(item.value))
      .sort((a, b) => a.date.getTime() - b.date.getTime());

    if (timeSeries.length < 2) return null;

    // Calculate trend
    const values = timeSeries.map(item => item.value);
    const trend = values.length > 1 ? 
      (values[values.length - 1] - values[0]) / (values.length - 1) : 0;

    return {
      data: timeSeries,
      trend,
      min: Math.min(...values),
      max: Math.max(...values),
      average: values.reduce((sum, val) => sum + val, 0) / values.length
    };
  }, [data, dateColumn, valueColumn]);

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg border border-green-200 p-6">
        <h3 className="text-lg font-semibold text-green-800 mb-4">📈 Time Series Configuration</h3>
        
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Date Column</label>
            <select
              value={dateColumn}
              onChange={(e) => setDateColumn(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
            >
              <option value="">Select date column</option>
              {dateColumns.map(col => (
                <option key={col} value={col}>{col}</option>
              ))}
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Value Column</label>
            <select
              value={valueColumn}
              onChange={(e) => setValueColumn(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
            >
              <option value="">Select value column</option>
              {numericColumns.map(col => (
                <option key={col} value={col}>{col}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {timeSeriesData && (
        <div className="bg-white rounded-lg border p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">📊 Time Series Analysis Results</h3>
          
          <div className="grid md:grid-cols-4 gap-6 mb-6">
            <div className="bg-blue-50 p-4 rounded-lg">
              <div className="text-sm text-blue-600 mb-1">Data Points</div>
              <div className="text-2xl font-bold text-blue-800">{timeSeriesData.data.length}</div>
            </div>
            
            <div className="bg-green-50 p-4 rounded-lg">
              <div className="text-sm text-green-600 mb-1">Average Value</div>
              <div className="text-2xl font-bold text-green-800">{timeSeriesData.average.toFixed(2)}</div>
            </div>
            
            <div className="bg-purple-50 p-4 rounded-lg">
              <div className="text-sm text-purple-600 mb-1">Trend</div>
              <div className={`text-2xl font-bold ${timeSeriesData.trend > 0 ? 'text-green-600' : 'text-red-600'}`}>
                {timeSeriesData.trend > 0 ? '↗' : '↘'} {Math.abs(timeSeriesData.trend).toFixed(4)}
              </div>
            </div>
            
            <div className="bg-orange-50 p-4 rounded-lg">
              <div className="text-sm text-orange-600 mb-1">Range</div>
              <div className="text-lg font-bold text-orange-800">
                {timeSeriesData.min.toFixed(1)} - {timeSeriesData.max.toFixed(1)}
              </div>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full border border-gray-200 rounded-lg">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                  <th className="px-4 py-2 text-center text-xs font-medium text-gray-500 uppercase">Value</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {timeSeriesData.data.slice(0, 10).map((item, index) => (
                  <tr key={index} className="hover:bg-gray-50">
                    <td className="px-4 py-2 text-sm text-gray-900">
                      {item.date.toLocaleDateString()}
                    </td>
                    <td className="px-4 py-2 text-sm text-center font-semibold">
                      {item.value.toFixed(2)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          {timeSeriesData.data.length > 10 && (
            <div className="mt-3 text-sm text-gray-600 text-center">
              Showing first 10 of {timeSeriesData.data.length} data points
            </div>
          )}
        </div>
      )}
    </div>
  );
}
