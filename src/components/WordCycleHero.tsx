"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform, type MotionValue } from "framer-motion";

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
      className="absolute inset-0 flex items-center justify-center text-center text-[9vw] uppercase leading-none tracking-tight text-foreground sm:text-[8vw] md:text-[7vw] lg:text-[6vw]"
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
    <section ref={containerRef} className="relative w-full bg-background" style={{ height: `${words.length * 70}vh` }}>
      <div className="sticky top-0 flex h-screen w-full flex-col items-center justify-center gap-4 overflow-hidden px-4">
        <p className="text-[11px] uppercase tracking-[0.3em] text-foreground/40 md:text-[13px]">
          Yang saya suka lakukan
        </p>
        <div className="relative h-[12vh] w-full max-w-5xl">
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