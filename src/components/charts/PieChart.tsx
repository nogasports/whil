import React from 'react';

interface PieChartProps {
  data: {
    label: string;
    value: number;
    color: string;
  }[];
  title: string;
}

export const PieChart: React.FC<PieChartProps> = ({ data, title }) => {
  const total = data.reduce((sum, item) => sum + item.value, 0);
  let currentAngle = 0;

  return (
    <div className="flex flex-col items-center">
      <h3 className="text-xl font-bold mb-4 text-white">{title}</h3>
      <div className="relative w-64 h-64">
        <svg viewBox="0 0 100 100" className="transform -rotate-90">
          {data.map((item, index) => {
            const percentage = (item.value / total) * 100;
            const angle = (percentage / 100) * 360;
            const largeArcFlag = angle > 180 ? 1 : 0;
            
            // Calculate path coordinates
            const x1 = 50 + 50 * Math.cos((currentAngle * Math.PI) / 180);
            const y1 = 50 + 50 * Math.sin((currentAngle * Math.PI) / 180);
            const x2 = 50 + 50 * Math.cos(((currentAngle + angle) * Math.PI) / 180);
            const y2 = 50 + 50 * Math.sin(((currentAngle + angle) * Math.PI) / 180);

            const path = `
              M 50 50
              L ${x1} ${y1}
              A 50 50 0 ${largeArcFlag} 1 ${x2} ${y2}
              Z
            `;

            const slice = (
              <path
                key={index}
                d={path}
                fill={item.color}
                className="transition-all duration-300 hover:opacity-80"
              />
            );

            currentAngle += angle;
            return slice;
          })}
        </svg>
      </div>
      <div className="flex flex-wrap justify-center gap-4 mt-4">
        {data.map((item, index) => (
          <div key={index} className="flex items-center">
            <div 
              className="w-4 h-4 rounded-full mr-2" 
              style={{ backgroundColor: item.color }}
            />
            <span className="text-white">
              {item.label} ({item.value}%)
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};
