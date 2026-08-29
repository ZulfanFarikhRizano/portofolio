"use client";

import React, { useState, useCallback, useRef, useEffect, useMemo } from "react";
import { motion } from "framer-motion";

export interface TextRollProps {
  children: string;
  isOpen: boolean;
  index: number;
  className?: string;
  onClick?: () => void;
}

export function TextRoll({
  children,
  isOpen,
  index,
  className,
  onClick
}: TextRollProps) {
  const [hovered, setHovered] = useState(false);
  const animatingRef = useRef(false);
  const pendingLeaveRef = useRef(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const chars = useMemo(() => children.split(""), [children]);
  const lockDuration = useMemo(() => 30 * chars.length + 300, [chars.length]);

  const handleEnter = useCallback(() => {
    pendingLeaveRef.current = false;
    if (hovered) return;
    setHovered(true);
    animatingRef.current = true;
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => {
      animatingRef.current = false;
      if (pendingLeaveRef.current) {
        pendingLeaveRef.current = false;
        setHovered(false);
      }
    }, lockDuration);
  }, [hovered, lockDuration]);

  const handleLeave = useCallback(() => {
    if (animatingRef.current) {
      pendingLeaveRef.current = true;
    } else {
      setHovered(false);
    }
  }, []);

  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  const ease = [0.22, 1, 0.36, 1] as const;

  return (
    <motion.button
      type="button"
      onClick={onClick}
      onMouseEnter={handleEnter}
      onMouseLeave={handleLeave}
      className={
        className ??
        "text-[#f7f1ed] text-[24px] uppercase leading-none overflow-hidden cursor-pointer"
      }
      style={{
        fontFamily: "'Trobika', 'Bebas Neue', sans-serif",
        letterSpacing: "-0.03em",
        height: "1em"
      }}
      animate={{ opacity: isOpen ? 1 : 0 }}
      transition={{
        duration: 0.4,
        delay: isOpen ? 0.4 + 0.08 * index : 0,
        ease
      }}
    >
      <div className="flex justify-center">
        {chars.map((char, i) => (
          <span key={`${char}-${i}`} className="inline-block overflow-hidden" style={{ height: "1em" }}>
            <span
              className="flex flex-col"
              style={{
                transitionProperty: "transform",
                transitionDuration: hovered ? "800ms" : "0ms",
                transitionDelay: hovered ? `${30 * i}ms` : "0ms",
                transform: hovered ? "translateY(-50%)" : "translateY(0%)",
                transitionTimingFunction: "cubic-bezier(0.22, 1, 0.36, 1)"
              }}
            >
              <span className="block" style={{ height: "1em", lineHeight: "1em" }}>
                {char}
              </span>
              <span className="block" style={{ height: "1em", lineHeight: "1em" }} aria-hidden>
                {char}
              </span>
            </span>
          </span>
        ))}
      </div>
    </motion.button>
  );
}
