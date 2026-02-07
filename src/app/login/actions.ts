'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { headers } from 'next/headers';

const SUPABASE_NOT_CONFIGURED_ERROR =
  'Authentication is not configured. Please set up Supabase credentials.';

async function getOrigin() {
  const h = await headers();
  const origin = h.get('origin');
  if (origin) return origin;

  const host = h.get('x-forwarded-host') || h.get('host') || 'localhost:3000';
  const proto = h.get('x-forwarded-proto') || 'http';
  return `${proto}://${host}`;
}

export async function signInWithEmail(formData: FormData) {
  const supabase = await createClient();

  if (!supabase) {
    return { error: SUPABASE_NOT_CONFIGURED_ERROR };
  }

  const { error } = await supabase.auth.signInWithPassword({
    email: formData.get('email') as string,
    password: formData.get('password') as string,
  });

  if (error) {
    return { error: error.message };
  }

  revalidatePath('/', 'layout');
  redirect('/dashboard');
}

export async function signUpWithEmail(formData: FormData) {
  const supabase = await createClient();

  if (!supabase) {
    return { error: SUPABASE_NOT_CONFIGURED_ERROR };
  }

  const origin = await getOrigin();

  const { error } = await supabase.auth.signUp({
    email: formData.get('email') as string,
    password: formData.get('password') as string,
    options: {
      emailRedirectTo: `${origin}/auth/callback`,
      data: {
        full_name: formData.get('fullName') as string,
      },
    },
  });

  if (error) {
    return { error: error.message };
  }

  return { success: 'Check your email to confirm your account' };
}

export async function signInWithOAuth(provider: 'github' | 'google') {
  const supabase = await createClient();

  if (!supabase) {
    return { error: SUPABASE_NOT_CONFIGURED_ERROR };
  }

  const origin = await getOrigin();

  const { data, error } = await supabase.auth.signInWithOAuth({
    provider,
    options: {
      redirectTo: `${origin}/auth/callback`,
    },
  });

  if (error) {
    return { error: error.message };
  }

  redirect(data.url);
}

export async function signOut() {
  const supabase = await createClient();

  if (supabase) {
    await supabase.auth.signOut({ scope: 'global' });
  }
  revalidatePath('/', 'layout');
  // Don't redirect here - let client handle navigation with router.refresh()
  // to ensure Next.js Router Cache is properly cleared
}

export async function requestPasswordReset(email: string) {
  const supabase = await createClient();

  if (!supabase) {
    return { error: SUPABASE_NOT_CONFIGURED_ERROR };
  }

  const origin = await getOrigin();

  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${origin}/auth/reset-password`,
  });

  if (error && error.message.includes('rate limit')) {
    return { error: 'Too many requests. Please try again later.' };
  }

  // Always return success to prevent email enumeration
  return {
    success: 'If an account exists with this email, you will receive a password reset link.',
  };
}

export async function updatePassword(newPassword: string) {
  const supabase = await createClient();

  if (!supabase) {
    return { error: SUPABASE_NOT_CONFIGURED_ERROR };
  }

  const { error } = await supabase.auth.updateUser({
    password: newPassword,
  });

  if (error) {
    return { error: error.message };
  }

  return { success: 'Password updated successfully! Redirecting to dashboard...' };
}
