"use client";

import { motion } from "framer-motion";
import { ArrowUpRight, Mail } from "lucide-react";

const ease = [0.22, 1, 0.36, 1] as const;

export interface ContactContent {
  heading: string;
  email: string;
  socials: { label: string; url: string }[];
}

export function Contact({
  content,
  footerText
}: {
  content: ContactContent;
  footerText: string;
}) {
  return (
    <section id="contact" className="border-t border-ink/10 bg-ink px-6 py-28 text-cream md:px-14">
      <motion.p
        initial={{ opacity: 0, y: 12 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.6, ease }}
        className="text-[13px] uppercase tracking-[0.25em] text-cream/50"
      >
        {content.heading}
      </motion.p>

      <motion.a
        href={`mailto:${content.email}`}
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.7, ease, delay: 0.1 }}
        className="mt-6 flex items-center gap-4 text-[9vw] uppercase leading-none tracking-tight transition hover:opacity-80 md:text-[4vw]"
        style={{
        fontFamily: "'Trobika', 'Bebas Neue', sans-serif",
        wordBreak: "break-all",
        overflowWrap: "anywhere"
        }}
      >
        <Mail className="size-[0.6em]" />
        {content.email}
      </motion.a>

      <div className="mt-16 flex flex-wrap gap-x-10 gap-y-4">
        {content.socials.map((s, i) => (
          <motion.a
            key={s.label}
            href={s.url}
            target="_blank"
            rel="noopener noreferrer"
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.5, ease, delay: 0.05 * i }}
            className="inline-flex items-center gap-1.5 text-[14px] uppercase tracking-wide text-cream/70 transition hover:text-cream"
          >
            {s.label}
            <ArrowUpRight className="size-3.5" />
          </motion.a>
        ))}
      </div>

      <p className="mt-24 text-[12px] uppercase tracking-[0.2em] text-cream/30">
        © {new Date().getFullYear()} · {footerText}
      </p>
    </section>
  );
}
