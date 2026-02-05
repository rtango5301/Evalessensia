import type { NextConfig } from 'next';

// Build-time validation: ensure required env vars are set in production
if (process.env.NODE_ENV === 'production') {
  const requiredEnvVars = ['NEXT_PUBLIC_SUPABASE_URL', 'NEXT_PUBLIC_SUPABASE_ANON_KEY'];

  const missing = requiredEnvVars.filter((key) => !process.env[key]);

  if (missing.length > 0) {
    throw new Error(
      `[BUILD ERROR] Missing required environment variables for production: ${missing.join(', ')}\n` +
        'Set these in your deployment environment or .env.production file.'
    );
  }
}

const nextConfig: NextConfig = {
  /* config options here */
};

export default nextConfig;
