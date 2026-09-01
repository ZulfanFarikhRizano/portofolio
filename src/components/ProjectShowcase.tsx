"use client";

import { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ExternalLink, Github, Figma as FigmaIcon } from "lucide-react";
import { CoverflowCarousel, type CoverflowSlide } from "./CoverflowCarousel";
import { Reveal } from "./Reveal";
import type { ProjectDTO } from "@/types";
import { parseTags } from "@/lib/utils";

const ease = [0.22, 1, 0.36, 1] as const;

export function ProjectShowcase({
  projects,
  eyebrow,
  heading
}: {
  projects: ProjectDTO[];
  eyebrow: string;
  heading: string;
}) {
  const [active, setActive] = useState(0);

  const slides: CoverflowSlide[] = useMemo(
    () =>
      projects.map((p) => ({
        src: p.bannerImage,
        alt: p.title,
        title: p.title,
        subtitle: p.subtitle ?? undefined
      })),
    [projects]
  );

  const current = projects[active];

  if (projects.length === 0) {
    return (
      <section id="works" className="px-6 py-28 md:px-14">
        <p className="text-foreground/50">Belum ada proyek yang dipublikasikan.</p>
      </section>
    );
  }

  return (
    <section id="works" className="relative px-0 py-28 md:px-0">
      <Reveal className="mb-10 px-6 md:px-14">
        <p className="flex items-center gap-2 text-[13px] uppercase tracking-[0.25em] text-foreground/50">
          <span className="size-1.5 rounded-full bg-teal" />
          {eyebrow}
        </p>
        <h2
          className="mt-3 text-[10vw] uppercase leading-[0.9] md:text-[4.2vw]"
          style={{ fontFamily: "'Trobika', 'Bebas Neue', sans-serif" }}
        >
          {heading}
        </h2>
      </Reveal>

      <CoverflowCarousel
        slides={slides}
        onSelect={setActive}
        showNavigation
        showPagination
        cardWidth="clamp(200px, 34vw, 420px)"
        cardClassName="rounded-3xl"
      />

      <div className="mx-auto mt-14 max-w-xl px-6 md:px-14">
        <AnimatePresence mode="wait">
          <motion.div
            key={current.id}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            transition={{ duration: 0.4, ease }}
            className="text-center"
          >
            <h3 className="text-[26px] font-medium">{current.title}</h3>
            {current.subtitle && <p className="mt-1 text-foreground/60">{current.subtitle}</p>}
            <p className="mx-auto mt-4 max-w-md text-[15px] leading-relaxed text-foreground/70">
              {current.description}
            </p>

            {parseTags(current.tags).length > 0 && (
              <div className="mt-5 flex flex-wrap items-center justify-center gap-2">
                {parseTags(current.tags).map((tag) => (
                  <span
                    key={tag}
                    className="rounded-full border border-foreground/15 px-3 py-1 text-[12px] uppercase tracking-wide text-foreground/60"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}

            <div className="mt-7 flex flex-wrap items-center justify-center gap-3">
              {current.liveUrl && (
                <a
                  href={current.liveUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-full bg-foreground px-5 py-2.5 text-[13px] font-medium uppercase tracking-wide text-background transition hover:opacity-85"
                >
                  <ExternalLink className="size-4" />
                  Live Demo
                </a>
              )}
              {current.githubUrl && (
                <a
                  href={current.githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-full border border-foreground/20 px-5 py-2.5 text-[13px] font-medium uppercase tracking-wide text-foreground transition hover:border-foreground/50"
                >
                  <Github className="size-4" />
                  GitHub
                </a>
              )}
              {current.figmaUrl && (
                <a
                  href={current.figmaUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-full border border-foreground/20 px-5 py-2.5 text-[13px] font-medium uppercase tracking-wide text-foreground transition hover:border-foreground/50"
                >
                  <FigmaIcon className="size-4" />
                  Figma
                </a>
              )}
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
}