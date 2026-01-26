"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Layers, Github, Twitter } from "lucide-react";

const footerLinks = {
  Product: ["Features", "Integrations", "Pricing", "Changelog"],
  Resources: ["Documentation", "API Reference", "Community", "Blog"],
  Company: ["About", "Careers", "Legal", "Contact"],
};

export function Footer() {
  return (
    <footer className="bg-[var(--background)] border-t border-[var(--border-light)] pt-16 pb-10 px-6">
      <div className="max-w-[1200px] mx-auto">
        {/* Footer Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-[2fr_1fr_1fr_1fr] gap-12 mb-12">
          {/* Brand */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <Link href="/" className="flex items-center gap-2.5 text-[var(--foreground)] no-underline mb-4">
              <div className="w-8 h-8 bg-gradient-to-br from-[var(--primary)] to-[var(--primary-light)] rounded-lg flex items-center justify-center text-white">
                <Layers className="w-4 h-4" />
              </div>
              <span className="font-bold text-lg">TensorEval</span>
            </Link>
            <p className="text-sm text-[var(--text-secondary)] max-w-[280px]">
              The developer-first platform for evaluating and monitoring AI agents in production.
            </p>
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
                  <li key={link}>
                    <Link
                      href="#"
                      className="text-sm text-[var(--text-secondary)] hover:text-[var(--foreground)] transition-colors"
                    >
                      {link}
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
              <Twitter className="w-5 h-5" />
            </motion.a>
            <motion.a
              href="#"
              whileHover={{ scale: 1.1 }}
              className="text-[var(--text-muted)] hover:text-[var(--foreground)] transition-colors"
            >
              <Github className="w-5 h-5" />
            </motion.a>
          </div>
        </div>
      </div>
    </footer>
  );
}
