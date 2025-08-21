'use client';

import React, { useState, useMemo } from 'react';
import { useData } from '../../contexts/DataContext';
import { useRouter } from 'next/navigation';

// Analytics components
import StatisticalDashboard from '../../components/analytics/StatisticalDashboard';
import TimeSeriesAnalysis from '../../components/analytics/TimeSeriesAnalysis';
import CohortAnalysis from '../../components/analytics/CohortAnalysis';
import RFMAnalysis from '../../components/analytics/RFMAnalysis';
import ABTestAnalysis from '../../components/analytics/ABTestAnalysis';
import PivotTableGenerator from '../../components/analytics/PivotTableGenerator';
import PredictiveModeling from '../../components/analytics/PredictiveModeling';
import SentimentAnalysis from '../../components/analytics/SentimentAnalysis';
import AnomalyDetection from '../../components/analytics/AnomalyDetection';

const analyticsModules = [
  {
    id: 'statistical',
    name: 'Statistical Dashboard',
    icon: '📊',
    description: 'Correlation matrix, distribution plots, hypothesis testing',
    color: 'blue',
    category: 'core'
  },
  {
    id: 'timeseries',
    name: 'Time Series Analysis',
    icon: '📈',
    description: 'Trend detection, seasonality, forecasting',
    color: 'green',
    category: 'core'
  },
  {
    id: 'cohort',
    name: 'Cohort Analysis',
    icon: '👥',
    description: 'Customer retention, user behavior patterns',
    color: 'purple',
    category: 'business'
  },
  {
    id: 'rfm',
    name: 'RFM Analysis',
    icon: '🎯',
    description: 'Customer segmentation for marketing',
    color: 'red',
    category: 'business'
  },
  {
    id: 'abtest',
    name: 'A/B Test Analysis',
    icon: '⚖️',
    description: 'Statistical significance, confidence intervals',
    color: 'yellow',
    category: 'experimental'
  },
  {
    id: 'pivot',
    name: 'Smart Pivot Tables',
    icon: '🔄',
    description: 'AI-suggested meaningful pivots',
    color: 'indigo',
    category: 'core'
  },
  {
    id: 'predictive',
    name: 'Predictive Modeling',
    icon: '🔮',
    description: 'Linear regression, trend forecasting, ML insights',
    color: 'teal',
    category: 'advanced'
  },
  {
    id: 'sentiment',
    name: 'Sentiment Analysis',
    icon: '😊',
    description: 'Text sentiment scoring, emotion detection',
    color: 'pink',
    category: 'nlp'
  },
  {
    id: 'anomaly',
    name: 'Anomaly Detection',
    icon: '🚨',
    description: 'Outlier detection, data quality assessment',
    color: 'orange',
    category: 'quality'
  }
];

const categories: { [key: string]: { name: string; color: string } } = {
  core: { name: 'Core Analytics', color: 'blue' },
  business: { name: 'Business Intelligence', color: 'green' },
  advanced: { name: 'Advanced ML', color: 'purple' },
  experimental: { name: 'Experimental Design', color: 'yellow' },
  nlp: { name: 'Natural Language', color: 'pink' },
  quality: { name: 'Data Quality', color: 'orange' }
};

