'use client';

import { motion } from 'framer-motion';
import { Play } from 'lucide-react';

export function Demo() {
  return (
    <section
      id="demo"
      className="py-14 lg:py-[90px] px-4 sm:px-6 lg:px-8 bg-[var(--background)] scroll-mt-20"
    >
      <div className="max-w-[1080px] mx-auto">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-8 lg:mb-12"
        >
          <p className="text-base uppercase tracking-[0.2em] text-[var(--primary)] font-bold mb-4">
            Demo
          </p>
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-3 lg:mb-4 tracking-tight">
            See it in action
          </h2>
          <p className="text-base lg:text-lg text-[var(--text-secondary)] max-w-[600px] mx-auto">
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
            className="bg-[var(--bg-muted)] rounded-xl p-4 sm:p-8 lg:p-12 cursor-pointer"
          >
            <motion.div
              whileHover={{ scale: 1.02 }}
              className="bg-white border-2 border-dashed border-[var(--border)] rounded-lg p-8 sm:p-12 lg:p-16 xl:p-20 text-center group"
            >
              <motion.div
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                className="inline-flex items-center justify-center w-16 h-16 lg:w-20 lg:h-20 bg-[var(--primary)] rounded-full mb-4 lg:mb-6 group-hover:shadow-lg group-hover:shadow-[var(--primary)]/30 transition-shadow"
              >
                <Play className="w-6 h-6 lg:w-8 lg:h-8 text-white ml-1" fill="white" />
              </motion.div>
              <p className="text-[var(--text-muted)] text-base lg:text-lg mb-2">
                10-second product walkthrough video
              </p>
              <p className="text-[var(--text-muted)] text-xs lg:text-sm">
                Configure → Generate Queries → Run Eval → View Results
              </p>
            </motion.div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
