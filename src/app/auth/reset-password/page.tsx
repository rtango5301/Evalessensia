'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Zap, Lock, Eye, EyeOff, AlertCircle, CheckCircle, Check } from 'lucide-react';
import { useState, useMemo, useTransition, useEffect } from 'react';
import { updatePassword } from '@/app/login/actions';
import { createClient } from '@/lib/supabase/client';

// Password validation rules
const passwordRules = [
  { id: 'length', label: 'At least 8 characters', test: (p: string) => p.length >= 8 },
  { id: 'upper', label: 'One uppercase letter', test: (p: string) => /[A-Z]/.test(p) },
  {
    id: 'special',
    label: 'One number or symbol',
    test: (p: string) => /[0-9!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(p),
  },
];

export default function ResetPasswordPage() {
  const router = useRouter();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const [isValidSession, setIsValidSession] = useState<boolean | null>(null);

  // Check if user has a valid session (came from reset email link)
  useEffect(() => {
    const checkSession = async () => {
      const supabase = createClient();
      const {
        data: { session },
      } = await supabase.auth.getSession();
      setIsValidSession(!!session);
    };
    checkSession();
  }, []);

  // Check which password rules are satisfied
  const passwordValidation = useMemo(() => {
    return passwordRules.map((rule) => ({
      ...rule,
      passed: rule.test(password),
    }));
  }, [password]);

  const allPasswordRulesPassed = passwordValidation.every((rule) => rule.passed);
  const passwordsMatch = password === confirmPassword && confirmPassword.length > 0;

  const isFormValid = allPasswordRulesPassed && passwordsMatch;

  const handleSubmit = async () => {
    if (!isFormValid) return;

    setError(null);
    setSuccess(null);

    startTransition(async () => {
      const result = await updatePassword(password);
      if (result?.error) {
        setError(result.error);
      } else if (result?.success) {
        setSuccess(result.success);
        // Redirect to dashboard after a short delay
        setTimeout(() => {
          router.push('/dashboard');
        }, 2000);
      }
    });
  };

  // Loading state while checking session
  if (isValidSession === null) {
    return (
      <div className="min-h-screen bg-[var(--bg-subtle)] flex items-center justify-center p-6">
        <div className="w-full max-w-[440px] bg-white rounded-3xl shadow-xl p-10 text-center">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
            className="w-8 h-8 border-2 border-[var(--primary)]/30 border-t-[var(--primary)] rounded-full mx-auto"
          />
          <p className="mt-4 text-[var(--text-secondary)]">Verifying session...</p>
        </div>
      </div>
    );
  }

  // Invalid session - no valid reset token
  if (!isValidSession) {
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

          <div className="text-center">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <AlertCircle className="w-8 h-8 text-red-500" />
            </div>
            <h1 className="text-2xl font-bold mb-2">Invalid or Expired Link</h1>
            <p className="text-[var(--text-secondary)] mb-6">
              This password reset link is invalid or has expired. Please request a new one.
            </p>
            <Link
              href="/login/forgot-password"
              className="inline-flex items-center justify-center px-6 py-3 rounded-xl font-semibold bg-gradient-to-r from-[var(--primary)] to-[var(--primary-light)] text-white shadow-lg shadow-[var(--primary)]/25 hover:shadow-xl hover:shadow-[var(--primary)]/30 transition-all"
            >
              Request New Link
            </Link>
          </div>
        </motion.div>
      </div>
    );
  }

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
          <h1 className="text-2xl font-bold mb-2">Reset your password</h1>
          <p className="text-[var(--text-secondary)]">Enter your new password below.</p>
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

        {/* New Password Input */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-[var(--foreground)] mb-2">
            New Password
          </label>
          <div className="relative">
            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[var(--text-muted)]" />
            <input
              type={showPassword ? 'text' : 'password'}
              placeholder="Enter new password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={isPending || !!success}
              className="w-full pl-12 pr-12 py-3 border border-[var(--border)] rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-[var(--primary)]/20 focus:border-[var(--primary)] transition-all text-[var(--foreground)] placeholder:text-[var(--text-muted)] disabled:opacity-50"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-[var(--text-muted)] hover:text-[var(--foreground)] transition-colors"
            >
              {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Password Requirements */}
        <div className="mb-4">
          <div className="space-y-2">
            {passwordValidation.map((rule) => (
              <div key={rule.id} className="flex items-center gap-2">
                <div
                  className={`w-4 h-4 rounded-full flex items-center justify-center transition-colors ${
                    rule.passed
                      ? 'bg-green-500'
                      : password.length > 0
                        ? 'bg-[var(--border)]'
                        : 'border border-[var(--border)] bg-transparent'
                  }`}
                >
                  {rule.passed && <Check className="w-2.5 h-2.5 text-white" />}
                </div>
                <span
                  className={`text-sm transition-colors ${
                    rule.passed ? 'text-green-600' : 'text-[var(--text-muted)]'
                  }`}
                >
                  {rule.label}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Confirm Password Input */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-[var(--foreground)] mb-2">
            Confirm Password
          </label>
          <div className="relative">
            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[var(--text-muted)]" />
            <input
              type={showConfirmPassword ? 'text' : 'password'}
              placeholder="Confirm new password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              disabled={isPending || !!success}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && isFormValid && !isPending) {
                  handleSubmit();
                }
              }}
              className="w-full pl-12 pr-12 py-3 border border-[var(--border)] rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-[var(--primary)]/20 focus:border-[var(--primary)] transition-all text-[var(--foreground)] placeholder:text-[var(--text-muted)] disabled:opacity-50"
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-[var(--text-muted)] hover:text-[var(--foreground)] transition-colors"
            >
              {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
            </button>
          </div>
          {confirmPassword.length > 0 && !passwordsMatch && (
            <p className="mt-2 text-sm text-red-500">Passwords do not match</p>
          )}
          {passwordsMatch && (
            <p className="mt-2 text-sm text-green-600 flex items-center gap-1">
              <Check className="w-4 h-4" />
              Passwords match
            </p>
          )}
        </div>

        {/* Submit Button */}
        <motion.button
          whileHover={isFormValid && !isPending && !success ? { scale: 1.01, y: -1 } : {}}
          whileTap={isFormValid && !isPending && !success ? { scale: 0.99 } : {}}
          onClick={handleSubmit}
          disabled={!isFormValid || isPending || !!success}
          className={`w-full flex items-center justify-center gap-2 px-4 py-3.5 rounded-xl font-semibold transition-all ${
            isFormValid && !isPending && !success
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
              Updating password...
            </>
          ) : success ? (
            <>
              <CheckCircle className="w-5 h-5" />
              Password Updated
            </>
          ) : (
            'Reset Password'
          )}
        </motion.button>
      </motion.div>
    </div>
  );
}
