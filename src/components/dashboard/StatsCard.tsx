import React from 'react';
import { ArrowUpRight, ArrowDownRight } from 'lucide-react';

interface StatsCardProps {
  title: string;
  value: string;
  change: {
    value: number;
    trend: 'up' | 'down';
    text: string;
  };
}

export default function StatsCard({ title, value, change }: StatsCardProps) {
  return (
    <div className="bg-white rounded-lg p-6 shadow-sm">
      <h3 className="text-sm font-medium text-gray-500 mb-4">{title}</h3>
      <div className="flex items-baseline">
        <p className="text-3xl font-semibold text-gray-900">{value}</p>
        <span className={`ml-4 flex items-center text-sm ${
          change.trend === 'up' ? 'text-green-600' : 'text-red-600'
        }`}>
          {change.trend === 'up' ? (
            <ArrowUpRight className="h-4 w-4 mr-1" />
          ) : (
            <ArrowDownRight className="h-4 w-4 mr-1" />
          )}
          {change.value}% {change.text}
        </span>
      </div>
    </div>
  );
}