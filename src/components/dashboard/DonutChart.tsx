import React from 'react';

interface ChartData {
  label: string;
  value: number;
  color: string;
}

interface DonutChartProps {
  data: ChartData[];
  total: number;
  title: string;
}

export default function DonutChart({ data, total, title }: DonutChartProps) {
  return (
    <div className="bg-white rounded-lg p-6 shadow-sm">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-medium text-gray-900">{title}</h3>
        <select className="text-sm border-gray-300 rounded-md">
          <option>All Time</option>
          <option>Last Month</option>
          <option>Last Week</option>
        </select>
      </div>
      
      <div className="flex items-center justify-center relative mb-6">
        <div className="w-32 h-32 rounded-full border-8 border-gray-100 flex items-center justify-center">
          <span className="text-2xl font-semibold">{total}</span>
        </div>
      </div>

      <div className="space-y-4">
        {data.map((item) => (
          <div key={item.label} className="flex items-center justify-between">
            <div className="flex items-center">
              <div
                className="w-3 h-3 rounded-full mr-2"
                style={{ backgroundColor: item.color }}
              />
              <span className="text-sm text-gray-600">{item.label}</span>
            </div>
            <span className="text-sm font-medium">{item.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
}