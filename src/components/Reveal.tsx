"use client";

import { motion } from "framer-motion";
import type { ReactNode } from "react";

const ease = [0.22, 1, 0.36, 1] as const;

// Wrapper reusable: konten fade-in + slide-up begitu masuk viewport pas di-scroll.
// `once: true` supaya animasinya cuma jalan sekali (nggak berulang tiap scroll
// naik-turun — lebih tenang buat mata, bukan gimmick yang mengganggu).
export function Reveal({
  children,
  delay = 0,
  className
}: {
  children: ReactNode;
  delay?: number;
  className?: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.7, ease, delay }}
      className={className}
    >
      {children}
    </motion.div>
  );
}