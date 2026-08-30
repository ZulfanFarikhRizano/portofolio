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
        
        {/* ----- BACKGROUND: MOVING GRADIENT + GRAIN TEXTURE ----- */}
        <motion.div style={{ y: bgY }} className="pointer-events-none absolute inset-0 z-0 overflow-hidden">
          
          {/* 1. Tekstur Grain/Noise (Adaptif Light/Dark) */}
          <div 
            className="absolute inset-0 opacity-[0.2] dark:opacity-[0.1]" 
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3%3Ffilter id='noiseFilter'%3%3FeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='3' stitchTiles='stitch'/%3%3F/filter%3%3F%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3%3F/svg%3E")`,
              filter: 'contrast(120%) brightness(120%)',
            }}
          />

          {/* 2. Fluid Moving Gradient Orbs */}
          {/* Orb Kuning (Yolk) - Bergerak Organik */}
          <motion.div
            className="absolute left-[-20%] top-[-20%] size-[140%] rounded-full opacity-[0.35] dark:opacity-[0.25]"
            style={{
              background: `radial-gradient(circle at center, ${`var(--yolk)`}, transparent 60%)`,
              filter: 'blur(110px)',
            }}
            animate={{
              x: [0, 50, -30, 0], // Pergerakan horizontal
              y: [0, -40, 30, 0], // Pergerakan vertikal
            }}
            transition={{
              duration: 25, // Lambat dan halus
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />

          {/* Orb Foreground (Pudar) - Bergerak Berlawanan Arah */}
          <motion.div
            className="absolute bottom-[-10%] right-[-10%] size-[100%] rounded-full opacity-[0.1] dark:opacity-[0.05]"
            style={{
              background: `radial-gradient(circle at center, currentColor, transparent 70%)`,
              filter: 'blur(100px)',
            }}
            animate={{
              x: [0, -40, 50, 0],
              y: [0, 30, -40, 0],
            }}
            transition={{
              duration: 22,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        </motion.div>

        {/* ----- NAMA BESAR (Editorial Typography) ----- */}
        <motion.div
          style={{ y: nameY, opacity: fadeOut }}
          className="relative z-10 flex w-full select-none flex-col items-center justify-center text-center leading-[0.85]"
        >
          {nameParts.map((word) => (
            <span
              key={word}
              className="block w-full text-center text-[14vw] uppercase tracking-[-0.03em] text-foreground sm:text-[12vw] md:text-[9vw]"
              style={{ fontFamily: "'Trobika', 'Bebas Neue', sans-serif" }}
            >
              {word}
            </span>
          ))}
        </motion.div>

        {/* ----- FOTO PRESISI DI TENGAH ----- */}
        <motion.div
          style={{ y: photoY }}
          className="pointer-events-none absolute bottom-0 left-1/2 z-20 h-[70%] w-auto -translate-x-1/2 sm:h-[78%] md:h-[85%]"
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

        {/* ----- PETUNJUK SCROLL ----- */}
        <motion.div
          style={{ opacity: fadeOut }}
          className="absolute bottom-8 z-30 flex flex-col items-center gap-2 text-[11px] uppercase tracking-[0.3em] text-foreground/40 md:text-[11px]"
        >
          <span>{scrollLabel}</span>
          <span className="h-8 w-px animate-pulse bg-foreground/30" />
        </motion.div>

      </div>
    </section>
  );
}