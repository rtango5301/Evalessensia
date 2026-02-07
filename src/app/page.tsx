import dynamic from 'next/dynamic';
import { Navigation } from '@/components/Navigation';
import { Hero } from '@/components/Hero';
import { createClient } from '@/lib/supabase/server';

const Demo = dynamic(() => import('@/components/Demo').then((mod) => mod.Demo));
const Workflow = dynamic(() => import('@/components/Workflow').then((mod) => mod.Workflow));
const Features = dynamic(() => import('@/components/Features').then((mod) => mod.Features));
const UseCases = dynamic(() => import('@/components/UseCases').then((mod) => mod.UseCases));
const Pricing = dynamic(() => import('@/components/Pricing').then((mod) => mod.Pricing));
const CTA = dynamic(() => import('@/components/CTA').then((mod) => mod.CTA));
const Footer = dynamic(() => import('@/components/Footer').then((mod) => mod.Footer));

export default async function Home() {
  const supabase = await createClient();

  let user = null;
  if (supabase) {
    const { data } = await supabase.auth.getUser();
    user = data.user;
  }

  return (
    <main className="min-h-screen">
      <Navigation
        user={
          user
            ? {
                id: user.id,
                email: user.email,
                name: user.user_metadata?.full_name || user.user_metadata?.name || null,
                avatarUrl: user.user_metadata?.avatar_url || null,
              }
            : null
        }
      />
      <Hero />
      <Demo />
      <Workflow />
      <Features />
      <UseCases />
      <Pricing />
      <CTA />
      <Footer />
    </main>
  );
}
