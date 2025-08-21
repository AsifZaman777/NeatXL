'use client';

import React, { useState, useMemo } from 'react';
import { CSVData } from '../../types/types';

interface CohortAnalysisProps {
  data: CSVData;
}

export default function CohortAnalysis({ data }: CohortAnalysisProps) {
  const [customerColumn, setCustomerColumn] = useState<string>('');
  const [dateColumn, setDateColumn] = useState<string>('');

  // Detect potential customer ID columns
  const customerColumns = useMemo(() => {
    return data.headers.filter((header, index) => {
      const column = data.data.map(row => row[index]);
      const uniqueValues = new Set(column).size;
      return uniqueValues > 10 && uniqueValues < column.length * 0.8; // Reasonable customer ID range
    });
  }, [data]);

  // Detect date columns
  const dateColumns = useMemo(() => {
    return data.headers.filter((header, index) => {
      const column = data.data.map(row => row[index]);
      const dateValues = column.filter(val => val && !isNaN(Date.parse(val)));
      return dateValues.length > column.length * 0.5;
    });
  }, [data]);

  const cohortData = useMemo(() => {
    if (!customerColumn || !dateColumn) return null;

    const customerIndex = data.headers.indexOf(customerColumn);
    const dateIndex = data.headers.indexOf(dateColumn);

    // Process customer data
    const customers = new Map();
    
    data.data.forEach(row => {
      const customerId = row[customerIndex];
      const date = new Date(row[dateIndex]);
      
      if (!customerId || isNaN(date.getTime())) return;
      
      if (!customers.has(customerId)) {
        customers.set(customerId, {
          firstSeen: date,
          visits: []
        });
      }
      
      customers.get(customerId).visits.push(date);
    });

    // Create cohorts by month
    const cohorts = new Map();
    
    customers.forEach((customer, customerId) => {
      const cohortMonth = `${customer.firstSeen.getFullYear()}-${String(customer.firstSeen.getMonth() + 1).padStart(2, '0')}`;
      
      if (!cohorts.has(cohortMonth)) {
        cohorts.set(cohortMonth, new Set());
      }
      
      cohorts.get(cohortMonth).add(customerId);
    });

    // Calculate retention for each cohort
    const retentionData = Array.from(cohorts.entries()).map(([cohortMonth, customerSet]) => {
      const cohortCustomers = Array.from(customerSet);
      const retention = [];
      
      for (let period = 0; period < 12; period++) {
        const [year, month] = cohortMonth.split('-').map(Number);
        const targetDate = new Date(year, month - 1 + period, 1);
        const nextMonth = new Date(year, month + period, 1);
        
        const activeCustomers = cohortCustomers.filter(customerId => {
          const customer = customers.get(customerId);
          return customer.visits.some(visit => visit >= targetDate && visit < nextMonth);
        });
        
        retention.push({
          period,
          count: activeCustomers.length,
          rate: activeCustomers.length / cohortCustomers.length
        });
      }
      
      return {
        cohort: cohortMonth,
        size: cohortCustomers.length,
        retention
      };
    }).sort((a, b) => a.cohort.localeCompare(b.cohort));

    return retentionData.slice(0, 12); // Show last 12 cohorts
  }, [data, customerColumn, dateColumn]);

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-purple-50 to-violet-50 rounded-lg border border-purple-200 p-6">
        <h3 className="text-lg font-semibold text-purple-800 mb-4">👥 Cohort Analysis Configuration</h3>
        
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Customer ID Column</label>
            <select
              value={customerColumn}
              onChange={(e) => setCustomerColumn(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              <option value="">Select customer column</option>
              {customerColumns.map(col => (
                <option key={col} value={col}>{col}</option>
              ))}
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Date Column</label>
            <select
              value={dateColumn}
              onChange={(e) => setDateColumn(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              <option value="">Select date column</option>
              {dateColumns.map(col => (
                <option key={col} value={col}>{col}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {cohortData && cohortData.length > 0 && (
        <div className="bg-white rounded-lg border overflow-hidden">
          <div className="px-6 py-4 border-b bg-gray-50">
            <h3 className="text-lg font-semibold text-gray-800">📊 Cohort Retention Analysis</h3>
            <p className="text-sm text-gray-600">Monthly cohort retention rates</p>
          </div>
          
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Cohort</th>
                  <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase">Size</th>
                  {Array.from({ length: 6 }, (_, i) => (
                    <th key={i} className="px-3 py-3 text-center text-xs font-medium text-gray-500 uppercase">
                      Month {i}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {cohortData.map((cohort, index) => (
                  <tr key={index} className="hover:bg-gray-50">
                    <td className="px-4 py-3 text-sm font-medium text-gray-900">{cohort.cohort}</td>
                    <td className="px-4 py-3 text-sm text-center font-semibold">{cohort.size}</td>
                    {cohort.retention.slice(0, 6).map((retention, i) => (
                      <td key={i} className="px-3 py-3 text-center">
                        <div className={`px-2 py-1 rounded text-xs font-medium ${
                          retention.rate >= 0.5 ? 'bg-green-100 text-green-800' :
                          retention.rate >= 0.25 ? 'bg-yellow-100 text-yellow-800' :
                          'bg-red-100 text-red-800'
                        }`}>
                          {(retention.rate * 100).toFixed(0)}%
                        </div>
                        <div className="text-xs text-gray-500 mt-1">{retention.count}</div>
                      </td>
                    ))}
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
