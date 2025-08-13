'use client';

import { useState, useMemo } from 'react';
import { CSVData } from '../../types/types';

interface ChartVisualizationProps {
  data: CSVData;
}

export default function ChartVisualization({ data }: ChartVisualizationProps) {
  const [selectedChart, setSelectedChart] = useState<'bar' | 'line' | 'pie' | 'scatter'>('bar');
  const [xColumn, setXColumn] = useState<string>(data.headers[0] || '');
  const [yColumn, setYColumn] = useState<string>(data.headers[1] || '');

  // Process data for charts
  const chartData = useMemo(() => {
    if (!xColumn || !yColumn) return [];
    
    const xIndex = data.headers.indexOf(xColumn);
    const yIndex = data.headers.indexOf(yColumn);
    
    if (xIndex === -1 || yIndex === -1) return [];

    const processedData = data.data.map((row, index) => ({
      x: row[xIndex] || `Row ${index + 1}`,
      y: parseFloat(row[yIndex]) || 0,
    })).filter(item => !isNaN(item.y));

    return processedData.slice(0, 20); // Limit to 20 items for better visualization
  }, [data, xColumn, yColumn]);

  const maxValue = Math.max(...chartData.map(item => item.y), 1);

  const renderBarChart = () => (
    <div className="space-y-2">
      {chartData.map((item, index) => (
        <div key={index} className="flex items-center space-x-3">
          <div className="w-20 text-sm text-gray-600 truncate" title={item.x}>
            {item.x}
          </div>
          <div className="flex-1 bg-gray-200 rounded-full h-8 relative">
            <div
              className="bg-gradient-to-r from-green-400 to-green-600 h-8 rounded-full flex items-center justify-end pr-2 transition-all duration-500"
              style={{ width: `${(item.y / maxValue) * 100}%` }}
            >
              <span className="text-white text-xs font-semibold">
                {item.y.toFixed(1)}
              </span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );

  const renderLineChart = () => (
    <div className="relative h-64 border border-gray-200 rounded-lg p-4">
      <svg width="100%" height="100%" viewBox="0 0 400 200">
        {/* Grid lines */}
        {[0, 1, 2, 3, 4].map(i => (
          <line
            key={i}
            x1="0"
            y1={i * 40}
            x2="400"
            y2={i * 40}
            stroke="#e5e7eb"
            strokeWidth="1"
          />
        ))}
        
        {/* Chart line */}
        {chartData.length > 1 && (
          <polyline
            fill="none"
            stroke="#10b981"
            strokeWidth="3"
            points={chartData.map((item, index) => 
              `${(index / (chartData.length - 1)) * 400},${200 - (item.y / maxValue) * 180}`
            ).join(' ')}
          />
        )}
        
        {/* Data points */}
        {chartData.map((item, index) => (
          <circle
            key={index}
            cx={(index / (chartData.length - 1)) * 400}
            cy={200 - (item.y / maxValue) * 180}
            r="4"
            fill="#059669"
          />
        ))}
      </svg>
    </div>
  );

  const renderPieChart = () => {
    const total = chartData.reduce((sum, item) => sum + item.y, 0);
    let currentAngle = 0;
    
    return (
      <div className="flex items-center justify-center">
        <div className="relative">
          <svg width="200" height="200" viewBox="0 0 200 200">
            {chartData.slice(0, 8).map((item, index) => {
              const angle = (item.y / total) * 360;
              const startAngle = currentAngle;
              const endAngle = currentAngle + angle;
              currentAngle += angle;

              const x1 = 100 + 80 * Math.cos((startAngle * Math.PI) / 180);
              const y1 = 100 + 80 * Math.sin((startAngle * Math.PI) / 180);
              const x2 = 100 + 80 * Math.cos((endAngle * Math.PI) / 180);
              const y2 = 100 + 80 * Math.sin((endAngle * Math.PI) / 180);

              const largeArc = angle > 180 ? 1 : 0;

              return (
                <path
                  key={index}
                  d={`M 100 100 L ${x1} ${y1} A 80 80 0 ${largeArc} 1 ${x2} ${y2} Z`}
                  fill={`hsl(${(index * 45) % 360}, 70%, 60%)`}
                  stroke="white"
                  strokeWidth="2"
                />
              );
            })}
          </svg>
        </div>
        <div className="ml-8 space-y-2">
          {chartData.slice(0, 8).map((item, index) => (
            <div key={index} className="flex items-center space-x-2">
              <div
                className="w-4 h-4 rounded"
                style={{ backgroundColor: `hsl(${(index * 45) % 360}, 70%, 60%)` }}
              />
              <span className="text-sm text-gray-600">
                {item.x}: {((item.y / total) * 100).toFixed(1)}%
              </span>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const renderScatterPlot = () => (
    <div className="relative h-64 border border-gray-200 rounded-lg p-4">
      <svg width="100%" height="100%" viewBox="0 0 400 200">
        {/* Grid lines */}
        {[0, 1, 2, 3, 4].map(i => (
          <g key={i}>
            <line x1="0" y1={i * 40} x2="400" y2={i * 40} stroke="#e5e7eb" strokeWidth="1" />
            <line x1={i * 80} y1="0" x2={i * 80} y2="200" stroke="#e5e7eb" strokeWidth="1" />
          </g>
        ))}
        
        {/* Scatter points */}
        {chartData.map((item, index) => (
          <circle
            key={index}
            cx={(index / (chartData.length - 1)) * 400}
            cy={200 - (item.y / maxValue) * 180}
            r="6"
            fill="#10b981"
            fillOpacity="0.7"
            stroke="#059669"
            strokeWidth="2"
          />
        ))}
      </svg>
    </div>
  );

  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-800 mb-6">📈 Data Visualization</h2>
      
      {/* Controls */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8 p-4 bg-gray-50 rounded-lg">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Chart Type</label>
          <select
            value={selectedChart}
            onChange={(e) => setSelectedChart(e.target.value as 'bar' | 'line' | 'pie' | 'scatter')}
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500"
          >
            <option value="bar">📊 Bar Chart</option>
            <option value="line">📈 Line Chart</option>
            <option value="pie">🥧 Pie Chart</option>
            <option value="scatter">🔸 Scatter Plot</option>
          </select>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">X-Axis Column</label>
          <select
            value={xColumn}
            onChange={(e) => setXColumn(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500"
          >
            {data.headers.map((header, index) => (
              <option key={index} value={header}>{header}</option>
            ))}
          </select>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Y-Axis Column</label>
          <select
            value={yColumn}
            onChange={(e) => setYColumn(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500"
          >
            {data.headers.map((header, index) => (
              <option key={index} value={header}>{header}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Chart Display */}
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">
          {selectedChart.charAt(0).toUpperCase() + selectedChart.slice(1)} Chart: {xColumn} vs {yColumn}
        </h3>
        
        {chartData.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            <p>No numeric data available for the selected columns.</p>
            <p className="text-sm mt-2">Please select columns with numeric values for the Y-axis.</p>
          </div>
        ) : (
          <div>
            {selectedChart === 'bar' && renderBarChart()}
            {selectedChart === 'line' && renderLineChart()}
            {selectedChart === 'pie' && renderPieChart()}
            {selectedChart === 'scatter' && renderScatterPlot()}
          </div>
        )}
      </div>

      {/* Chart Info */}
      <div className="mt-4 p-4 bg-blue-50 rounded-lg">
        <h4 className="font-semibold text-blue-800 mb-2">Chart Information</h4>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
          <div>
            <span className="text-blue-600 font-medium">Data Points:</span>
            <span className="ml-2">{chartData.length}</span>
          </div>
          <div>
            <span className="text-blue-600 font-medium">Max Value:</span>
            <span className="ml-2">{maxValue.toFixed(2)}</span>
          </div>
          <div>
            <span className="text-blue-600 font-medium">Min Value:</span>
            <span className="ml-2">{Math.min(...chartData.map(item => item.y), 0).toFixed(2)}</span>
          </div>
          <div>
            <span className="text-blue-600 font-medium">Average:</span>
            <span className="ml-2">{(chartData.reduce((sum, item) => sum + item.y, 0) / chartData.length || 0).toFixed(2)}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
