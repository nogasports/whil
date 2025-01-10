import React from 'react';
import { Link, useLocation } from 'react-router-dom';

interface Tab {
  name: string;
  href: string;
}

interface TabNavigationProps {
  tabs: Tab[];
  basePath: string;
}

export default function TabNavigation({ tabs, basePath }: TabNavigationProps) {
  const location = useLocation();
  const currentPath = location.pathname;

  return (
    <div className="border-b border-gray-200">
      <nav className="-mb-px flex space-x-8 px-6" aria-label="Tabs">
        {tabs.map((tab) => {
          const isActive = currentPath === `${basePath}${tab.href}`;
          return (
            <Link
              key={tab.name}
              to={`${basePath}${tab.href}`}
              className={`
                whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm
                ${isActive
                  ? 'border-indigo-500 text-indigo-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }
              `}
            >
              {tab.name}
            </Link>
          );
        })}
      </nav>
    </div>
  );
}