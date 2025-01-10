import React, { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';

interface AccordionProps {
  children: React.ReactNode;
}

interface AccordionItemProps {
  title: string;
  children: React.ReactNode;
  icon?: React.FC<{ className?: string }>;
}

export const Accordion: React.FC<AccordionProps> = ({ children }) => {
  return <div className="space-y-4">{children}</div>;
};

export const AccordionItem: React.FC<AccordionItemProps> = ({ title, children, icon: Icon }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="border border-gray-200 rounded-lg">
      <button
        className="w-full px-6 py-4 flex items-center justify-between text-left bg-white hover:bg-gray-50 transition-colors"
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className="flex items-center">
          {Icon && <Icon className="h-5 w-5 text-[#06205c] mr-3" />}
          <span className="text-lg font-semibold text-[#06205c]">{title}</span>
        </div>
        {isOpen ? (
          <ChevronUp className="h-5 w-5 text-[#06205c]" />
        ) : (
          <ChevronDown className="h-5 w-5 text-[#06205c]" />
        )}
      </button>
      {isOpen && (
        <div className="px-6 py-4 bg-white">
          {children}
        </div>
      )}
    </div>
  );
};