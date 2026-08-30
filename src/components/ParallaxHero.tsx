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
        
        {/* ----- BACKGROUND: MOVING GRADIENT & GRAIN ----- */}
        <motion.div style={{ y: bgY }} className="pointer-events-none absolute inset-0 z-0 overflow-hidden">
          
          {/* Tekstur Grain */}
          <div 
            className="absolute inset-0 opacity-[0.25] dark:opacity-[0.12]" 
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3%3Ffilter id='noiseFilter'%3%3FeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3%3F/filter%3%3F%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3%3F/svg%3E")`,
            }}
          />

          {/* Orb Gradient 1 (Kuning Soft / Yolk) - Bergerak Memutar/Melayang */}
          <motion.div
            className="absolute left-[15%] top-[10%] size-[55vw] rounded-full opacity-40 blur-[100px] dark:opacity-20"
            style={{
              background: "radial-gradient(circle, rgba(250,204,21,0.8) 0%, rgba(250,204,21,0) 70%)"
            }}
            animate={{
              x: [0, 80, -40, 0],
              y: [0, -60, 40, 0],
              scale: [1, 1.2, 0.9, 1]
            }}
            transition={{
              duration: 12,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />

          {/* Orb Gradient 2 (Aksen Putih/Terang) - Bergerak Lawan Arah */}
          <motion.div
            className="absolute bottom-[10%] right-[15%] size-[45vw] rounded-full opacity-30 blur-[90px] dark:opacity-10"
            style={{
              background: "radial-gradient(circle, rgba(255,255,255,0.9) 0%, rgba(255,255,255,0) 70%)"
            }}
            animate={{
              x: [0, -60, 50, 0],
              y: [0, 50, -30, 0],
              scale: [1, 0.9, 1.1, 1]
            }}
            transition={{
              duration: 15,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
        </motion.div>

        {/* ----- TEKS NAMA BESAR ----- */}
        <motion.div
          style={{ y: nameY, opacity: fadeOut }}
          className="relative z-10 flex w-full select-none flex-col items-center justify-center text-center leading-[0.82]"
        >
          {nameParts.map((word) => (
            <span
              key={word}
              className="block w-full text-center text-[15vw] font-bold uppercase tracking-tight text-foreground sm:text-[12vw] md:text-[9vw]"
              style={{ fontFamily: "'Trobika', 'Bebas Neue', sans-serif" }}
            >
              {word}
            </span>
          ))}
        </motion.div>

        {/* ----- FOTO (PAKAI FLEX CENTER AGAR PASTI DI TENGAH 100%) ----- */}
        <motion.div
          style={{ y: photoY }}
          className="pointer-events-none absolute inset-0 z-20 flex items-end justify-center"
        >
          <div className="relative h-[70%] w-full max-w-2xl sm:h-[78%] md:h-[85%]">
            <Image
              src="/me.png"
              alt={name}
              fill
              priority
              sizes="(max-width: 768px) 100vw, 700px"
              className="object-contain object-bottom"
            />
          </div>
        </motion.div>

        {/* ----- SCROLL LABEL ----- */}
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