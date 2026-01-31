'use client';

import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Zap, Check, Github, Mail, Lock, Eye, EyeOff, User } from 'lucide-react';
import { useState, useMemo } from 'react';

type AuthMode = 'signin' | 'signup';

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

export default function AuthPage() {
  const [mode, setMode] = useState<AuthMode>('signin');
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  // Check which password rules are satisfied
  const passwordValidation = useMemo(() => {
    return passwordRules.map((rule) => ({
      ...rule,
      passed: rule.test(password),
    }));
  }, [password]);

  const allPasswordRulesPassed = passwordValidation.every((rule) => rule.passed);

  // Form validation based on mode
  const isFormValid =
    mode === 'signin'
      ? email.trim() !== '' && password.trim() !== ''
      : fullName.trim() !== '' && email.trim() !== '' && allPasswordRulesPassed;

  const handleSubmit = async () => {
    if (!isFormValid) return;

    if (mode === 'signup') {
      setIsSubmitting(true);
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500));
    }

    router.push('/dashboard');
  };

  const handleOAuth = () => {
    router.push('/dashboard');
  };

  // Reset form when switching modes
  const handleModeChange = (newMode: AuthMode) => {
    setMode(newMode);
    setFullName('');
    setEmail('');
    setPassword('');
    setShowPassword(false);
    setIsSubmitting(false);
  };

  return (
    <div className="min-h-screen bg-[var(--bg-subtle)] flex items-center justify-center p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-[1000px] bg-white rounded-3xl shadow-xl overflow-hidden grid grid-cols-1 lg:grid-cols-2"
      >
        {/* Left Side - Branding */}
        <div className="p-10 lg:p-12 bg-gradient-to-br from-white to-[var(--bg-subtle)] border-r border-[var(--border-light)]">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 mb-12">
            <div className="w-10 h-10 bg-gradient-to-br from-[var(--primary)] to-[var(--primary-light)] rounded-xl flex items-center justify-center text-white">
              <Zap className="w-5 h-5" />
            </div>
            <span className="font-bold text-xl text-[var(--foreground)]">TensorEval</span>
          </Link>

          {/* Heading */}
          <h1 className="text-4xl lg:text-5xl font-extrabold leading-[1.1] mb-6 tracking-tight">
            Ship AI Agents
            <br />
            with
            <br />
            <span className="gradient-text">Confidence</span>
          </h1>

          {/* Description */}
          <p className="text-[var(--text-secondary)] text-lg mb-8">
            Automated evaluation, benchmarking, and release gating for every agentic workflow.
          </p>

          {/* Features */}
          <div className="space-y-4 mb-10">
            {[
              'Catch regressions before users',
              'Automated baseline comparison',
              'CI/CD native integration',
            ].map((feature, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 + i * 0.1 }}
                className="flex items-center gap-3"
              >
                <div className="w-6 h-6 rounded-full bg-[var(--primary)] flex items-center justify-center flex-shrink-0">
                  <Check className="w-3.5 h-3.5 text-white" />
                </div>
                <span className="text-[var(--foreground)] font-medium">{feature}</span>
              </motion.div>
            ))}
          </div>

          {/* Stats */}
          <div className="pt-8 border-t border-[var(--border)]">
            <div className="grid grid-cols-3 gap-6">
              <StatItem value="90%+" label="REGRESSION RATE" />
              <StatItem value="5K+" label="AGENTS EVALUATED" />
              <StatItem value="<30m" label="EVAL TIME" />
            </div>
          </div>
        </div>

        {/* Right Side - Auth Form */}
        <div className="p-10 lg:p-12 flex flex-col justify-center">
          <div className="max-w-[380px] mx-auto w-full">
            {/* Tabs */}
            <div className="flex justify-center mb-8">
              <div className="flex gap-8">
                <button
                  onClick={() => handleModeChange('signin')}
                  className={`pb-2 text-lg font-semibold transition-colors relative ${
                    mode === 'signin'
                      ? 'text-slate-900 border-b-2 border-[var(--primary)]'
                      : 'text-slate-500 hover:text-slate-700'
                  }`}
                >
                  Sign In
                </button>
                <button
                  onClick={() => handleModeChange('signup')}
                  className={`pb-2 text-lg font-semibold transition-colors relative ${
                    mode === 'signup'
                      ? 'text-slate-900 border-b-2 border-[var(--primary)]'
                      : 'text-slate-500 hover:text-slate-700'
                  }`}
                >
                  Sign Up
                </button>
              </div>
            </div>

            {/* Header */}
            <AnimatePresence mode="wait">
              <motion.div
                key={mode}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                transition={{ duration: 0.2 }}
                className="text-center mb-8"
              >
                <h2 className="text-3xl font-bold mb-2">
                  {mode === 'signin' ? 'Welcome back' : 'Create your account'}
                </h2>
                <p className="text-[var(--text-secondary)]">
                  {mode === 'signin'
                    ? 'Enter your credentials to access your dashboard'
                    : 'Join thousands of AI teams shipping agents with confidence'}
                </p>
              </motion.div>
            </AnimatePresence>

            {/* OAuth Buttons */}
            <div className="space-y-3 mb-6">
              <motion.button
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
                onClick={handleOAuth}
                className="w-full flex items-center justify-center gap-3 px-4 py-3 bg-white border border-[var(--border)] rounded-xl font-medium text-[var(--foreground)] hover:bg-[var(--bg-subtle)] transition-colors"
              >
                <Github className="w-5 h-5" />
                Continue with GitHub
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
                onClick={handleOAuth}
                className="w-full flex items-center justify-center gap-3 px-4 py-3 bg-white border border-[var(--border)] rounded-xl font-medium text-[var(--foreground)] hover:bg-[var(--bg-subtle)] transition-colors"
              >
                <GoogleIcon />
                Continue with Google
              </motion.button>
            </div>

            {/* Divider */}
            <div className="flex items-center gap-4 mb-6">
              <div className="flex-1 h-px bg-[var(--border)]" />
              <span className="text-sm text-[var(--text-muted)]">or continue with email</span>
              <div className="flex-1 h-px bg-[var(--border)]" />
            </div>

            {/* Full Name Input - Only for Sign Up */}
            <AnimatePresence>
              {mode === 'signup' && (
                <motion.div
                  initial={{ opacity: 0, height: 0, marginBottom: 0 }}
                  animate={{ opacity: 1, height: 'auto', marginBottom: 16 }}
                  exit={{ opacity: 0, height: 0, marginBottom: 0 }}
                  transition={{ duration: 0.3 }}
                  className="overflow-hidden"
                >
                  <label className="block text-sm font-medium text-[var(--foreground)] mb-2">
                    Full Name
                  </label>
                  <div className="relative">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[var(--text-muted)]" />
                    <input
                      type="text"
                      placeholder="John Doe"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      className="w-full pl-12 pr-4 py-3 border border-[var(--border)] rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-[var(--primary)]/20 focus:border-[var(--primary)] transition-all text-[var(--foreground)] placeholder:text-[var(--text-muted)]"
                    />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Email Input */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-[var(--foreground)] mb-2">
                {mode === 'signin' ? 'Email Address' : 'Work Email'}
              </label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[var(--text-muted)]" />
                <input
                  type="email"
                  placeholder="you@company.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 border border-[var(--border)] rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-[var(--primary)]/20 focus:border-[var(--primary)] transition-all text-[var(--foreground)] placeholder:text-[var(--text-muted)]"
                />
              </div>
            </div>

            {/* Password Input */}
            <div className={mode === 'signin' ? 'mb-6' : 'mb-4'}>
              <div className="flex items-center justify-between mb-2">
                <label className="block text-sm font-medium text-[var(--foreground)]">
                  Password
                </label>
                {mode === 'signin' && (
                  <Link
                    href="#"
                    className="text-sm text-[var(--primary)] hover:underline font-medium"
                  >
                    Forgot password?
                  </Link>
                )}
              </div>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[var(--text-muted)]" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-12 pr-12 py-3 border border-[var(--border)] rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-[var(--primary)]/20 focus:border-[var(--primary)] transition-all text-[var(--foreground)] placeholder:text-[var(--text-muted)]"
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

            {/* Password Requirements - Only for Sign Up */}
            <AnimatePresence>
              {mode === 'signup' && (
                <motion.div
                  initial={{ opacity: 0, height: 0, marginBottom: 0 }}
                  animate={{ opacity: 1, height: 'auto', marginBottom: 24 }}
                  exit={{ opacity: 0, height: 0, marginBottom: 0 }}
                  transition={{ duration: 0.3 }}
                  className="overflow-hidden"
                >
                  <div className="space-y-2">
                    {passwordValidation.map((rule) => (
                      <motion.div
                        key={rule.id}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="flex items-center gap-2"
                      >
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
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Submit Button */}
            <motion.button
              whileHover={isFormValid && !isSubmitting ? { scale: 1.01, y: -1 } : {}}
              whileTap={isFormValid && !isSubmitting ? { scale: 0.99 } : {}}
              onClick={handleSubmit}
              disabled={!isFormValid || isSubmitting}
              className={`w-full flex items-center justify-center gap-2 px-4 py-3.5 rounded-xl font-semibold transition-all mb-6 ${
                isFormValid && !isSubmitting
                  ? 'bg-gradient-to-r from-[var(--primary)] to-[var(--primary-light)] text-white shadow-lg shadow-[var(--primary)]/25 hover:shadow-xl hover:shadow-[var(--primary)]/30'
                  : 'bg-[var(--bg-subtle)] text-[var(--text-muted)] cursor-not-allowed'
              }`}
            >
              {isSubmitting ? (
                <>
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                    className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full"
                  />
                  Creating account...
                </>
              ) : (
                <>
                  {mode === 'signin' ? 'Sign In' : 'Create Account'}
                  <span className="ml-1">→</span>
                </>
              )}
            </motion.button>

            {/* Terms */}
            <p className="text-center text-xs text-[var(--text-muted)] mt-6">
              By continuing, you agree to our{' '}
              <Link href="#" className="underline hover:text-[var(--foreground)]">
                Terms
              </Link>{' '}
              &{' '}
              <Link href="#" className="underline hover:text-[var(--foreground)]">
                Privacy
              </Link>
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

function StatItem({ value, label }: { value: string; label: string }) {
  return (
    <div>
      <div className="text-2xl lg:text-3xl font-bold text-[var(--primary)]">{value}</div>
      <div className="text-[10px] text-[var(--text-muted)] uppercase tracking-wider mt-1">
        {label}
      </div>
    </div>
  );
}

function GoogleIcon() {
  return (
    <svg className="w-5 h-5" viewBox="0 0 24 24">
      <path
        fill="#4285F4"
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
      />
      <path
        fill="#34A853"
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
      />
      <path
        fill="#FBBC05"
        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
      />
      <path
        fill="#EA4335"
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
      />
    </svg>
  );
}
