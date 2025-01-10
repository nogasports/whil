import React from 'react';
import { X } from 'lucide-react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}

export default function Modal({ isOpen, onClose, title, children }: ModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex min-h-full items-center justify-center p-4 text-center sm:p-0">
        <div className="fixed inset-0 bg-primary-DEFAULT bg-opacity-75 transition-opacity" onClick={onClose} />
        
        <div className="relative transform overflow-hidden bg-white px-4 pb-4 pt-5 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg sm:p-6 border-none">
          <div className="absolute right-0 top-0 pr-4 pt-4">
            <button
              type="button"
              className="bg-white text-primary-DEFAULT hover:text-primary-dark"
              onClick={onClose}
            >
              <X className="h-6 w-6" />
            </button>
          </div>

          <div className="sm:flex sm:items-start">
            <div className="mt-3 text-center sm:mt-0 sm:text-left w-full">
              <h3 className="text-lg font-semibold leading-6 text-primary-DEFAULT mb-4">
                {title}
              </h3>
              {children}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}