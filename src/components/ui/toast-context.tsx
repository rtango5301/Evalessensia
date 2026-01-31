'use client';

import React, { createContext, useContext, useState, useCallback, useRef } from 'react';

type ToastType = 'success' | 'info' | 'error';

interface ToastState {
  message: string;
  type: ToastType;
  isVisible: boolean;
}

interface ToastContextValue {
  toast: ToastState;
  showToast: (message: string, type: ToastType) => void;
  hideToast: () => void;
}

const ToastContext = createContext<ToastContextValue | undefined>(undefined);

const initialState: ToastState = {
  message: '',
  type: 'info',
  isVisible: false,
};

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toast, setToast] = useState<ToastState>(initialState);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const hideToast = useCallback(() => {
    setToast((prev) => ({ ...prev, isVisible: false }));
  }, []);

  const showToast = useCallback(
    (message: string, type: ToastType) => {
      // Clear any existing timeout
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      // Show the toast
      setToast({
        message,
        type,
        isVisible: true,
      });

      // Auto-dismiss after 5 seconds
      timeoutRef.current = setTimeout(() => {
        hideToast();
      }, 5000);
    },
    [hideToast]
  );

  return (
    <ToastContext.Provider value={{ toast, showToast, hideToast }}>
      {children}
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);

  if (context === undefined) {
    throw new Error('useToast must be used within a ToastProvider');
  }

  return {
    showToast: context.showToast,
    hideToast: context.hideToast,
    toast: context.toast,
  };
}
