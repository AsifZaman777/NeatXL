'use client';

import { useState, useMemo } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import type { ChartData, ChartOptions } from 'chart.js';
import {
  Bar,
  Line,
  Pie,
  Scatter,
} from 'react-chartjs-2';
import { CSVData } from '../../types/types';

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

interface ChartVisualizationProps {
  data: CSVData;
  columns?: string[];
}

export default function ChartVisualization({ data, columns }: ChartVisualizationProps) {
  const availableColumns = columns || data?.headers || [];
  const [selectedChart, setSelectedChart] = useState<'bar' | 'line' | 'pie' | 'scatter'>('bar');
  const [xColumn, setXColumn] = useState(availableColumns[0] || '');
  const [yColumn, setYColumn] = useState(availableColumns[1] || '');

  // Prepare chart data
  const chartData = useMemo(() => {
    if (!data || !data.data || data.data.length === 0) return [];
    
    const xColumnIndex = data.headers.indexOf(xColumn);
    const yColumnIndex = data.headers.indexOf(yColumn);
    
    if (xColumnIndex === -1 || yColumnIndex === -1) return [];
    
    return data.data.slice(0, 20).map((row: string[], index: number) => ({
      x: row[xColumnIndex] || `Item ${index + 1}`,
      y: parseFloat(String(row[yColumnIndex])) || 0,
    }));
  }, [data, xColumn, yColumn]);

  // Generate colors
  const colors = useMemo(() => {
    return chartData.map((_, index) => 
      `hsl(${(index * 137.5) % 360}, 70%, 60%)`
    );
  }, [chartData]);

  // Prepare data for different chart types
  const chartDataFormatted = useMemo(() => {
    if (selectedChart === 'scatter') {
      return {
        datasets: [
          {
            label: `${xColumn} vs ${yColumn}`,
            data: chartData.map((item, index) => ({ x: index, y: item.y })),
            backgroundColor: 'rgba(16, 185, 129, 0.6)',
            borderColor: 'rgba(16, 185, 129, 1)',
            borderWidth: 2,
            pointRadius: 6,
            pointHoverRadius: 8,
          },
        ],
      } as ChartData<'scatter'>;
    }

    const labels = chartData.map(item => String(item.x));
    const values = chartData.map(item => item.y);
    
    if (selectedChart === 'pie') {
      return {
        labels,
        datasets: [
          {
            label: yColumn,
            data: values,
            backgroundColor: colors.map(color => color.replace('60%', '50%')),
            borderColor: colors.map(color => color.replace('60%', '70%')),
            borderWidth: 2,
          },
        ],
      } as ChartData<'pie'>;
    }

    if (selectedChart === 'line') {
      return {
        labels,
        datasets: [
          {
            label: yColumn,
            data: values,
            backgroundColor: 'rgba(16, 185, 129, 0.1)',
            borderColor: 'rgba(16, 185, 129, 1)',
            borderWidth: 3,
            tension: 0.4,
            fill: false,
            pointBackgroundColor: 'rgba(16, 185, 129, 1)',
            pointBorderColor: 'rgba(16, 185, 129, 1)',
            pointRadius: 5,
            pointHoverRadius: 7,
          },
        ],
      } as ChartData<'line'>;
    }

    // Default to bar chart
    return {
      labels,
      datasets: [
        {
          label: yColumn,
          data: values,
          backgroundColor: 'rgba(16, 185, 129, 0.6)',
          borderColor: 'rgba(16, 185, 129, 1)',
          borderWidth: 2,
        },
      ],
    } as ChartData<'bar'>;
  }, [chartData, selectedChart, xColumn, yColumn, colors]);

  // Chart options
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const chartOptions: ChartOptions<any> = useMemo(() => ({
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top' as const,
        labels: {
          color: '#374151',
          font: {
            size: 12,
            weight: 'bold',
          },
        },
      },
      title: {
        display: true,
        text: `${yColumn} ${selectedChart === 'scatter' ? 'vs' : 'by'} ${xColumn}`,
        color: '#1f2937',
        font: {
          size: 16,
          weight: 'bold',
        },
        padding: 20,
      },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        titleColor: '#ffffff',
        bodyColor: '#ffffff',
        borderColor: 'rgba(16, 185, 129, 1)',
        borderWidth: 1,
        cornerRadius: 8,
        displayColors: true,
      },
    },
    scales: selectedChart === 'pie' ? undefined : {
      x: {
        grid: {
          color: 'rgba(156, 163, 175, 0.3)',
        },
        ticks: {
          color: '#6b7280',
          font: {
            size: 11,
          },
          maxRotation: 45,
        },
        title: {
          display: true,
          text: xColumn,
          color: '#374151',
          font: {
            size: 13,
            weight: 'bold',
          },
        },
      },
      y: {
        grid: {
          color: 'rgba(156, 163, 175, 0.3)',
        },
        ticks: {
          color: '#6b7280',
          font: {
            size: 11,
          },
        },
        title: {
          display: true,
          text: yColumn,
          color: '#374151',
          font: {
            size: 13,
            weight: 'bold',
          },
        },
      },
    },
  }), [selectedChart, xColumn, yColumn]);

  const renderChart = () => {
    try {
      switch (selectedChart) {
        case 'bar':
          return <Bar data={chartDataFormatted as ChartData<'bar'>} options={chartOptions} />;
        case 'line':
          return <Line data={chartDataFormatted as ChartData<'line'>} options={chartOptions} />;
        case 'pie':
          return <Pie data={chartDataFormatted as ChartData<'pie'>} options={chartOptions} />;
        case 'scatter':
          return <Scatter data={chartDataFormatted as ChartData<'scatter'>} options={chartOptions} />;
        default:
          return <Bar data={chartDataFormatted as ChartData<'bar'>} options={chartOptions} />;
      }
    } catch (error) {
      console.error('Chart rendering error:', error);
      return (
        <div className="flex items-center justify-center h-64 text-red-500">
          Error rendering chart. Please check your data.
        </div>
      );
    }
  };

  if (!data || !data.data || data.data.length === 0) {
    return (
      <div className="bg-white p-6 rounded-lg shadow-sm border">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Chart Visualization</h3>
        <div className="flex items-center justify-center h-64 text-gray-500">
          No data available for visualization
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 gap-4">
        <h3 className="text-lg font-semibold text-gray-900">Chart Visualization</h3>
        
        <div className="flex flex-wrap items-center gap-3">
          {/* Chart Type Selector */}
          <div className="flex items-center gap-2">
            <label className="text-sm font-medium text-gray-700">Chart Type:</label>
            <select
              value={selectedChart}
              onChange={(e) => setSelectedChart(e.target.value as 'bar' | 'line' | 'pie' | 'scatter')}
              className="px-3 py-1.5 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
            >
              <option value="bar">Bar Chart</option>
              <option value="line">Line Chart</option>
              <option value="pie">Pie Chart</option>
              <option value="scatter">Scatter Plot</option>
            </select>
          </div>

          {/* X-Axis Column Selector */}
          <div className="flex items-center gap-2">
            <label className="text-sm font-medium text-gray-700">X-Axis:</label>
            <select
              value={xColumn}
              onChange={(e) => setXColumn(e.target.value)}
              className="px-3 py-1.5 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
            >
              {availableColumns.map((column) => (
                <option key={column} value={column}>
                  {column}
                </option>
              ))}
            </select>
          </div>

          {/* Y-Axis Column Selector */}
          <div className="flex items-center gap-2">
            <label className="text-sm font-medium text-gray-700">Y-Axis:</label>
            <select
              value={yColumn}
              onChange={(e) => setYColumn(e.target.value)}
              className="px-3 py-1.5 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
            >
              {availableColumns.map((column) => (
                <option key={column} value={column}>
                  {column}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Chart Container */}
      <div className="h-96 w-full bg-gray-50 rounded-lg p-4">
        {renderChart()}
      </div>

      {/* Chart Info */}
      <div className="mt-4 text-sm text-gray-600">
        <p>
          Showing data visualization for <span className="font-medium">{yColumn}</span> by{' '}
          <span className="font-medium">{xColumn}</span> (first 20 rows)
        </p>
      </div>
    </div>
  );
}
