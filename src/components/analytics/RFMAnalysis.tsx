'use client';

import React, { useState, useMemo } from 'react';
import { CSVData } from '../../types/types';

interface RFMAnalysisProps {
  data: CSVData;
}

export default function RFMAnalysis({ data }: RFMAnalysisProps) {
  const [customerColumn, setCustomerColumn] = useState<string>('');
  const [dateColumn, setDateColumn] = useState<string>('');
  const [amountColumn, setAmountColumn] = useState<string>('');

  // Detect columns
  const customerColumns = useMemo(() => {
    return data.headers.filter((header, index) => {
      const column = data.data.map(row => row[index]);
      const uniqueValues = new Set(column).size;
      return uniqueValues > 10 && uniqueValues < column.length * 0.8;
    });
  }, [data]);

  const dateColumns = useMemo(() => {
    return data.headers.filter((header, index) => {
      const column = data.data.map(row => row[index]);
      const dateValues = column.filter(val => val && !isNaN(Date.parse(val)));
      return dateValues.length > column.length * 0.5;
    });
  }, [data]);

  const numericColumns = useMemo(() => {
    return data.headers.filter((header, index) => {
      const column = data.data.map(row => row[index]);
      const numericValues = column.filter(val => val && !isNaN(Number(val)));
      return numericValues.length > column.length * 0.7;
    });
  }, [data]);

  const rfmData = useMemo(() => {
    if (!customerColumn || !dateColumn || !amountColumn) return null;

    const customerIndex = data.headers.indexOf(customerColumn);
    const dateIndex = data.headers.indexOf(dateColumn);
    const amountIndex = data.headers.indexOf(amountColumn);

    // Calculate RFM for each customer
    const customers = new Map();
    const now = new Date();

    data.data.forEach(row => {
      const customerId = row[customerIndex];
      const date = new Date(row[dateIndex]);
      const amount = Number(row[amountIndex]);

      if (!customerId || isNaN(date.getTime()) || isNaN(amount)) return;

      if (!customers.has(customerId)) {
        customers.set(customerId, {
          transactions: [],
          totalAmount: 0,
          lastTransaction: date
        });
      }

      const customer = customers.get(customerId);
      customer.transactions.push({ date, amount });
      customer.totalAmount += amount;
      
      if (date > customer.lastTransaction) {
        customer.lastTransaction = date;
      }
    });

    // Calculate RFM scores
    const rfmScores = Array.from(customers.entries()).map(([customerId, customer]) => {
      const recency = Math.floor((now.getTime() - customer.lastTransaction.getTime()) / (1000 * 60 * 60 * 24));
      const frequency = customer.transactions.length;
      const monetary = customer.totalAmount;

      return {
        customerId,
        recency,
        frequency,
        monetary,
        recencyScore: 0,
        frequencyScore: 0,
        monetaryScore: 0,
        segment: ''
      };
    });

    // Calculate quintiles and assign scores
    const sortedByRecency = [...rfmScores].sort((a, b) => a.recency - b.recency);
    const sortedByFrequency = [...rfmScores].sort((a, b) => b.frequency - a.frequency);
    const sortedByMonetary = [...rfmScores].sort((a, b) => b.monetary - a.monetary);

    const quintileSize = Math.ceil(rfmScores.length / 5);

    rfmScores.forEach((customer, index) => {
      // Recency score (1 = most recent, 5 = least recent)
      const recencyRank = sortedByRecency.findIndex(c => c.customerId === customer.customerId);
      customer.recencyScore = Math.min(5, Math.floor(recencyRank / quintileSize) + 1);

      // Frequency score (5 = highest frequency, 1 = lowest)
      const frequencyRank = sortedByFrequency.findIndex(c => c.customerId === customer.customerId);
      customer.frequencyScore = 6 - Math.min(5, Math.floor(frequencyRank / quintileSize) + 1);

      // Monetary score (5 = highest monetary, 1 = lowest)
      const monetaryRank = sortedByMonetary.findIndex(c => c.customerId === customer.customerId);
      customer.monetaryScore = 6 - Math.min(5, Math.floor(monetaryRank / quintileSize) + 1);

      // Assign segment
      const rfmString = `${customer.recencyScore}${customer.frequencyScore}${customer.monetaryScore}`;
      customer.segment = getSegment(customer.recencyScore, customer.frequencyScore, customer.monetaryScore);
    });

    return rfmScores;
  }, [data, customerColumn, dateColumn, amountColumn]);

  const getSegment = (r: number, f: number, m: number): string => {
    if (r >= 4 && f >= 4 && m >= 4) return 'Champions';
    if (r >= 3 && f >= 3 && m >= 3) return 'Loyal Customers';
    if (r >= 4 && f <= 2) return 'New Customers';
    if (r >= 3 && f >= 3 && m <= 2) return 'Potential Loyalists';
    if (r <= 2 && f >= 3) return 'At Risk';
    if (r <= 2 && f <= 2 && m >= 3) return 'Cannot Lose Them';
    if (r <= 2 && f <= 2 && m <= 2) return 'Lost';
    return 'Others';
  };

  const segmentSummary = useMemo(() => {
    if (!rfmData) return null;

    const segments = rfmData.reduce((acc, customer) => {
      if (!acc[customer.segment]) {
        acc[customer.segment] = { count: 0, totalValue: 0 };
      }
      acc[customer.segment].count++;
      acc[customer.segment].totalValue += customer.monetary;
      return acc;
    }, {} as Record<string, { count: number; totalValue: number }>);

    return Object.entries(segments).map(([segment, data]) => ({
      segment,
      count: data.count,
      percentage: (data.count / rfmData.length) * 100,
      avgValue: data.totalValue / data.count
    })).sort((a, b) => b.count - a.count);
  }, [rfmData]);

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-red-50 to-pink-50 rounded-lg border border-red-200 p-6">
        <h3 className="text-lg font-semibold text-red-800 mb-4">🎯 RFM Analysis Configuration</h3>
        
        <div className="grid md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Customer ID</label>
            <select
              value={customerColumn}
              onChange={(e) => setCustomerColumn(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
            >
              <option value="">Select customer column</option>
              {customerColumns.map(col => (
                <option key={col} value={col}>{col}</option>
              ))}
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Transaction Date</label>
            <select
              value={dateColumn}
              onChange={(e) => setDateColumn(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
            >
              <option value="">Select date column</option>
              {dateColumns.map(col => (
                <option key={col} value={col}>{col}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Transaction Amount</label>
            <select
              value={amountColumn}
              onChange={(e) => setAmountColumn(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
            >
              <option value="">Select amount column</option>
              {numericColumns.map(col => (
                <option key={col} value={col}>{col}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {segmentSummary && (
        <div className="bg-white rounded-lg border p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">📊 Customer Segments</h3>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            {segmentSummary.slice(0, 4).map((segment, index) => (
              <div key={index} className="bg-gray-50 p-4 rounded-lg">
                <div className="text-sm text-gray-600 mb-1">{segment.segment}</div>
                <div className="text-2xl font-bold text-gray-800">{segment.count}</div>
                <div className="text-xs text-gray-500">{segment.percentage.toFixed(1)}% of customers</div>
                <div className="text-xs text-gray-500">Avg: ${segment.avgValue.toFixed(0)}</div>
              </div>
            ))}
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full border border-gray-200 rounded-lg">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Segment</th>
                  <th className="px-4 py-2 text-center text-xs font-medium text-gray-500 uppercase">Customers</th>
                  <th className="px-4 py-2 text-center text-xs font-medium text-gray-500 uppercase">Percentage</th>
                  <th className="px-4 py-2 text-center text-xs font-medium text-gray-500 uppercase">Avg Value</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {segmentSummary.map((segment, index) => (
                  <tr key={index} className="hover:bg-gray-50">
                    <td className="px-4 py-2 text-sm font-medium text-gray-900">{segment.segment}</td>
                    <td className="px-4 py-2 text-sm text-center">{segment.count}</td>
                    <td className="px-4 py-2 text-sm text-center">{segment.percentage.toFixed(1)}%</td>
                    <td className="px-4 py-2 text-sm text-center">${segment.avgValue.toFixed(0)}</td>
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
