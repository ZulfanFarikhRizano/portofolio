"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import Image from "next/image";
import { WarpBackground } from "@/components/ui/warp-background";

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
  const photoY = useTransform(scrollYProgress, [0, 1], ["0%", "-55%"]);
  const fadeOut = useTransform(scrollYProgress, [0, 0.75, 1], [1, 1, 0]);

  const nameParts = name.trim().split(/\s+/);

  return (
    <section ref={containerRef} className="relative h-[130vh]">
      <WarpBackground
        beamsPerSide={5}
        beamSize={4}
        beamDuration={5}
        className="sticky top-0 flex h-screen w-full flex-col items-center justify-center overflow-hidden rounded-none border-0 bg-background p-0"
      >
        {/* Teks Nama - Rata Tengah Semurna */}
        <motion.div
          style={{ y: nameY, opacity: fadeOut }}
          className="relative z-0 flex select-none flex-col items-center justify-center text-center leading-[0.82]"
        >
          {nameParts.map((word) => (
            <span
              key={word}
              className="block text-center text-[15vw] font-black uppercase tracking-tight text-foreground sm:text-[12vw] md:text-[9vw]"
              style={{ fontFamily: "'Trobika', 'Bebas Neue', sans-serif" }}
            >
              {word}
            </span>
          ))}
        </motion.div>

        {/* Foto Transparan - Tepat di Tengah (Center Horizon) */}
        <motion.div
          style={{ y: photoY }}
          className="pointer-events-none absolute bottom-0 left-1/2 z-10 h-[80%] -translate-x-1/2 md:h-[88%]"
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

        {/* Label Scroll */}
        <motion.div
          style={{ opacity: fadeOut }}
          className="absolute bottom-6 z-20 flex flex-col items-center gap-2 text-[11px] uppercase tracking-[0.3em] text-foreground/50"
        >
          <span>{scrollLabel}</span>
          <span className="h-8 w-px animate-pulse bg-foreground/30" />
        </motion.div>
      </WarpBackground>
    </section>
  );
}