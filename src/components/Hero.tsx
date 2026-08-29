"use client";

import { motion } from "framer-motion";
import { ArrowDownRight } from "lucide-react";

const ease = [0.22, 1, 0.36, 1] as const;

export interface HeroContent {
  eyebrow: string;
  headline: string;
  description: string;
}

export function Hero({ content }: { content: HeroContent }) {
  return (
    <section
      id="home"
      className="relative flex min-h-[92vh] flex-col justify-center overflow-hidden px-6 pt-28 md:px-14"
    >
      <motion.p
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease }}
        className="mb-6 text-[13px] uppercase tracking-[0.25em] text-foreground/60"
      >
        {content.eyebrow} · 2026
      </motion.p>

      <motion.h1
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease, delay: 0.1 }}
        className="max-w-4xl text-balance text-[13vw] font-medium uppercase leading-[0.92] tracking-tight md:text-[6.4vw]"
        style={{ fontFamily: "'Trobika', 'Bebas Neue', sans-serif" }}
      >
        {content.headline}
      </motion.h1>

      <motion.p
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease, delay: 0.3 }}
        className="mt-8 max-w-md text-[17px] leading-relaxed text-foreground/70"
      >
        {content.description}
      </motion.p>

      <motion.a
        href="#works"
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease, delay: 0.45 }}
        className="mt-12 inline-flex w-fit items-center gap-2 rounded-full bg-foreground px-6 py-3 text-[14px] font-medium uppercase tracking-wide text-background transition hover:opacity-85"
      >
        Lihat karya
        <ArrowDownRight className="size-4" />
      </motion.a>

      {/* Marka desimal — bergerak, jadi tanda tangan visual halaman ini */}
      <div className="pointer-events-none absolute inset-x-0 bottom-6 overflow-hidden">
        <div className="flex w-max animate-marquee gap-10 whitespace-nowrap text-[13px] uppercase tracking-[0.3em] text-foreground/30">
          {Array.from({ length: 2 }).map((_, i) => (
            <span key={i} className="flex gap-10">
              <span>Full-Stack</span>
              <span>·</span>
              <span>Next.js</span>
              <span>·</span>
              <span>Prisma</span>
              <span>·</span>
              <span>Framer Motion</span>
              <span>·</span>
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
