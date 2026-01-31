'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { useToast } from './toast-context';

type ToastType = 'success' | 'info' | 'error';

// Icon and color configuration based on toast type
const toastConfig: Record<ToastType, { icon: string; iconColor: string; borderColor: string }> = {
  success: {
    icon: 'check_circle',
    iconColor: 'text-green-500',
    borderColor: 'border-green-500',
  },
  info: {
    icon: 'info',
    iconColor: 'text-[#135bec]',
    borderColor: 'border-[#135bec]',
  },
  error: {
    icon: 'error',
    iconColor: 'text-red-500',
    borderColor: 'border-red-500',
  },
};

export function Toast() {
  const { toast, hideToast } = useToast();
  const { message, type, isVisible } = toast;
  const config = toastConfig[type];

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: -100 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -100 }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          className={cn(
            'fixed top-4 left-1/2 z-50 -translate-x-1/2',
            'flex items-center gap-3 px-4 py-3',
            'bg-white rounded-lg shadow-lg',
            'border-l-4',
            config.borderColor
          )}
          role="alert"
          aria-live="polite"
        >
          {/* Icon */}
          <span
            className={cn('material-symbols-rounded text-xl', config.iconColor)}
            aria-hidden="true"
          >
            {config.icon}
          </span>

          {/* Message */}
          <p className="text-sm font-medium text-gray-800 pr-2">{message}</p>

          {/* Dismiss button */}
          <button
            onClick={hideToast}
            className={cn(
              'flex items-center justify-center',
              'w-6 h-6 rounded-full',
              'text-gray-400 hover:text-gray-600',
              'hover:bg-gray-100 transition-colors',
              'focus:outline-none focus:ring-2 focus:ring-gray-300'
            )}
            aria-label="Dismiss notification"
          >
            <span className="material-symbols-rounded text-lg" aria-hidden="true">
              close
            </span>
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
