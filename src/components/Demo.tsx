"use client";

import { motion } from "framer-motion";
import { Play } from "lucide-react";

export function Demo() {
  return (
    <section id="demo" className="py-[100px] px-6 bg-[var(--background)] scroll-mt-20">
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
            Demo
          </p>
          <h2 className="text-3xl md:text-4xl font-bold mb-4 tracking-tight">
            See it in action
          </h2>
          <p className="text-lg text-[var(--text-secondary)] max-w-[600px] mx-auto">
            Watch how TensorEval evaluates your agent in under 10 seconds
          </p>
        </motion.div>

        {/* Video Container */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="max-w-[900px] mx-auto"
        >
          <motion.div
            whileHover={{ scale: 1.01 }}
            className="bg-[var(--bg-muted)] rounded-xl p-12 cursor-pointer"
          >
            <motion.div
              whileHover={{ scale: 1.02 }}
              className="bg-white border-2 border-dashed border-[var(--border)] rounded-lg p-16 md:p-20 text-center group"
            >
              <motion.div
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                className="inline-flex items-center justify-center w-20 h-20 bg-[var(--primary)] rounded-full mb-6 group-hover:shadow-lg group-hover:shadow-[var(--primary)]/30 transition-shadow"
              >
                <Play className="w-8 h-8 text-white ml-1" fill="white" />
              </motion.div>
              <p className="text-[var(--text-muted)] text-lg mb-2">
                10-second product walkthrough video
              </p>
              <p className="text-[var(--text-muted)] text-sm">
                Configure → Generate Queries → Run Eval → View Results
              </p>
            </motion.div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
