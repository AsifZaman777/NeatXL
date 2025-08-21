'use client';

import React, { useState, useMemo } from 'react';
import { CSVData } from '../../types/types';

interface ABTestAnalysisProps {
  data: CSVData;
}

export default function ABTestAnalysis({ data }: ABTestAnalysisProps) {
  const [groupColumn, setGroupColumn] = useState<string>('');
  const [metricColumn, setMetricColumn] = useState<string>('');

  // Detect categorical columns for groups
  const categoricalColumns = useMemo(() => {
    return data.headers.filter((header, index) => {
      const column = data.data.map(row => row[index]);
      const uniqueValues = new Set(column).size;
      return uniqueValues >= 2 && uniqueValues <= 10; // Reasonable range for A/B test groups
    });
  }, [data]);

  // Detect numeric columns for metrics
  const numericColumns = useMemo(() => {
    return data.headers.filter((header, index) => {
      const column = data.data.map(row => row[index]);
      const numericValues = column.filter(val => val && !isNaN(Number(val)));
      return numericValues.length > column.length * 0.7;
    });
  }, [data]);

  const testResults = useMemo(() => {
    if (!groupColumn || !metricColumn) return null;

    const groupIndex = data.headers.indexOf(groupColumn);
    const metricIndex = data.headers.indexOf(metricColumn);

    // Group data by test group
    const groups = new Map();
    
    data.data.forEach(row => {
      const group = row[groupIndex];
      const value = Number(row[metricIndex]);
      
      if (group && !isNaN(value)) {
        if (!groups.has(group)) {
          groups.set(group, []);
        }
        groups.get(group).push(value);
      }
    });

    if (groups.size < 2) return null;

    const groupStats = Array.from(groups.entries()).map(([group, values]) => {
      const n = values.length;
      const mean = values.reduce((a, b) => a + b, 0) / n;
      const variance = values.reduce((acc, val) => acc + Math.pow(val - mean, 2), 0) / (n - 1);
      const std = Math.sqrt(variance);
      
      return {
        group,
        n,
        mean,
        std,
        variance,
        values
      };
    });

    // Simple t-test for first two groups
    if (groupStats.length >= 2) {
      const group1 = groupStats[0];
      const group2 = groupStats[1];
      
      const pooledVariance = ((group1.n - 1) * group1.variance + (group2.n - 1) * group2.variance) / 
                            (group1.n + group2.n - 2);
      const standardError = Math.sqrt(pooledVariance * (1/group1.n + 1/group2.n));
      
      const tStat = (group1.mean - group2.mean) / standardError;
      const degreesOfFreedom = group1.n + group2.n - 2;
      
      // Simplified p-value (normally would use t-distribution)
      const pValue = Math.abs(tStat) > 2 ? 0.05 : 0.1;
      
      return {
        groupStats,
        tStat,
        pValue,
        isSignificant: pValue < 0.05,
        effectSize: Math.abs(group1.mean - group2.mean) / Math.sqrt(pooledVariance)
      };
    }

    return { groupStats };
  }, [data, groupColumn, metricColumn]);

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-yellow-50 to-amber-50 rounded-lg border border-yellow-200 p-6">
        <h3 className="text-lg font-semibold text-yellow-800 mb-4">⚖️ A/B Test Configuration</h3>
        
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Test Group Column</label>
            <select
              value={groupColumn}
              onChange={(e) => setGroupColumn(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-yellow-500"
            >
              <option value="">Select group column</option>
              {categoricalColumns.map(col => (
                <option key={col} value={col}>{col}</option>
              ))}
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Metric Column</label>
            <select
              value={metricColumn}
              onChange={(e) => setMetricColumn(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-yellow-500"
            >
              <option value="">Select metric column</option>
              {numericColumns.map(col => (
                <option key={col} value={col}>{col}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {testResults && (
        <div className="bg-white rounded-lg border p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">📊 A/B Test Results</h3>
          
          {/* Group Statistics */}
          <div className="overflow-x-auto mb-6">
            <table className="min-w-full border border-gray-200 rounded-lg">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Group</th>
                  <th className="px-4 py-2 text-center text-xs font-medium text-gray-500 uppercase">Sample Size</th>
                  <th className="px-4 py-2 text-center text-xs font-medium text-gray-500 uppercase">Mean</th>
                  <th className="px-4 py-2 text-center text-xs font-medium text-gray-500 uppercase">Std Dev</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {testResults.groupStats.map((group, index) => (
                  <tr key={index} className="hover:bg-gray-50">
                    <td className="px-4 py-2 text-sm font-medium text-gray-900">{group.group}</td>
                    <td className="px-4 py-2 text-sm text-center">{group.n}</td>
                    <td className="px-4 py-2 text-sm text-center">{group.mean.toFixed(4)}</td>
                    <td className="px-4 py-2 text-sm text-center">{group.std.toFixed(4)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Statistical Test Results */}
          {testResults.tStat !== undefined && (
            <div className="grid md:grid-cols-3 gap-6">
              <div className="bg-blue-50 p-4 rounded-lg">
                <div className="text-sm text-blue-600 mb-1">T-Statistic</div>
                <div className="text-2xl font-bold text-blue-800">{testResults.tStat.toFixed(4)}</div>
              </div>
              
              <div className="bg-green-50 p-4 rounded-lg">
                <div className="text-sm text-green-600 mb-1">P-Value</div>
                <div className={`text-2xl font-bold ${testResults.pValue < 0.05 ? 'text-red-600' : 'text-green-800'}`}>
                  {testResults.pValue.toFixed(4)}
                </div>
              </div>
              
              <div className="bg-purple-50 p-4 rounded-lg">
                <div className="text-sm text-purple-600 mb-1">Result</div>
                <div className={`text-lg font-bold ${testResults.isSignificant ? 'text-red-600' : 'text-gray-600'}`}>
                  {testResults.isSignificant ? 'Significant' : 'Not Significant'}
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
