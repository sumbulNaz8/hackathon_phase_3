'use client';

import { useEffect, useState } from 'react';

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
      setTimeout(() => onClose(id), 300);
    }, 3000);

    return () => clearTimeout(timer);
  }, [id, onClose]);

  if (!isVisible) return null;

  return (
    <div>
      <div>
        <span>{type}:</span>
        <p>{message}</p>
        <button onClick={() => {
          setIsVisible(false);
          setTimeout(() => onClose(id), 300);
        }}>
          ×
        </button>
      </div>
    </div>
  );
};

export default Toast;
