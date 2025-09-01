import React, { useState } from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from "recharts";

export default function App() {
  const [rawData, setRawData] = useState("");
  const [summary, setSummary] = useState([]);
  const [chartData, setChartData] = useState([]);

  const parseData = () => {
    const lines = rawData.split("\n").map(line => line.trim()).filter(line => line.length > 0);

    const allocationSummary = {};

    lines.forEach(line => {
      const parts = line.split(/[\s-]+/); // split by spaces, tabs, or hyphens
      let allocation = parts[1] || ""; // take second column
      allocation = allocation.replace(/[^0-9]/g, ""); // extract only digits (e.g., "20GB" -> "20")

      if (allocation) {
        allocation = allocation + " GB"; // normalize format
      } else {
        allocation = "Unknown"; // for missing values
      }

      allocationSummary[allocation] = (allocationSummary[allocation] || 0) + 1;
    });

    const summaryArray = Object.entries(allocationSummary).map(([key, value]) => ({
      allocation: key,
      count: value,
    }));

    setSummary(summaryArray);
    setChartData(summaryArray);
  };

  const totalEntries = summary.reduce((total, row) => total + row.count, 0);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">
            Data Allocation Categorizer
          </h1>
          <p className="text-gray-600 text-lg">
            Parse and visualize your data allocations with ease
          </p>
        </div>

        {/* Input Section */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8 border border-gray-100">
          <div className="mb-4">
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Data Input
            </label>
            <textarea
              className="w-full h-48 p-4 border border-gray-300 rounded-lg resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 font-mono text-sm bg-gray-50 hover:bg-white"
              placeholder="Paste your data here...&#10;Example:&#10;02444XXXX 20GB&#10;059XXXXXX 50GB&#10;024961XXXX 10GB"
              value={rawData}
              onChange={(e) => setRawData(e.target.value)}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-500">
              {rawData.split('\n').filter(line => line.trim().length > 0).length} lines detected
            </div>
            <button
              onClick={parseData}
              disabled={!rawData.trim()}
              className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-6 py-3 rounded-lg font-semibold hover:from-blue-700 hover:to-blue-800 transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105"
            >
              Process Data
            </button>
          </div>
        </div>

        {/* Results Section */}
        {summary.length > 0 && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Summary Table */}
            <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-2xl font-semibold text-gray-800">Summary</h2>
                <div className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
                  {totalEntries} total entries
                </div>
              </div>
              
              <div className="overflow-hidden rounded-lg border border-gray-200">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                        Data Allocation
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                        Count
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                        Percentage
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {summary.map((row, idx) => (
                      <tr key={idx} className="hover:bg-gray-50 transition-colors duration-150">
                        <td className="px-4 py-3 text-sm font-medium text-gray-900">
                          <div className="flex items-center">
                            <div className="w-3 h-3 rounded-full bg-blue-500 mr-3"></div>
                            {row.allocation}
                          </div>
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-700">
                          <span className="bg-gray-100 px-2 py-1 rounded-full font-medium">
                            {row.count}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-700">
                          <div className="flex items-center">
                            <div className="w-full bg-gray-200 rounded-full h-2 mr-2">
                              <div
                                className="bg-blue-500 h-2 rounded-full transition-all duration-500"
                                style={{ width: `${(row.count / totalEntries * 100)}%` }}
                              ></div>
                            </div>
                            <span className="text-xs font-medium min-w-0">
                              {((row.count / totalEntries) * 100).toFixed(1)}%
                            </span>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Chart Section */}
            <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">Visualization</h2>
              <div className="bg-gray-50 rounded-lg p-4">
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={chartData}>
                    <XAxis 
                      dataKey="allocation" 
                      tick={{ fontSize: 12 }}
                      axisLine={{ stroke: '#e5e7eb' }}
                      tickLine={{ stroke: '#e5e7eb' }}
                    />
                    <YAxis 
                      tick={{ fontSize: 12 }}
                      axisLine={{ stroke: '#e5e7eb' }}
                      tickLine={{ stroke: '#e5e7eb' }}
                    />
                    <Tooltip 
                      contentStyle={{
                        backgroundColor: '#1f2937',
                        border: 'none',
                        borderRadius: '8px',
                        color: 'white',
                        fontSize: '14px'
                      }}
                    />
                    <Legend />
                    <Bar 
                      dataKey="count" 
                      fill="url(#gradient)" 
                      radius={[4, 4, 0, 0]}
                    />
                    <defs>
                      <linearGradient id="gradient" x1="0%" y1="0%" x2="0%" y2="100%">
                        <stop offset="0%" stopColor="#3b82f6" />
                        <stop offset="100%" stopColor="#1d4ed8" />
                      </linearGradient>
                    </defs>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        )}

        {/* Empty State */}
        {summary.length === 0 && rawData.trim() === "" && (
          <div className="bg-white rounded-xl shadow-lg p-12 text-center border border-gray-100">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">Ready to Process Data</h3>
            <p className="text-gray-600 max-w-md mx-auto">
              Paste your data in the input field above and click "Process Data" to see allocation summaries and visualizations.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}