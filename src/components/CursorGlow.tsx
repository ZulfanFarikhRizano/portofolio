"use client";

import { useEffect, useState } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";

// Spotlight warna-warni yang ngikutin posisi mouse dengan sedikit "lag" pegas
// (spring), biar kerasa hidup bukan nempel kaku. Cuma aktif di desktop (device
// dengan mouse asli) — di HP/tablet nggak ada cursor jadi otomatis nggak dirender.
export function CursorGlow() {
  const [enabled, setEnabled] = useState(false);
  const mouseX = useMotionValue(-200);
  const mouseY = useMotionValue(-200);
  const springX = useSpring(mouseX, { damping: 25, stiffness: 150, mass: 0.5 });
  const springY = useSpring(mouseY, { damping: 25, stiffness: 150, mass: 0.5 });

  useEffect(() => {
    const hasFinePointer = window.matchMedia("(pointer: fine)").matches;
    setEnabled(hasFinePointer);
    if (!hasFinePointer) return;

    function handleMove(e: MouseEvent) {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
    }
    window.addEventListener("mousemove", handleMove);
    return () => window.removeEventListener("mousemove", handleMove);
  }, [mouseX, mouseY]);

  if (!enabled) return null;

  return (
    <motion.div
      aria-hidden="true"
      className="pointer-events-none fixed left-0 top-0 z-[60] size-[480px] rounded-full mix-blend-multiply dark:mix-blend-screen"
      style={{
        x: springX,
        y: springY,
        translateX: "-50%",
        translateY: "-50%",
        background:
          "radial-gradient(circle, hsl(51 100% 71% / 0.18) 0%, hsl(162 65% 55% / 0.10) 45%, transparent 72%)"
      }}
    />
  );
}