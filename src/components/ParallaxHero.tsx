"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import Image from "next/image";

interface ParallaxHeroProps {
  name: string;
  scrollLabel: string;
}

export function ParallaxHero({ name, scrollLabel }: ParallaxHeroProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"]
  });

  const nameY = useTransform(scrollYProgress, [0, 1], ["0%", "-25%"]);
  const photoY = useTransform(scrollYProgress, [0, 1], ["0%", "-45%"]);
  const bgY = useTransform(scrollYProgress, [0, 1], ["0%", "-10%"]);
  const fadeOut = useTransform(scrollYProgress, [0, 0.75, 1], [1, 1, 0]);

  const nameParts = name.trim().split(/\s+/);

  return (
    <section ref={containerRef} className="relative h-[130vh] w-full overflow-hidden">
      <div className="sticky top-0 flex h-screen w-full items-center justify-center overflow-hidden bg-background">
        
        {/* Background Animasi Orb */}
        <motion.div style={{ y: bgY }} className="pointer-events-none absolute inset-0 z-0 overflow-hidden">
          <motion.div
            className="absolute left-[10%] top-[15%] size-[60vw] rounded-full bg-yolk/25 blur-[90px] md:size-[38vw] dark:bg-yolk/15"
            animate={{
              x: [0, 40, -20, 0],
              y: [0, -30, 20, 0],
              scale: [1, 1.15, 0.95, 1]
            }}
            transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
          />
          <motion.div
            className="absolute bottom-[10%] right-[8%] size-[50vw] rounded-full bg-foreground/[0.06] blur-[100px] md:size-[32vw]"
            animate={{
              x: [0, -35, 25, 0],
              y: [0, 25, -25, 0],
              scale: [1, 0.9, 1.1, 1]
            }}
            transition={{ duration: 22, repeat: Infinity, ease: "easeInOut" }}
          />
        </motion.div>

        {/* Nama Besar - Center Alignment */}
        <motion.div
          style={{ y: nameY, opacity: fadeOut }}
          className="relative z-10 flex w-full select-none flex-col items-center justify-center text-center leading-[0.85]"
        >
          {nameParts.map((word) => (
            <span
              key={word}
              className="block w-full text-center text-[13vw] font-bold uppercase tracking-tight text-foreground sm:text-[11vw] md:text-[9vw]"
              style={{ fontFamily: "'Trobika', 'Bebas Neue', sans-serif" }}
            >
              {word}
            </span>
          ))}
        </motion.div>

        {/* Foto Transparan - Terkunci di Tengah Layar */}
        <motion.div
          style={{ y: photoY }}
          className="pointer-events-none absolute bottom-0 left-1/2 z-20 h-[65%] w-auto -translate-x-1/2 sm:h-[75%] md:h-[82%]"
        >
          <Image
            src="/me.png"
            alt={name}
            width={700}
            height={1000}
            priority
            className="h-full w-auto object-contain object-bottom"
          />
        </motion.div>

        {/* Petunjuk Scroll */}
        <motion.div
          style={{ opacity: fadeOut }}
          className="absolute bottom-6 z-30 flex flex-col items-center gap-2 text-[10px] uppercase tracking-[0.3em] text-foreground/40 md:text-[11px]"
        >
          <span>{scrollLabel}</span>
          <span className="h-6 w-px animate-pulse bg-foreground/30 md:h-8" />
        </motion.div>

      </div>
    </section>
  );
}