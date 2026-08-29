"use client";

import { useRef, useEffect, useState, useCallback } from "react";
import { motion, useScroll, useTransform, useSpring } from "framer-motion";
import Image from "next/image";

// Tipe untuk partikel background
type Particle = {
  id: number;
  baseX: number;
  baseY: number;
  currentX: number;
  currentY: number;
  size: number;
  opacity: number;
  driftSpeed: number;
};

export function ParallaxHero() {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Menyimpan posisi mouse untuk interaksi
  const mouse = useRef({ x: 0, y: 0 });

  // State untuk melacak ukuran partikel yang dinamis
  const [particleConfig, setParticleConfig] = useState({ count: 80, gridSize: 60 });

  // 1. Logika Parallax Scroll
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"],
  });

  const nameY = useTransform(scrollYProgress, [0, 1], ["0%", "-25%"]);
  const photoY = useTransform(scrollYProgress, [0, 1], ["0%", "-55%"]);

  const bgYSpring = useSpring(useTransform(scrollYProgress, [0, 1], ["0%", "-15%"]), {
    stiffness: 100,
    damping: 30,
  });

  const fadeOut = useTransform(scrollYProgress, [0, 0.75, 1], [1, 1, 0]);
  const nameParts = "ZULFAN FARIKH RIZANO";

  // 2. Logika Background Canvas Partikel
  const updateParticleConfig = useCallback(() => {
    if (typeof window !== "undefined") {
      const isMobile = window.innerWidth < 640;
      setParticleConfig({
        count: isMobile ? 50 : 120,
        gridSize: isMobile ? 80 : 60,
      });
    }
  }, []);

  useEffect(() => {
    updateParticleConfig();
    window.addEventListener("resize", updateParticleConfig);
    return () => window.removeEventListener("resize", updateParticleConfig);
  }, [updateParticleConfig]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;
    let particles: Particle[] = [];

    const initParticles = () => {
      particles = [];
      const { count, gridSize } = particleConfig;
      for (let i = 0; i < count; i++) {
        const x = ((i * gridSize) % canvas.width) + Math.random() * (gridSize / 2);
        const y = Math.floor((i * gridSize) / canvas.width) * gridSize + Math.random() * (gridSize / 2);

        if (x <= canvas.width && y <= canvas.height) {
          particles.push({
            id: i,
            baseX: x,
            baseY: y,
            currentX: x,
            currentY: y,
            size: Math.random() * 1.5 + 0.5,
            opacity: Math.random() * 0.3 + 0.1,
            driftSpeed: Math.random() * 0.05 + 0.02,
          });
        }
      }
    };

    const resizeCanvas = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
      initParticles();
    };

    const animate = (time: number) => {
      if (!ctx || !canvas) return;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const interactionRadius = 150;
      const isMobile = window.innerWidth < 640;

      // Mengambil style warna teks dari root HTML agar aman
      const style = getComputedStyle(document.documentElement);
      const rawFg = style.getPropertyValue("--foreground").trim();

      particles.forEach((p) => {
        p.currentX += Math.sin(time * p.driftSpeed * 0.1) * 0.1;
        p.currentY += Math.cos(time * p.driftSpeed * 0.1) * 0.1;

        if (!isMobile) {
          const dx = mouse.current.x - p.currentX;
          const dy = mouse.current.y - p.currentY;
          const distance = Math.sqrt(dx * dx + dy * dy);

          if (distance < interactionRadius) {
            const force = (interactionRadius - distance) / interactionRadius;
            const angle = Math.atan2(dy, dx);
            const moveX = Math.cos(angle) * force * 30;
            const moveY = Math.sin(angle) * force * 30;

            p.currentX -= moveX;
            p.currentY -= moveY;
          } else {
            p.currentX += (p.baseX - p.currentX) * 0.02;
            p.currentY += (p.baseY - p.currentY) * 0.02;
          }
        }

        ctx.beginPath();
        ctx.arc(p.currentX, p.currentY, p.size, 0, Math.PI * 2);

        // Fallback aman untuk fillStyle canvas
        if (rawFg.includes("%")) {
          ctx.fillStyle = `hsl(${rawFg} / ${p.opacity})`;
        } else if (rawFg) {
          ctx.fillStyle = `rgba(${rawFg}, ${p.opacity})`;
        } else {
          ctx.fillStyle = `rgba(255, 255, 255, ${p.opacity})`;
        }
        
        ctx.fill();
      });

      animationFrameId = requestAnimationFrame(animate);
    };

    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    const handleMouseMove = (event: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouse.current.x = event.clientX - rect.left;
      mouse.current.y = event.clientY - rect.top;
    };
    window.addEventListener("mousemove", handleMouseMove);

    animate(0);

    return () => {
      window.removeEventListener("resize", resizeCanvas);
      window.removeEventListener("mousemove", handleMouseMove);
      cancelAnimationFrame(animationFrameId);
    };
  }, [particleConfig]);

  return (
    <section ref={containerRef} className="relative h-[130vh]">
      <div className="sticky top-0 flex h-screen items-center justify-center overflow-hidden bg-background">
        
        {/* Layer 0: Canvas Grid Partikel */}
        <motion.div
          style={{ y: bgYSpring }}
          className="pointer-events-none absolute inset-0 -z-10"
        >
          <canvas
            ref={canvasRef}
            className="h-full w-full opacity-60"
          />
        </motion.div>

        {/* Layer 1: Gradient Overlay */}
        <motion.div
          style={{ y: bgYSpring }}
          className="pointer-events-none absolute inset-0 bg-gradient-to-b from-foreground/[0.06] via-transparent to-transparent"
        />

        {/* Layer 2: Nama */}
        <motion.div
          style={{ y: nameY, opacity: fadeOut }}
          className="absolute inset-0 flex select-none items-center justify-center px-2"
        >
          <span
            className="whitespace-nowrap text-center text-[7.2vw] uppercase leading-none text-foreground sm:text-[6vw] md:text-[4.6vw] lg:text-[4vw]"
            style={{ fontFamily: "'Trobika', 'Bebas Neue', sans-serif" }}
          >
            {nameParts}
          </span>
        </motion.div>

        {/* Layer 3: Foto */}
        <motion.div
          style={{ y: photoY }}
          className="pointer-events-none absolute bottom-0 h-[52%] w-auto sm:h-[58%] md:h-[64%]"
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

        {/* Layer 4: Petunjuk Scroll */}
        <motion.div
          style={{ opacity: fadeOut }}
          className="absolute bottom-8 flex flex-col items-center gap-2 text-[11px] uppercase tracking-[0.3em] text-foreground/40"
        >
          <span>Scroll</span>
          <span className="h-8 w-px animate-pulse bg-foreground/30" />
        </motion.div>

      </div>
    </section>
  );
}