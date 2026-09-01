"use client";

import { motion } from "framer-motion";

const ease = [0.22, 1, 0.36, 1] as const;

export interface AboutContent {
  heading: string;
  paragraphs: string[];
  skills: string[];
}

export function About({ content }: { content: AboutContent }) {
  return (
    <section id="about" className="border-t border-foreground/10 px-6 py-28 md:px-14">
      <div className="grid gap-12 md:grid-cols-[0.9fr_1.1fr]">
        <motion.h2
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.7, ease }}
          className="text-[11vw] uppercase leading-[0.9] md:text-[4.2vw]"
          style={{ fontFamily: "'Trobika', 'Bebas Neue', sans-serif" }}
        >
          {content.heading}
        </motion.h2>

        <div>
          {content.paragraphs.map((p, i) => (
            <motion.p
              key={i}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.6, ease, delay: 0.1 * i }}
              className="mb-5 max-w-xl text-[17px] leading-relaxed text-foreground/75"
            >
              {p}
            </motion.p>
          ))}

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6, ease, delay: 0.3 }}
            className="mt-8 flex flex-wrap gap-2"
          >
            {content.skills.map((skill, i) => {
              const palette = [
                "bg-yolk/20 text-yolkDeep",
                "bg-teal/15 text-tealDeep",
                "bg-coral/15 text-coralDeep"
              ];
              return (
                <span
                  key={skill}
                  className={`rounded-full px-4 py-2 text-[13px] uppercase tracking-wide ${palette[i % palette.length]}`}
                >
                  {skill}
                </span>
              );
            })}
          </motion.div>
        </div>
      </div>
    </section>
  );
}