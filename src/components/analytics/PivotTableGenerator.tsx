'use client';

import React, { useState, useMemo } from 'react';
import { CSVData } from '../../types/types';

interface PivotTableGeneratorProps {
  data: CSVData;
}

export default function PivotTableGenerator({ data }: PivotTableGeneratorProps) {
  const [rowField, setRowField] = useState<string>('');
  const [columnField, setColumnField] = useState<string>('');
  const [valueField, setValueField] = useState<string>('');
  const [aggregation, setAggregation] = useState<'sum' | 'count' | 'average'>('sum');

  // Detect categorical columns for rows/columns
  const categoricalColumns = useMemo(() => {
    return data.headers.filter((header, index) => {
      const column = data.data.map(row => row[index]);
      const uniqueValues = new Set(column).size;
      return uniqueValues > 1 && uniqueValues <= Math.min(50, column.length * 0.5);
    });
  }, [data]);

  // Detect numeric columns for values
  const numericColumns = useMemo(() => {
    return data.headers.filter((header, index) => {
      const column = data.data.map(row => row[index]);
      const numericValues = column.filter(val => val && !isNaN(Number(val)));
      return numericValues.length > column.length * 0.7;
    });
  }, [data]);

  const pivotData = useMemo(() => {
    if (!rowField) return null;

    const rowIndex = data.headers.indexOf(rowField);
    const columnIndex = columnField ? data.headers.indexOf(columnField) : -1;
    const valueIndex = valueField ? data.headers.indexOf(valueField) : -1;

    const pivot = new Map();
    const columnValues = new Set();

    data.data.forEach(row => {
      const rowValue = row[rowIndex] || 'null';
      const columnValue = columnIndex >= 0 ? (row[columnIndex] || 'null') : 'Total';
      const dataValue = valueIndex >= 0 ? Number(row[valueIndex]) : 1;

      if (columnIndex >= 0) columnValues.add(columnValue);

      const key = `${rowValue}|||${columnValue}`;
      
      if (!pivot.has(key)) {
        pivot.set(key, { count: 0, sum: 0, values: [] });
      }
      
      const entry = pivot.get(key);
      entry.count += 1;
      entry.sum += isNaN(dataValue) ? 0 : dataValue;
      entry.values.push(dataValue);
    });

    // Process pivot data
    const rows = new Set();
    const columns = columnIndex >= 0 ? Array.from(columnValues).sort() : ['Total'];
    
    data.data.forEach(row => {
      rows.add(row[rowIndex] || 'null');
    });

    const result = Array.from(rows).map(rowValue => {
      const rowData: any = { row: rowValue };
      
      columns.forEach(columnValue => {
        const key = `${rowValue}|||${columnValue}`;
        const entry = pivot.get(key);
        
        if (entry) {
          switch (aggregation) {
            case 'sum':
              rowData[columnValue] = entry.sum;
              break;
            case 'count':
              rowData[columnValue] = entry.count;
              break;
            case 'average':
              rowData[columnValue] = entry.sum / entry.count;
              break;
          }
        } else {
          rowData[columnValue] = 0;
        }
      });
      
      return rowData;
    });

    return { data: result, columns };
  }, [data, rowField, columnField, valueField, aggregation]);

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-lg border border-indigo-200 p-6">
        <h3 className="text-lg font-semibold text-indigo-800 mb-4">🔄 Pivot Table Configuration</h3>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Row Field</label>
            <select
              value={rowField}
              onChange={(e) => setRowField(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="">Select row field</option>
              {categoricalColumns.map(col => (
                <option key={col} value={col}>{col}</option>
              ))}
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Column Field (Optional)</label>
            <select
              value={columnField}
              onChange={(e) => setColumnField(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="">No column grouping</option>
              {categoricalColumns.map(col => (
                <option key={col} value={col}>{col}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Value Field (Optional)</label>
            <select
              value={valueField}
              onChange={(e) => setValueField(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="">Count rows</option>
              {numericColumns.map(col => (
                <option key={col} value={col}>{col}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Aggregation</label>
            <select
              value={aggregation}
              onChange={(e) => setAggregation(e.target.value as 'sum' | 'count' | 'average')}
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="sum">Sum</option>
              <option value="count">Count</option>
              <option value="average">Average</option>
            </select>
          </div>
        </div>
      </div>

      {pivotData && (
        <div className="bg-white rounded-lg border overflow-hidden">
          <div className="px-6 py-4 border-b bg-gray-50">
            <h3 className="text-lg font-semibold text-gray-800">📊 Pivot Table Results</h3>
            <p className="text-sm text-gray-600">
              {aggregation} of {valueField || 'row count'} by {rowField}
              {columnField && ` and ${columnField}`}
            </p>
          </div>
          
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase sticky left-0 bg-gray-50">
                    {rowField}
                  </th>
                  {pivotData.columns.map(col => (
                    <th key={col} className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase">
                      {col}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {pivotData.data.slice(0, 50).map((row, index) => (
                  <tr key={index} className="hover:bg-gray-50">
                    <td className="px-4 py-3 text-sm font-medium text-gray-900 sticky left-0 bg-white">
                      {row.row}
                    </td>
                    {pivotData.columns.map(col => (
                      <td key={col} className="px-4 py-3 text-sm text-center text-gray-600">
                        {typeof row[col] === 'number' ? row[col].toFixed(2) : row[col]}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          {pivotData.data.length > 50 && (
            <div className="px-6 py-3 bg-gray-50 text-sm text-gray-600 text-center">
              Showing first 50 of {pivotData.data.length} rows
            </div>
          )}
        </div>
      )}
    </div>
  );
}
