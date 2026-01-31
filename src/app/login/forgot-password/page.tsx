'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { Zap, Mail, ArrowLeft, AlertCircle, CheckCircle } from 'lucide-react';
import { useState, useTransition } from 'react';
import { requestPasswordReset } from '../actions';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const isFormValid = email.trim() !== '';

  const handleSubmit = async () => {
    if (!isFormValid) return;

    setError(null);
    setSuccess(null);

    startTransition(async () => {
      const result = await requestPasswordReset(email);
      if (result?.error) {
        setError(result.error);
      } else if (result?.success) {
        setSuccess(result.success);
      }
    });
  };

  return (
    <div className="min-h-screen bg-[var(--bg-subtle)] flex items-center justify-center p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-[440px] bg-white rounded-3xl shadow-xl p-10"
      >
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2.5 mb-8 justify-center">
          <div className="w-10 h-10 bg-gradient-to-br from-[var(--primary)] to-[var(--primary-light)] rounded-xl flex items-center justify-center text-white">
            <Zap className="w-5 h-5" />
          </div>
          <span className="font-bold text-xl text-[var(--foreground)]">TensorEval</span>
        </Link>

        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold mb-2">Forgot your password?</h1>
          <p className="text-[var(--text-secondary)]">
            Enter your email address and we&apos;ll send you a link to reset your password.
          </p>
        </div>

        {/* Error Message */}
        {error && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            className="mb-4"
          >
            <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{error}</span>
            </div>
          </motion.div>
        )}

        {/* Success Message */}
        {success && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            className="mb-4"
          >
            <div className="flex items-center gap-2 p-3 bg-green-50 border border-green-200 rounded-xl text-green-700 text-sm">
              <CheckCircle className="w-4 h-4 flex-shrink-0" />
              <span>{success}</span>
            </div>
          </motion.div>
        )}

        {/* Email Input */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-[var(--foreground)] mb-2">
            Email Address
          </label>
          <div className="relative">
            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[var(--text-muted)]" />
            <input
              type="email"
              placeholder="you@company.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={isPending}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && isFormValid && !isPending) {
                  handleSubmit();
                }
              }}
              className="w-full pl-12 pr-4 py-3 border border-[var(--border)] rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-[var(--primary)]/20 focus:border-[var(--primary)] transition-all text-[var(--foreground)] placeholder:text-[var(--text-muted)] disabled:opacity-50"
            />
          </div>
        </div>

        {/* Submit Button */}
        <motion.button
          whileHover={isFormValid && !isPending ? { scale: 1.01, y: -1 } : {}}
          whileTap={isFormValid && !isPending ? { scale: 0.99 } : {}}
          onClick={handleSubmit}
          disabled={!isFormValid || isPending}
          className={`w-full flex items-center justify-center gap-2 px-4 py-3.5 rounded-xl font-semibold transition-all mb-6 ${
            isFormValid && !isPending
              ? 'bg-gradient-to-r from-[var(--primary)] to-[var(--primary-light)] text-white shadow-lg shadow-[var(--primary)]/25 hover:shadow-xl hover:shadow-[var(--primary)]/30'
              : 'bg-[var(--bg-subtle)] text-[var(--text-muted)] cursor-not-allowed'
          }`}
        >
          {isPending ? (
            <>
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full"
              />
              Sending...
            </>
          ) : (
            'Send Reset Link'
          )}
        </motion.button>

        {/* Back to Login */}
        <Link
          href="/login"
          className="flex items-center justify-center gap-2 text-sm text-[var(--text-secondary)] hover:text-[var(--foreground)] transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to login
        </Link>
      </motion.div>
    </div>
  );
}
