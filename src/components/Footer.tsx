'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { Layers, Linkedin, CheckCircle } from 'lucide-react';

const footerLinks = {
  Product: [
    { label: 'Features', href: '#features' },
    { label: 'Workflow', href: '#workflow' },
    { label: 'Use Cases', href: '#use-cases' },
    { label: 'Pricing', href: '#pricing' },
  ],
  Solutions: [
    { label: 'Browser Agents', href: '#use-cases' },
    { label: 'Data Analysis Agents', href: '#use-cases' },
    { label: 'Customer Support Agents', href: '#use-cases' },
    { label: 'Content Creation Agents', href: '#use-cases' },
  ],
  Company: [
    { label: 'About', href: '#' },
    { label: 'Contact', href: 'mailto:contact@tensoreval.com' },
  ],
};

export function Footer() {
  return (
    <footer className="bg-[var(--background)] border-t border-[var(--border-light)] pt-10 lg:pt-16 pb-8 lg:pb-10 px-6">
      <div className="max-w-[1200px] mx-auto">
        {/* Footer Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-[2fr_1fr_1fr_1fr] gap-6 lg:gap-12 mb-8 lg:mb-12">
          {/* Brand */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <Link
              href="/"
              className="flex items-center gap-2.5 text-[var(--foreground)] no-underline mb-4"
            >
              <div className="w-8 h-8 bg-gradient-to-br from-[var(--primary)] to-[var(--primary-light)] rounded-lg flex items-center justify-center text-white">
                <Layers className="w-4 h-4" />
              </div>
              <span className="font-bold text-lg">TensorEval</span>
            </Link>
            <p className="text-sm text-[var(--text-secondary)] max-w-[280px] mb-4">
              Where AI agents go from experimental to enterprise-grade.
            </p>
            <div className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-[var(--accent-green)]" />
              <span className="text-sm text-[var(--text-secondary)]">All services are online</span>
            </div>
          </motion.div>

          {/* Link Columns */}
          {Object.entries(footerLinks).map(([category, links], catIndex) => (
            <motion.div
              key={category}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: catIndex * 0.05 }}
            >
              <h4 className="text-sm font-semibold mb-5">{category}</h4>
              <ul className="space-y-3">
                {links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-sm text-[var(--text-secondary)] hover:text-[var(--foreground)] transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>

        {/* Footer Bottom */}
        <div className="pt-6 border-t border-[var(--border-light)] flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-sm text-[var(--text-muted)]">
            © 2025 TensorEval Inc. All rights reserved.
          </p>
          <div className="flex gap-4">
            <motion.a
              href="#"
              whileHover={{ scale: 1.1 }}
              className="text-[var(--text-muted)] hover:text-[var(--foreground)] transition-colors"
            >
              <Linkedin className="w-5 h-5" />
            </motion.a>
          </div>
        </div>
      </div>
    </footer>
  );
}
