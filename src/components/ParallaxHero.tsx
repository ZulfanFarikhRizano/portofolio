"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import Image from "next/image";
import { WarpBackground } from "@/components/ui/warp-background";

// Section pembuka baru: nama besar dengan efek parallax scroll, foto transparan
// (public/me.png) tampil di depan menutupi sebagian teks — mirip referensi
// Osmo, tapi dibangun pakai Framer Motion (sudah dipakai di seluruh situs ini)
// supaya nggak perlu nambah GSAP + Lenis yang bisa bentrok sama animasi lain.
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

  // Tiap layer gerak dengan kecepatan beda selama section di-scroll —
  // ini yang menciptakan ilusi kedalaman (parallax).
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
        className="sticky top-0 flex h-screen w-full items-center justify-center overflow-hidden rounded-none border-0 bg-background p-0"
      >
        {/* OPSIONAL: foto background statis (kalau suatu saat mau ditambah di ATAS
            efek grid WarpBackground, taruh public/bg-parallax.jpg lalu un-comment):
        <div className="pointer-events-none absolute inset-0">
          <Image src="/bg-parallax.jpg" alt="" fill priority className="object-cover opacity-20" />
        </div>
        */}

        {/* Nama besar — dipecah per kata jadi beberapa baris (BUKAN satu baris
            nowrap) supaya nggak pernah overflow ke samping di layar sempit. */}
        <motion.div
          style={{ y: nameY, opacity: fadeOut }}
          className="relative flex select-none flex-col items-center leading-[0.82]"
        >
          {nameParts.map((word) => (
            <span
              key={word}
              className="text-[17vw] uppercase text-foreground sm:text-[13vw] md:text-[10vw]"
              style={{ fontFamily: "'Trobika', 'Bebas Neue', sans-serif" }}
            >
              {word}
            </span>
          ))}
        </motion.div>

        {/* Foto transparan kamu — taruh file di public/me.png.
            Muncul di depan, menutupi sebagian nama, gerak lebih cepat dari teks. */}
        <motion.div
          style={{ y: photoY }}
          className="pointer-events-none absolute bottom-0 h-[78%] w-auto md:h-[85%]"
        >
          <Image
            src="/me.png"
            alt="Zulfan Farikh Rizano"
            width={700}
            height={1000}
            priority
            className="h-full w-auto object-contain object-bottom"
          />
        </motion.div>

        {/* Petunjuk scroll di bawah */}
        <motion.div
          style={{ opacity: fadeOut }}
          className="absolute bottom-8 flex flex-col items-center gap-2 text-[11px] uppercase tracking-[0.3em] text-foreground/40"
        >
          <span>{scrollLabel}</span>
          <span className="h-8 w-px animate-pulse bg-foreground/30" />
        </motion.div>
      </WarpBackground>
    </section>
  );
}