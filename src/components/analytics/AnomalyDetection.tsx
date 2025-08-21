'use client';

import React, { useState, useMemo } from 'react';
import { CSVData } from '../../types/types';

interface AnomalyDetectionProps {
  data: CSVData;
}

interface AnomalyResult {
  rowIndex: number;
  anomalies: {
    column: string;
    value: any;
    expected: number;
    zscore: number;
    severity: 'low' | 'medium' | 'high';
  }[];
  overallScore: number;
}

interface ColumnQuality {
  column: string;
  nullCount: number;
  nullPercentage: number;
  uniqueCount: number;
  duplicateCount: number;
  dataType: 'numeric' | 'text' | 'date' | 'mixed';
  outlierCount: number;
  quality: 'excellent' | 'good' | 'fair' | 'poor';
}

export default function AnomalyDetection({ data }: AnomalyDetectionProps) {
  const [selectedColumns, setSelectedColumns] = useState<string[]>([]);
  const [sensitivityLevel, setSensitivityLevel] = useState<number>(2); // Z-score threshold
  const [maxAnomalies, setMaxAnomalies] = useState<number>(50);

  // Detect numeric columns for anomaly detection
  const numericColumns = useMemo(() => {
    return data.headers.filter((header, index) => {
      const column = data.data.map(row => row[index]);
      const numericValues = column.filter(val => val && !isNaN(Number(val)));
      return numericValues.length > column.length * 0.7;
    });
  }, [data]);

  // Data Quality Assessment
  const dataQuality = useMemo((): ColumnQuality[] => {
    return data.headers.map((header, index) => {
      const column = data.data.map(row => row[index]);
      const nonEmptyValues = column.filter(val => val !== null && val !== undefined && val !== '');
      
      const nullCount = column.length - nonEmptyValues.length;
      const nullPercentage = (nullCount / column.length) * 100;
      const uniqueValues = new Set(nonEmptyValues);
      const uniqueCount = uniqueValues.size;
      const duplicateCount = nonEmptyValues.length - uniqueCount;
      
      // Determine data type
      const numericCount = nonEmptyValues.filter(val => !isNaN(Number(val))).length;
      const dateCount = nonEmptyValues.filter(val => !isNaN(Date.parse(val))).length;
      
      let dataType: 'numeric' | 'text' | 'date' | 'mixed';
      if (numericCount > nonEmptyValues.length * 0.8) dataType = 'numeric';
      else if (dateCount > nonEmptyValues.length * 0.8) dataType = 'date';
      else if (numericCount > nonEmptyValues.length * 0.3) dataType = 'mixed';
      else dataType = 'text';
      
      // Outlier detection for numeric columns
      let outlierCount = 0;
      if (dataType === 'numeric') {
        const numericValues = nonEmptyValues.map(val => Number(val)).filter(val => !isNaN(val));
        if (numericValues.length > 0) {
          const mean = numericValues.reduce((sum, val) => sum + val, 0) / numericValues.length;
          const variance = numericValues.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / numericValues.length;
          const stdDev = Math.sqrt(variance);
          
          outlierCount = numericValues.filter(val => Math.abs((val - mean) / stdDev) > 2).length;
        }
      }
      
      // Overall quality assessment
      let quality: 'excellent' | 'good' | 'fair' | 'poor';
      const qualityScore = 
        (nullPercentage < 5 ? 25 : nullPercentage < 15 ? 15 : nullPercentage < 30 ? 5 : 0) +
        (outlierCount / nonEmptyValues.length < 0.05 ? 25 : outlierCount / nonEmptyValues.length < 0.1 ? 15 : 5) +
        (uniqueCount / nonEmptyValues.length > 0.8 ? 25 : uniqueCount / nonEmptyValues.length > 0.5 ? 15 : 5) +
        (dataType !== 'mixed' ? 25 : 10);
      
      if (qualityScore >= 80) quality = 'excellent';
      else if (qualityScore >= 60) quality = 'good';
      else if (qualityScore >= 40) quality = 'fair';
      else quality = 'poor';
      
      return {
        column: header,
        nullCount,
        nullPercentage,
        uniqueCount,
        duplicateCount,
        dataType,
        outlierCount,
        quality
      };
    });
  }, [data]);

  // Anomaly Detection
  const anomalies = useMemo((): AnomalyResult[] => {
    if (selectedColumns.length === 0) return [];

    const columnIndices = selectedColumns.map(col => data.headers.indexOf(col));
    const results: AnomalyResult[] = [];

    // Calculate statistics for each selected column
    const columnStats = columnIndices.map(colIndex => {
      const values = data.data
        .map(row => Number(row[colIndex]))
        .filter(val => !isNaN(val));
      
      if (values.length === 0) return null;
      
      const mean = values.reduce((sum, val) => sum + val, 0) / values.length;
      const variance = values.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / values.length;
      const stdDev = Math.sqrt(variance);
      
      return { mean, stdDev, column: data.headers[colIndex] };
    });

    // Check each row for anomalies
    data.data.forEach((row, rowIndex) => {
      const rowAnomalies: AnomalyResult['anomalies'] = [];
      let totalZScore = 0;

      columnIndices.forEach((colIndex, i) => {
        const stats = columnStats[i];
        if (!stats) return;

        const value = Number(row[colIndex]);
        if (isNaN(value)) return;

        const zscore = Math.abs((value - stats.mean) / stats.stdDev);
        
        if (zscore > sensitivityLevel) {
          let severity: 'low' | 'medium' | 'high';
          if (zscore > 3) severity = 'high';
          else if (zscore > 2.5) severity = 'medium';
          else severity = 'low';

          rowAnomalies.push({
            column: stats.column,
            value: row[colIndex],
            expected: stats.mean,
            zscore,
            severity
          });
          
          totalZScore += zscore;
        }
      });

      if (rowAnomalies.length > 0) {
        results.push({
          rowIndex,
          anomalies: rowAnomalies,
          overallScore: totalZScore / rowAnomalies.length
        });
      }
    });

    return results
      .sort((a, b) => b.overallScore - a.overallScore)
      .slice(0, maxAnomalies);
  }, [data, selectedColumns, sensitivityLevel, maxAnomalies]);

  return (
    <div className="space-y-6">
      {/* Configuration */}
      <div className="bg-gradient-to-r from-orange-50 to-amber-50 rounded-lg border border-orange-200 p-6">
        <h3 className="text-lg font-semibold text-orange-800 mb-4">🚨 Anomaly Detection Configuration</h3>
        
        <div className="grid md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Columns to Analyze</label>
            <div className="space-y-2 max-h-32 overflow-y-auto border border-gray-300 rounded-md p-2">
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
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Sensitivity (Z-score threshold)</label>
            <select
              value={sensitivityLevel}
              onChange={(e) => setSensitivityLevel(Number(e.target.value))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
            >
              <option value="1.5">High Sensitivity (1.5σ)</option>
              <option value="2">Medium Sensitivity (2σ)</option>
              <option value="2.5">Low Sensitivity (2.5σ)</option>
              <option value="3">Very Low Sensitivity (3σ)</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Max Anomalies to Show</label>
            <input
              type="number"
              value={maxAnomalies}
              onChange={(e) => setMaxAnomalies(Number(e.target.value))}
              min="10"
              max="200"
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
          </div>
        </div>
      </div>

      {/* Data Quality Overview */}
      <div className="bg-white rounded-lg border p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">📊 Data Quality Assessment</h3>
        
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Column</th>
                <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase">Data Type</th>
                <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase">Missing Values</th>
                <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase">Unique Values</th>
                <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase">Outliers</th>
                <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase">Quality</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {dataQuality.map((quality, index) => (
                <tr key={index} className="hover:bg-gray-50">
                  <td className="px-4 py-3 text-sm font-medium text-gray-900">{quality.column}</td>
                  <td className="px-4 py-3 text-center">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      quality.dataType === 'numeric' ? 'bg-blue-100 text-blue-800' :
                      quality.dataType === 'date' ? 'bg-green-100 text-green-800' :
                      quality.dataType === 'mixed' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {quality.dataType}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-center text-sm">
                    <div>{quality.nullCount}</div>
                    <div className="text-xs text-gray-500">({quality.nullPercentage.toFixed(1)}%)</div>
                  </td>
                  <td className="px-4 py-3 text-center text-sm">{quality.uniqueCount.toLocaleString()}</td>
                  <td className="px-4 py-3 text-center text-sm">
                    {quality.dataType === 'numeric' ? quality.outlierCount : '-'}
                  </td>
                  <td className="px-4 py-3 text-center">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      quality.quality === 'excellent' ? 'bg-green-100 text-green-800' :
                      quality.quality === 'good' ? 'bg-blue-100 text-blue-800' :
                      quality.quality === 'fair' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {quality.quality}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Anomaly Results */}
      {anomalies.length > 0 && (
        <div className="bg-white rounded-lg border">
          <div className="px-6 py-4 border-b bg-gray-50">
            <h3 className="text-lg font-semibold text-gray-800">🔍 Detected Anomalies</h3>
            <p className="text-sm text-gray-600">
              Found {anomalies.length} anomalous rows (threshold: {sensitivityLevel}σ)
            </p>
          </div>
          
          <div className="max-h-96 overflow-y-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50 sticky top-0">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Row</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Anomalous Columns</th>
                  <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase">Severity</th>
                  <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase">Overall Score</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {anomalies.slice(0, 30).map((result, index) => {
                  const maxSeverity = result.anomalies.reduce((max, anomaly) => {
                    const severityLevels = { low: 1, medium: 2, high: 3 };
                    return severityLevels[anomaly.severity] > severityLevels[max] ? anomaly.severity : max;
                  }, 'low' as 'low' | 'medium' | 'high');

                  return (
                    <tr key={index} className="hover:bg-gray-50">
                      <td className="px-4 py-3 text-sm font-medium text-gray-900">
                        Row {result.rowIndex + 1}
                      </td>
                      <td className="px-4 py-3 text-sm">
                        <div className="space-y-1">
                          {result.anomalies.map((anomaly, i) => (
                            <div key={i} className="flex items-center justify-between">
                              <span className="font-medium">{anomaly.column}:</span>
                              <span className="text-gray-600">
                                {anomaly.value} (Z: {anomaly.zscore.toFixed(2)})
                              </span>
                            </div>
                          ))}
                        </div>
                      </td>
                      <td className="px-4 py-3 text-center">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          maxSeverity === 'high' ? 'bg-red-100 text-red-800' :
                          maxSeverity === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-orange-100 text-orange-800'
                        }`}>
                          {maxSeverity}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-center text-sm font-semibold">
                        {result.overallScore.toFixed(2)}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          
          {anomalies.length > 30 && (
            <div className="px-6 py-3 bg-gray-50 text-sm text-gray-600 text-center">
              Showing first 30 of {anomalies.length} anomalies
            </div>
          )}
        </div>
      )}

      {/* Summary Statistics */}
      {anomalies.length > 0 && (
        <div className="grid md:grid-cols-4 gap-4">
          <div className="bg-red-50 p-4 rounded-lg">
            <div className="text-sm text-red-600 mb-1">High Severity</div>
            <div className="text-2xl font-bold text-red-800">
              {anomalies.filter(a => a.anomalies.some(an => an.severity === 'high')).length}
            </div>
          </div>
          
          <div className="bg-yellow-50 p-4 rounded-lg">
            <div className="text-sm text-yellow-600 mb-1">Medium Severity</div>
            <div className="text-2xl font-bold text-yellow-800">
              {anomalies.filter(a => a.anomalies.some(an => an.severity === 'medium')).length}
            </div>
          </div>
          
          <div className="bg-orange-50 p-4 rounded-lg">
            <div className="text-sm text-orange-600 mb-1">Low Severity</div>
            <div className="text-2xl font-bold text-orange-800">
              {anomalies.filter(a => a.anomalies.every(an => an.severity === 'low')).length}
            </div>
          </div>
          
          <div className="bg-blue-50 p-4 rounded-lg">
            <div className="text-sm text-blue-600 mb-1">Data Health</div>
            <div className={`text-2xl font-bold ${
              (anomalies.length / data.data.length) < 0.05 ? 'text-green-600' :
              (anomalies.length / data.data.length) < 0.1 ? 'text-yellow-600' : 'text-red-600'
            }`}>
              {((1 - anomalies.length / data.data.length) * 100).toFixed(1)}%
            </div>
          </div>
        </div>
      )}

      {/* Export Options */}
      <div className="flex gap-2 pt-4 border-t border-gray-200">
        <button className="px-4 py-2 bg-orange-500 text-white rounded-lg text-sm font-medium hover:bg-orange-600 transition-colors">
          🚨 Export Anomalies
        </button>
        <button className="px-4 py-2 bg-blue-500 text-white rounded-lg text-sm font-medium hover:bg-blue-600 transition-colors">
          📊 Quality Report
        </button>
        <button className="px-4 py-2 bg-green-500 text-white rounded-lg text-sm font-medium hover:bg-green-600 transition-colors">
          🔧 Suggest Fixes
        </button>
      </div>
    </div>
  );
}
