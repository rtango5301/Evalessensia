'use client';

import { motion } from 'framer-motion';
import { Check } from 'lucide-react';

const pricingPlans = [
  {
    tier: 'Starter',
    price: '$0',
    period: '/month',
    description: 'Perfect for side projects and experimentation',
    features: ['100 eval runs/month', '1 agent', '7-day data retention', 'Community support'],
    cta: 'Start Free',
    featured: false,
  },
  {
    tier: 'Professional',
    price: '$40',
    period: '/month',
    description: 'For teams shipping production agents',
    features: [
      '5,000 eval runs/month',
      '10 agents',
      '90-day data retention',
      'A/B testing & data export',
      'CI/CD integrations',
      'Email support',
    ],
    cta: 'Get Started',
    featured: true,
  },
  {
    tier: 'Enterprise',
    price: 'Custom',
    period: '',
    description: 'For organizations with advanced needs',
    features: [
      'Unlimited eval runs',
      'Unlimited agents',
      'Custom retention',
      'SSO/SAML',
      'Dedicated support & SLA',
      'On-premise option',
    ],
    cta: 'Contact Sales',
    featured: false,
  },
];

export function Pricing() {
  return (
    <section id="pricing" className="py-[100px] px-6 bg-[var(--background)] scroll-mt-20">
      <div className="max-w-[1200px] mx-auto">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <p className="text-base uppercase tracking-[0.2em] text-[var(--primary)] font-bold mb-4">
            Pricing
          </p>
          <h2 className="text-3xl md:text-4xl font-bold mb-4 tracking-tight">
            Simple, transparent pricing
          </h2>
          <p className="text-lg text-[var(--text-secondary)] max-w-[600px] mx-auto">
            Start free, scale as you grow. No surprise bills.
          </p>
        </motion.div>

        {/* Pricing Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-[1000px] mx-auto">
          {pricingPlans.map((plan, index) => (
            <motion.div
              key={plan.tier}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ y: -5 }}
              className={`relative bg-white border rounded-2xl p-8 ${
                plan.featured
                  ? 'border-[var(--primary)] shadow-lg shadow-[var(--primary)]/15'
                  : 'border-[var(--border)]'
              }`}
            >
              {plan.featured && (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 bg-[var(--primary)] text-white text-xs font-semibold rounded-full">
                  Most Popular
                </span>
              )}

              <p className="text-sm text-[var(--text-secondary)] mb-2">{plan.tier}</p>
              <div className="mb-2">
                <span className="text-4xl font-extrabold">{plan.price}</span>
                <span className="text-[var(--text-muted)]">{plan.period}</span>
              </div>
              <p className="text-sm text-[var(--text-secondary)] mb-6 pb-6 border-b border-[var(--border-light)]">
                {plan.description}
              </p>

              <ul className="space-y-3 mb-6">
                {plan.features.map((feature) => (
                  <li
                    key={feature}
                    className="flex items-center gap-2.5 text-sm text-[var(--text-secondary)]"
                  >
                    <Check className="w-4 h-4 text-[var(--accent-green)] flex-shrink-0" />
                    {feature}
                  </li>
                ))}
              </ul>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className={`w-full py-2.5 rounded-lg font-semibold text-sm transition-all ${
                  plan.featured
                    ? 'bg-[var(--primary)] hover:bg-[var(--primary-dark)] text-white shadow-sm hover:shadow-md hover:shadow-[var(--primary)]/30'
                    : 'bg-white hover:bg-[var(--bg-subtle)] text-[var(--foreground)] border border-[var(--border)]'
                }`}
              >
                {plan.cta}
              </motion.button>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