export default function AnalyticsPage() {
  const { csvData, reorderedData, savedData } = useData();
  const data = savedData || reorderedData || csvData;
  const router = useRouter();
  const [activeModule, setActiveModule] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  // Basic data validation and stats
  const dataStats = useMemo(() => {
    if (!data) return null;
    
    const numericColumns = data.headers.filter((header, index) => {
      const column = data.data.map(row => row[index]);
      const numericValues = column.filter(val => val && !isNaN(Number(val)));
      return numericValues.length > column.length * 0.7; // 70% numeric threshold
    });
    
    const dateColumns = data.headers.filter((header, index) => {
      const column = data.data.map(row => row[index]);
      const dateValues = column.filter(val => val && !isNaN(Date.parse(val)));
      return dateValues.length > column.length * 0.7; // 70% date threshold
    });
    
    const textColumns = data.headers.filter((header, index) => {
      const column = data.data.map(row => row[index]);
      const textValues = column.filter(val => val && typeof val === 'string' && val.length > 5);
      return textValues.length > column.length * 0.5; // 50% text threshold
    });
    
    return {
      totalRows: data.data.length,
      totalColumns: data.headers.length,
      numericColumns: numericColumns.length,
      dateColumns: dateColumns.length,
      textColumns: textColumns.length,
      sampleSize: Math.min(1000, data.data.length),
      dataQuality: data.data.length > 0 ? 'Good' : 'No Data'
    };
  }, [data]);

  const renderActiveModule = () => {
    switch (activeModule) {
      case 'statistical':
        return <StatisticalDashboard data={data} />;
      case 'timeseries':
        return <TimeSeriesAnalysis data={data} />;
      case 'cohort':
        return <CohortAnalysis data={data} />;
      case 'rfm':
        return <RFMAnalysis data={data} />;
      case 'abtest':
        return <ABTestAnalysis data={data} />;
      case 'pivot':
        return <PivotTableGenerator data={data} />;
      case 'predictive':
        return <PredictiveModeling data={data} />;
      case 'sentiment':
        return <SentimentAnalysis data={data} />;
      case 'anomaly':
        return <AnomalyDetection data={data} />;
      default:
        return null;
    }
  };

  const filteredModules = selectedCategory === 'all' 
    ? analyticsModules 
    : analyticsModules.filter(module => module.category === selectedCategory);

  if (!data) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-red-50 to-pink-50 p-4">
        <div className="max-w-4xl mx-auto text-center">
          <div className="bg-white rounded-xl p-8 shadow-lg border">
            <h1 className="text-3xl font-bold text-gray-800 mb-4">🧠 Advanced Analytics</h1>
            <p className="text-gray-600 mb-6">Upload data to unlock powerful analytics capabilities</p>
            <button
              onClick={() => router.push('/')}
              className="px-6 py-3 bg-orange-500 text-white rounded-lg font-semibold hover:bg-orange-600 transition-colors"
            >
              Upload Data First
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-red-50 to-pink-50 p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-gradient-to-r from-orange-600 to-red-600 text-white rounded-t-xl p-6 shadow-lg">
          <h1 className="text-3xl font-bold mb-2">🧠 Advanced Analytics</h1>
          <p className="text-orange-100 text-sm">Powerful statistical analysis and AI-driven insights beyond basic spreadsheets</p>
        </div>

        {/* Data Overview */}
        <div className="bg-white border-x border-b rounded-b-xl p-4 shadow">
          <div className="flex flex-wrap items-center gap-3 text-xs">
            <span className="px-3 py-1 bg-orange-100 text-orange-700 rounded-full font-medium">
              {dataStats?.totalRows.toLocaleString()} rows
            </span>
            <span className="px-3 py-1 bg-orange-100 text-orange-700 rounded-full font-medium">
              {dataStats?.totalColumns} columns
            </span>
            <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full font-medium">
              {dataStats?.numericColumns} numeric
            </span>
            <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full font-medium">
              {dataStats?.dateColumns} date/time
            </span>
            <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full font-medium">
              {dataStats?.textColumns} text
            </span>
            <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full font-medium">
              Quality: {dataStats?.dataQuality}
            </span>
          </div>
        </div>

        {/* Category Filter */}
        {!activeModule && (
          <div className="mt-6 bg-white rounded-xl p-4 shadow border">
            <h3 className="text-lg font-semibold text-gray-800 mb-3">📂 Analytics Categories</h3>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setSelectedCategory('all')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  selectedCategory === 'all'
                    ? 'bg-orange-500 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                All Modules ({analyticsModules.length})
              </button>
              {Object.entries(categories).map(([key, category]) => (
                <button
                  key={key}
                  onClick={() => setSelectedCategory(key)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    selectedCategory === key
                      ? 'bg-orange-500 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {category.name} ({analyticsModules.filter(m => m.category === key).length})
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Analytics Modules Grid */}
        {!activeModule && (
          <div className="mt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredModules.map((module) => {
              const colorClasses: { [key: string]: string } = {
                blue: 'from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 border-blue-300',
                green: 'from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 border-green-300',
                purple: 'from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 border-purple-300',
                red: 'from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 border-red-300',
                yellow: 'from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700 border-yellow-300',
                indigo: 'from-indigo-500 to-indigo-600 hover:from-indigo-600 hover:to-indigo-700 border-indigo-300',
                teal: 'from-teal-500 to-teal-600 hover:from-teal-600 hover:to-teal-700 border-teal-300',
                pink: 'from-pink-500 to-pink-600 hover:from-pink-600 hover:to-pink-700 border-pink-300',
                orange: 'from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 border-orange-300'
              };

              return (
                <button
                  key={module.id}
                  onClick={() => setActiveModule(module.id)}
                  className={`group relative bg-white rounded-xl p-6 shadow-lg border-2 transition-all duration-300 transform hover:scale-105 hover:shadow-xl text-left ${colorClasses[module.color]}`}
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="text-4xl">{module.icon}</div>
                    <div className="flex flex-col items-end">
                      <div className="w-3 h-3 rounded-full bg-gray-300 group-hover:bg-white transition-colors mb-1"></div>
                      <span className="text-xs text-gray-500 group-hover:text-white transition-colors">
                        {categories[module.category].name}
                      </span>
                    </div>
                  </div>
                  <h3 className="text-lg font-bold text-gray-800 mb-2 group-hover:text-white transition-colors">
                    {module.name}
                  </h3>
                  <p className="text-sm text-gray-600 group-hover:text-gray-100 transition-colors leading-relaxed">
                    {module.description}
                  </p>
                  <div className="absolute inset-0 bg-gradient-to-r opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl"></div>
                </button>
              );
            })}
          </div>
        )}

        {/* Active Module Content */}
        {activeModule && (
          <div className="mt-6">
            <div className="bg-white rounded-xl shadow-lg p-6 border">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{analyticsModules.find(m => m.id === activeModule)?.icon}</span>
                  <h2 className="text-xl font-bold text-gray-800">
                    {analyticsModules.find(m => m.id === activeModule)?.name}
                  </h2>
                  <span className="px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-xs font-medium">
                    {categories[analyticsModules.find(m => m.id === activeModule)?.category || 'core'].name}
                  </span>
                </div>
                <button
                  onClick={() => setActiveModule(null)}
                  className="px-4 py-2 rounded-lg text-sm font-semibold bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors"
                >
                  ← Back to Modules
                </button>
              </div>
              {renderActiveModule()}
            </div>
          </div>
        )}

        {/* Quick Tips */}
        {!activeModule && (
          <div className="mt-8 bg-gradient-to-r from-orange-100 to-red-100 rounded-xl p-6 border border-orange-200">
            <h3 className="text-lg font-semibold text-orange-800 mb-3">💡 Analytics Tips</h3>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 text-sm text-orange-700">
              <div>
                <strong>Best Results:</strong> Ensure your data has clear column headers and consistent formatting
              </div>
              <div>
                <strong>Performance:</strong> Large datasets (&gt;100k rows) may take longer to process
              </div>
              <div>
                <strong>Data Types:</strong> Some analyses require specific data types (dates, numbers, categories)
              </div>
              <div>
                <strong>Export:</strong> All analysis results can be exported as images or data files
              </div>
              <div>
                <strong>New Features:</strong> Try our AI-powered predictive modeling and sentiment analysis
              </div>
              <div>
                <strong>Quality Check:</strong> Use anomaly detection to identify data quality issues
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
