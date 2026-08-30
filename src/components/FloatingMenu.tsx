"use client";

import { useState, useEffect, useRef, useMemo } from "react";
import { motion } from "framer-motion";
import { TextRoll } from "./TextRoll";

const ease = [0.22, 1, 0.36, 1] as const;

export interface MenuItem {
  label: string;
  onClick?: () => void;
}

export interface FloatingMenuProps {
  items?: MenuItem[];
  buttonLabel?: string;
}

export default function FloatingMenu({ items, buttonLabel = "Menu" }: FloatingMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const defaultItems = useMemo<MenuItem[]>(
    () => [{ label: "Home" }, { label: "Works" }, { label: "Contact" }],
    []
  );

  const menuItems: MenuItem[] = items ?? defaultItems;

  useEffect(() => {
    if (!isOpen) return;
    const handler = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [isOpen]);

  return (
    <motion.div
      ref={containerRef}
      className="fixed bottom-10 left-1/2 z-[100]"
      style={{ x: "-50%", pointerEvents: "auto" }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease }}
    >
      <motion.div
        className="relative overflow-hidden flex flex-col"
        onClick={() => {
          if (!isOpen) setIsOpen(true);
        }}
        style={{
          fontFamily: "'Aeonik TRIAL', 'Inter', sans-serif",
          letterSpacing: "-0.02em",
          cursor: isOpen ? "default" : "pointer"
        }}
        animate={{
          width: isOpen ? 280 : 150,
          height: isOpen ? 320 : 48,
          borderRadius: isOpen ? 32 : 72,
          scale: 1
        }}
        whileHover={isOpen ? undefined : { scale: 1.05 }}
        transition={{
          duration: 0.8,
          ease,
          height: { duration: isOpen ? 0.8 : 0.15 },
          scale: { duration: 0.25, ease }
        }}
      >
        <motion.div
          className="absolute inset-0"
          animate={{
            backgroundColor: isOpen ? "#FFE862" : "#FFE862",
            borderColor: isOpen ? "#FFE862" : "#d1bb3b"
          }}
          transition={{ duration: isOpen ? 0.1 : 0.3, ease }}
          style={{
            borderWidth: 1,
            borderStyle: "solid",
            borderRadius: "inherit"
          }}
        />

        <motion.div
          className="absolute left-1/2 bg-[#242424]"
          style={{
            width: "200%",
            height: "200%",
            borderRadius: "50%",
            x: "-50%"
          }}
          animate={{ bottom: isOpen ? "-20%" : "-200%" }}
          transition={{
            duration: 0.8,
            ease,
            delay: isOpen ? 0.1 : 0
          }}
        />

        <div
          className="relative z-10 flex flex-col gap-6 items-center justify-center"
          style={{
            pointerEvents: isOpen ? "auto" : "none",
            opacity: isOpen ? 1 : 0,
            flex: isOpen ? 1 : 0,
            overflow: "hidden"
          }}
        >
          {menuItems.map((item, idx) => (
            <TextRoll key={`${item.label}-${idx}`} isOpen={isOpen} index={idx} onClick={item.onClick}>
              {item.label}
            </TextRoll>
          ))}
        </div>

        <motion.div
          className="relative z-10 flex items-center justify-between w-full shrink-0 cursor-pointer"
          onClick={(e) => {
            e.stopPropagation();
            setIsOpen((prev) => !prev);
          }}
          animate={{
            paddingLeft: isOpen ? 24 : 20,
            paddingRight: isOpen ? 24 : 20,
            paddingBottom: isOpen ? 24 : 0,
            height: 48
          }}
          transition={{ duration: 0.8, ease }}
          style={{ alignItems: "center" }}
        >
          <motion.span
            className="text-[14px] md:text-[20px] leading-none select-none"
            animate={{ color: isOpen ? "#f7f1ed" : "#242424" }}
            transition={{ duration: 0.3, ease }}
          >
            Menu
          </motion.span>
          <div className="relative w-[24px] h-[24px] flex items-center justify-center">
            <motion.span
              className="absolute block w-[18px] h-[2px] rounded-full"
              animate={{
                rotate: isOpen ? 45 : 0,
                y: isOpen ? 0 : -3,
                backgroundColor: isOpen ? "#f7f1ed" : "#242424"
              }}
              transition={{ duration: 0.4, ease }}
            />
            <motion.span
              className="absolute block w-[18px] h-[2px] rounded-full"
              animate={{
                rotate: isOpen ? -45 : 0,
                y: isOpen ? 0 : 3,
                backgroundColor: isOpen ? "#f7f1ed" : "#242424"
              }}
              transition={{ duration: 0.4, ease }}
            />
          </div>
        </motion.div>
      </motion.div>
    </motion.div>
  );
}
