import { Navigation } from '@/components/Navigation';
import { Hero } from '@/components/Hero';
import { Demo } from '@/components/Demo';
import { Workflow } from '@/components/Workflow';
import { Features } from '@/components/Features';
import { UseCases } from '@/components/UseCases';
import { Pricing } from '@/components/Pricing';
import { CTA } from '@/components/CTA';
import { Footer } from '@/components/Footer';
import { createClient } from '@/lib/supabase/server';

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
