"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Layers, Menu, X } from "lucide-react";
import { useState, useEffect } from "react";

const navLinks = [
  { href: "#", label: "Docs" },
  { href: "#demo", label: "Demo" },
  { href: "#workflow", label: "Workflow" },
  { href: "#features", label: "Features" },
  { href: "#use-cases", label: "Use Cases" },
  { href: "#pricing", label: "Pricing" },
];

export function Navigation() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("");
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);

      // Detect active section
      const sections = navLinks
        .filter(link => link.href.startsWith("#") && link.href !== "#")
        .map(link => link.href.slice(1));

      for (const section of sections.reverse()) {
        const element = document.getElementById(section);
        if (element) {
          const rect = element.getBoundingClientRect();
          if (rect.top <= 100) {
            setActiveSection(section);
            return;
          }
        }
      }
      setActiveSection("");
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled 
          ? "bg-white/95 backdrop-blur-xl shadow-sm border-b border-[var(--border-light)]" 
          : "bg-white/80 backdrop-blur-md"
      }`}
    >
      <div className="max-w-[1200px] mx-auto px-6 flex items-center justify-between h-16">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2.5 text-[var(--foreground)] no-underline">
          <motion.div
            whileHover={{ scale: 1.05, rotate: 5 }}
            className="w-8 h-8 bg-gradient-to-br from-[var(--primary)] to-[var(--primary-light)] rounded-lg flex items-center justify-center text-white"
          >
            <Layers className="w-4 h-4" />
          </motion.div>
          <span className="font-bold text-lg">TensorEval</span>
        </Link>

        {/* Desktop Nav Links */}
        <div className="hidden lg:flex items-center gap-2">
          {navLinks.map((link) => {
            const isActive = activeSection === link.href.slice(1);
            return (
              <motion.div key={link.label} whileHover={{ y: -1 }}>
                <Link
                  href={link.href}
                  className={`relative px-4 py-2 text-[15px] font-medium transition-colors rounded-lg ${
                    isActive
                      ? "text-[var(--primary)]"
                      : "text-[var(--text-secondary)] hover:text-[var(--foreground)] hover:bg-[var(--bg-subtle)]"
                  }`}
                >
                  {link.label}
                  {isActive && (
                    <motion.div
                      layoutId="activeNav"
                      className="absolute bottom-0 left-4 right-4 h-0.5 bg-[var(--primary)] rounded-full"
                      transition={{ type: "spring", stiffness: 380, damping: 30 }}
                    />
                  )}
                </Link>
              </motion.div>
            );
          })}
        </div>

        {/* Desktop Actions */}
        <div className="hidden lg:flex items-center gap-3">
          <Link href="/login">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="px-4 py-2 text-[var(--text-secondary)] hover:text-[var(--foreground)] text-[15px] font-medium transition-colors rounded-lg hover:bg-[var(--bg-subtle)]"
            >
              Login
            </motion.button>
          </Link>
          <motion.button
            whileHover={{ scale: 1.02, y: -1 }}
            whileTap={{ scale: 0.98 }}
            className="px-5 py-2.5 bg-[var(--primary)] hover:bg-[var(--primary-dark)] text-white rounded-lg text-[15px] font-semibold transition-all shadow-sm hover:shadow-lg hover:shadow-[var(--primary)]/30"
          >
            Get Started
          </motion.button>
        </div>

        {/* Mobile Menu Button */}
        <motion.button
          whileTap={{ scale: 0.95 }}
          className="lg:hidden p-2 rounded-lg hover:bg-[var(--bg-subtle)] transition-colors"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </motion.button>
      </div>

      {/* Mobile Menu */}
      <motion.div
        initial={false}
        animate={{ 
          height: mobileMenuOpen ? "auto" : 0, 
          opacity: mobileMenuOpen ? 1 : 0 
        }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
        className="lg:hidden overflow-hidden bg-white border-t border-[var(--border-light)]"
      >
        <div className="px-6 py-4 flex flex-col gap-1">
          {navLinks.map((link, index) => (
            <motion.div
              key={link.label}
              initial={{ opacity: 0, x: -20 }}
              animate={mobileMenuOpen ? { opacity: 1, x: 0 } : { opacity: 0, x: -20 }}
              transition={{ delay: index * 0.05 }}
            >
              <Link
                href={link.href}
                className={`block px-4 py-3 rounded-lg text-base font-medium transition-colors ${
                  activeSection === link.href.slice(1)
                    ? "text-[var(--primary)] bg-[var(--primary)]/5"
                    : "text-[var(--text-secondary)] hover:text-[var(--foreground)] hover:bg-[var(--bg-subtle)]"
                }`}
                onClick={() => setMobileMenuOpen(false)}
              >
                {link.label}
              </Link>
            </motion.div>
          ))}
          <div className="flex flex-col gap-2 pt-4 mt-2 border-t border-[var(--border-light)]">
            <Link href="/login" onClick={() => setMobileMenuOpen(false)}>
              <button className="w-full py-3 text-[var(--foreground)] text-base font-semibold border border-[var(--border)] rounded-lg hover:bg-[var(--bg-subtle)] transition-colors">
                Login
              </button>
            </Link>
            <button className="w-full py-3 bg-[var(--primary)] text-white rounded-lg text-base font-semibold hover:bg-[var(--primary-dark)] transition-colors">
              Get Started
            </button>
          </div>
        </div>
      </motion.div>
    </motion.nav>
  );
}
