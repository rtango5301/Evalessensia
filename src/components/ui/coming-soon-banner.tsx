'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { X, Sparkles } from 'lucide-react';
import { useEffect } from 'react';

interface ComingSoonBannerProps {
  show: boolean;
  onClose: () => void;
}

export function ComingSoonBanner({ show, onClose }: ComingSoonBannerProps) {
  useEffect(() => {
    if (!show) return;
    const timer = setTimeout(onClose, 4000);
    return () => clearTimeout(timer);
  }, [show, onClose]);

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0, y: -40 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -40 }}
          transition={{ type: 'spring', stiffness: 400, damping: 30 }}
          className="fixed top-20 left-1/2 -translate-x-1/2 z-[100] w-[90%] max-w-md"
        >
          <div className="flex items-center gap-3 px-5 py-3.5 bg-white rounded-xl border border-[var(--primary)]/20 shadow-lg shadow-[var(--primary)]/10">
            <div className="w-9 h-9 rounded-lg bg-[var(--primary)]/10 flex items-center justify-center flex-shrink-0">
              <Sparkles className="w-4.5 h-4.5 text-[var(--primary)]" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-[var(--foreground)]">Coming Soon</p>
              <p className="text-xs text-[var(--text-secondary)]">
                We&apos;re working hard to bring this to you. Stay tuned!
              </p>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg hover:bg-[var(--bg-subtle)] transition-colors flex-shrink-0"
              aria-label="Dismiss"
            >
              <X className="w-4 h-4 text-[var(--text-muted)]" />
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
