"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform, type MotionValue } from "framer-motion";

// Section "kata berganti pas di-scroll" — terinspirasi referensi WordHeroPage,
// tapi ditulis ulang supaya di-scope rapi ke section ini saja (versi aslinya
// pakai CSS global yang nimpa tag body/header/footer mentah-mentah, bisa
// ngerusak tampilan section lain di situs ini kalau ditempel apa adanya).
//
// Ganti array `words` di bawah ini buat sesuain sama kata yang kamu mau.
const words = ["merancang.", "membangun.", "men-debug.", "mengoptimasi.", "meluncurkan."];

function WordItem({
  word,
  index,
  total,
  progress
}: {
  word: string;
  index: number;
  total: number;
  progress: MotionValue<number>;
}) {
  const segment = 1 / total;
  const start = index * segment;
  const end = start + segment;
  const fadeEdge = segment * 0.25;

  const opacity = useTransform(
    progress,
    [
      Math.max(0, start - fadeEdge),
      start,
      end - fadeEdge,
      Math.min(1, end)
    ],
    [0, 1, 1, 0]
  );
  const y = useTransform(progress, [start, end], ["30%", "-30%"]);

  return (
    <motion.span
      style={{ opacity, y, fontFamily: "'Trobika', 'Bebas Neue', sans-serif" }}
      className="absolute inset-0 flex items-center justify-center text-[16vw] uppercase leading-none text-foreground sm:text-[12vw] md:text-[8vw]"
    >
      {word}
    </motion.span>
  );
}

export function WordCycleHero() {
  const containerRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  return (
    <section ref={containerRef} className="relative bg-background" style={{ height: `${words.length * 70}vh` }}>
      <div className="sticky top-0 flex h-screen flex-col items-center justify-center gap-6 overflow-hidden px-6">
        <p className="text-[13px] uppercase tracking-[0.3em] text-foreground/40">
          Yang saya suka lakukan
        </p>
        <div className="relative h-[16vw] w-full max-w-4xl sm:h-[12vw] md:h-[8vw]">
          {words.map((word, i) => (
            <WordItem
              key={word}
              word={word}
              index={i}
              total={words.length}
              progress={scrollYProgress}
            />
          ))}
        </div>
      </div>
    </section>
  );
}