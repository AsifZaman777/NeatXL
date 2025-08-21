'use client';

import React, { useState, useMemo } from 'react';
import { CSVData } from '../../types/types';

interface PredictiveModelingProps {
  data: CSVData;
}

interface LinearRegressionResult {
  slope: number;
  intercept: number;
  rSquared: number;
  predictions: number[];
  residuals: number[];
}

export default function PredictiveModeling({ data }: PredictiveModelingProps) {
  const [selectedXColumn, setSelectedXColumn] = useState<string>('');
  const [selectedYColumn, setSelectedYColumn] = useState<string>('');
  const [forecastPeriods, setForecastPeriods] = useState<number>(10);

  // Detect numeric columns
  const numericColumns = useMemo(() => {
    return data.headers.filter((header, index) => {
      const column = data.data.map(row => row[index]);
      const numericValues = column.filter(val => val && !isNaN(Number(val)));
      return numericValues.length > column.length * 0.7;
    });
  }, [data]);

  // Linear regression calculation
  const regressionResults = useMemo((): LinearRegressionResult | null => {
    if (!selectedXColumn || !selectedYColumn) return null;

    const xIndex = data.headers.indexOf(selectedXColumn);
    const yIndex = data.headers.indexOf(selectedYColumn);

    const validData = data.data
      .map(row => ({
        x: Number(row[xIndex]),
        y: Number(row[yIndex])
      }))
      .filter(point => !isNaN(point.x) && !isNaN(point.y));

    if (validData.length < 3) return null;

    const n = validData.length;
    const sumX = validData.reduce((sum, point) => sum + point.x, 0);
    const sumY = validData.reduce((sum, point) => sum + point.y, 0);
    const sumXY = validData.reduce((sum, point) => sum + point.x * point.y, 0);
    const sumXX = validData.reduce((sum, point) => sum + point.x * point.x, 0);
    const sumYY = validData.reduce((sum, point) => sum + point.y * point.y, 0);

    const slope = (n * sumXY - sumX * sumY) / (n * sumXX - sumX * sumX);
    const intercept = (sumY - slope * sumX) / n;

    // R-squared calculation
    const meanY = sumY / n;
    const totalSumSquares = validData.reduce((sum, point) => sum + Math.pow(point.y - meanY, 2), 0);
    const residualSumSquares = validData.reduce((sum, point) => {
      const predicted = slope * point.x + intercept;
      return sum + Math.pow(point.y - predicted, 2);
    }, 0);
    const rSquared = 1 - (residualSumSquares / totalSumSquares);

    // Generate predictions and residuals
    const predictions = validData.map(point => slope * point.x + intercept);
    const residuals = validData.map((point, i) => point.y - predictions[i]);

    return {
      slope,
      intercept,
      rSquared,
      predictions,
      residuals
    };
  }, [data, selectedXColumn, selectedYColumn]);

  // Time series forecasting
  const timeSeriesForecast = useMemo(() => {
    if (!selectedYColumn) return null;

    const yIndex = data.headers.indexOf(selectedYColumn);
    const values = data.data
      .map(row => Number(row[yIndex]))
      .filter(val => !isNaN(val));

    if (values.length < 5) return null;

    // Simple moving average forecast
    const windowSize = Math.min(5, values.length);
    const recentValues = values.slice(-windowSize);
    const average = recentValues.reduce((sum, val) => sum + val, 0) / windowSize;

    // Calculate trend
    const trend = values.length > 1 ? 
      (values[values.length - 1] - values[0]) / (values.length - 1) : 0;

    // Generate forecast
    const forecast = Array.from({ length: forecastPeriods }, (_, i) => 
      average + trend * (i + 1)
    );

    return {
      historical: values,
      forecast,
      trend,
      average
    };
  }, [data, selectedYColumn, forecastPeriods]);

  return (
    <div className="space-y-6">
      {/* Model Configuration */}
      <div className="bg-gradient-to-r from-teal-50 to-cyan-50 rounded-lg border border-teal-200 p-6">
        <h3 className="text-lg font-semibold text-teal-800 mb-4">🔮 Predictive Model Configuration</h3>
        
        <div className="grid md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Independent Variable (X)</label>
            <select
              value={selectedXColumn}
              onChange={(e) => setSelectedXColumn(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
            >
              <option value="">Select X variable</option>
              {numericColumns.map(col => (
                <option key={col} value={col}>{col}</option>
              ))}
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Dependent Variable (Y)</label>
            <select
              value={selectedYColumn}
              onChange={(e) => setSelectedYColumn(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
            >
              <option value="">Select Y variable</option>
              {numericColumns.map(col => (
                <option key={col} value={col}>{col}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Forecast Periods</label>
            <input
              type="number"
              value={forecastPeriods}
              onChange={(e) => setForecastPeriods(Number(e.target.value))}
              min="1"
              max="50"
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
            />
          </div>
        </div>
      </div>

      {/* Linear Regression Results */}
      {regressionResults && (
        <div className="bg-white rounded-lg border p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">📈 Linear Regression Analysis</h3>
          
          <div className="grid md:grid-cols-3 gap-6 mb-6">
            <div className="bg-blue-50 p-4 rounded-lg">
              <div className="text-sm text-blue-600 mb-1">Slope (β₁)</div>
              <div className="text-2xl font-bold text-blue-800">{regressionResults.slope.toFixed(4)}</div>
              <div className="text-xs text-blue-600">Change in Y per unit X</div>
            </div>
            
            <div className="bg-green-50 p-4 rounded-lg">
              <div className="text-sm text-green-600 mb-1">Intercept (β₀)</div>
              <div className="text-2xl font-bold text-green-800">{regressionResults.intercept.toFixed(4)}</div>
              <div className="text-xs text-green-600">Y-value when X = 0</div>
            </div>
            
            <div className="bg-purple-50 p-4 rounded-lg">
              <div className="text-sm text-purple-600 mb-1">R-Squared</div>
              <div className="text-2xl font-bold text-purple-800">{(regressionResults.rSquared * 100).toFixed(1)}%</div>
              <div className="text-xs text-purple-600">Variance explained</div>
            </div>
          </div>

          {/* Regression Equation */}
          <div className="bg-gray-50 p-4 rounded-lg mb-4">
            <div className="text-sm text-gray-600 mb-2">Regression Equation:</div>
            <div className="text-lg font-mono text-gray-800">
              {selectedYColumn} = {regressionResults.intercept.toFixed(4)} + {regressionResults.slope.toFixed(4)} × {selectedXColumn}
            </div>
          </div>

          {/* Model Quality Assessment */}
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <h4 className="font-semibold text-gray-700 mb-2">Model Quality</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Fit Quality:</span>
                  <span className={`font-semibold ${
                    regressionResults.rSquared > 0.8 ? 'text-green-600' :
                    regressionResults.rSquared > 0.6 ? 'text-yellow-600' : 'text-red-600'
                  }`}>
                    {regressionResults.rSquared > 0.8 ? 'Excellent' :
                     regressionResults.rSquared > 0.6 ? 'Good' : 'Poor'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Data Points:</span>
                  <span className="font-semibold">{regressionResults.predictions.length}</span>
                </div>
                <div className="flex justify-between">
                  <span>RMSE:</span>
                  <span className="font-semibold">
                    {Math.sqrt(regressionResults.residuals.reduce((sum, r) => sum + r * r, 0) / regressionResults.residuals.length).toFixed(4)}
                  </span>
                </div>
              </div>
            </div>
            
            <div>
              <h4 className="font-semibold text-gray-700 mb-2">Prediction Intervals</h4>
              <div className="text-sm text-gray-600">
                <p>Use this model to predict {selectedYColumn} values for new {selectedXColumn} inputs.</p>
                <p className="mt-2">
                  <strong>Note:</strong> Predictions are most reliable within the range of your training data.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Time Series Forecast */}
      {timeSeriesForecast && (
        <div className="bg-white rounded-lg border p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">🔮 Time Series Forecast</h3>
          
          <div className="grid md:grid-cols-3 gap-6 mb-6">
            <div className="bg-indigo-50 p-4 rounded-lg">
              <div className="text-sm text-indigo-600 mb-1">Current Average</div>
              <div className="text-2xl font-bold text-indigo-800">{timeSeriesForecast.average.toFixed(2)}</div>
              <div className="text-xs text-indigo-600">Recent 5-period average</div>
            </div>
            
            <div className="bg-orange-50 p-4 rounded-lg">
              <div className="text-sm text-orange-600 mb-1">Trend</div>
              <div className={`text-2xl font-bold ${timeSeriesForecast.trend > 0 ? 'text-green-600' : 'text-red-600'}`}>
                {timeSeriesForecast.trend > 0 ? '↗' : '↘'} {Math.abs(timeSeriesForecast.trend).toFixed(4)}
              </div>
              <div className="text-xs text-orange-600">Per period change</div>
            </div>
            
            <div className="bg-pink-50 p-4 rounded-lg">
              <div className="text-sm text-pink-600 mb-1">Forecast Range</div>
              <div className="text-lg font-bold text-pink-800">
                {Math.min(...timeSeriesForecast.forecast).toFixed(1)} - {Math.max(...timeSeriesForecast.forecast).toFixed(1)}
              </div>
              <div className="text-xs text-pink-600">Next {forecastPeriods} periods</div>
            </div>
          </div>

          {/* Forecast Table */}
          <div className="overflow-x-auto">
            <table className="min-w-full border border-gray-200 rounded-lg">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Period</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Forecast</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Confidence</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {timeSeriesForecast.forecast.slice(0, 10).map((value, index) => (
                  <tr key={index} className="hover:bg-gray-50">
                    <td className="px-4 py-2 text-sm text-gray-900">Period {index + 1}</td>
                    <td className="px-4 py-2 text-sm font-semibold text-gray-900">{value.toFixed(2)}</td>
                    <td className="px-4 py-2 text-sm text-gray-600">
                      {index < 3 ? 'High' : index < 7 ? 'Medium' : 'Low'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Export Options */}
      <div className="flex gap-2 pt-4 border-t border-gray-200">
        <button className="px-4 py-2 bg-teal-500 text-white rounded-lg text-sm font-medium hover:bg-teal-600 transition-colors">
          📊 Export Model
        </button>
        <button className="px-4 py-2 bg-blue-500 text-white rounded-lg text-sm font-medium hover:bg-blue-600 transition-colors">
          📈 Download Predictions
        </button>
        <button className="px-4 py-2 bg-purple-500 text-white rounded-lg text-sm font-medium hover:bg-purple-600 transition-colors">
          🔮 Save Forecast
        </button>
      </div>
    </div>
  );
}
