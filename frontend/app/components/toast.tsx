'use client';

import { useEffect, useState } from 'react';
import { CheckCircle, AlertCircle, Info, X } from 'lucide-react';

type ToastType = 'success' | 'error' | 'info' | 'warning';

interface ToastProps {
  id: string;
  message: string;
  type: ToastType;
  onClose: (id: string) => void;
}

const Toast = ({ id, message, type, onClose }: ToastProps) => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
      setTimeout(() => onClose(id), 300); // Allow time for animation
    }, 3000);

    return () => clearTimeout(timer);
  }, [id, onClose]);

  const getTypeConfig = () => {
    switch (type) {
      case 'success':
        return { icon: CheckCircle, bgColor: 'bg-green-500', textColor: 'text-green-500' };
      case 'error':
        return { icon: AlertCircle, bgColor: 'bg-red-500', textColor: 'text-red-500' };
      case 'warning':
        return { icon: AlertCircle, bgColor: 'bg-yellow-500', textColor: 'text-yellow-500' };
      case 'info':
      default:
        return { icon: Info, bgColor: 'bg-blue-500', textColor: 'text-blue-500' };
    }
  };

  const { icon: Icon, bgColor, textColor } = getTypeConfig();

  if (!isVisible) return null;

  return (
    <div className={`animate-fadeInUp fixed right-4 top-4 max-w-xs rounded-lg border-l-4 ${bgColor} bg-white shadow-lg transition-all duration-300 ease-in-out`}>
      <div className="flex items-start p-4">
        <Icon className={`h-5 w-5 ${textColor} flex-shrink-0`} />
        <p className="ml-3 text-sm font-medium text-gray-800">{message}</p>
        <button
          onClick={() => {
            setIsVisible(false);
            setTimeout(() => onClose(id), 300);
          }}
          className="ml-4 rounded-md text-gray-400 hover:text-gray-500 focus:outline-none"
        >
          <X className="h-5 w-5" />
        </button>
      </div>
    </div>
  );
};

export default Toast;