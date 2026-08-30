"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowUpRight, FileText } from "lucide-react";
import type { WritingDTO } from "@/types";
import { parseTags } from "@/lib/utils";

const ease = [0.22, 1, 0.36, 1] as const;

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric"
  });
}

export function WritingsSection({
  writings,
  eyebrow,
  heading
}: {
  writings: WritingDTO[];
  eyebrow: string;
  heading: string;
}) {
  if (writings.length === 0) return null;

  return (
    <section id="writings" className="border-t border-foreground/10 px-6 py-28 md:px-14">
      <div className="mb-14">
        <p className="text-[13px] uppercase tracking-[0.25em] text-foreground/50">Karya Tulis</p>
        <h2
          className="mt-3 text-[10vw] uppercase leading-[0.9] md:text-[4.2vw]"
          style={{ fontFamily: "'Trobika', 'Bebas Neue', sans-serif" }}
        >
          {heading}
        </h2>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {writings.map((writing, i) => {
          const hasPdf = Boolean(writing.pdfUrl);
          const href = hasPdf ? `/tulisan/${writing.slug}` : writing.externalUrl || `/tulisan/${writing.slug}`;
          const isExternal = !hasPdf && Boolean(writing.externalUrl);
          const actionLabel = hasPdf ? "Baca PDF" : isExternal ? "Baca di sumber" : "Baca tulisan";

          const Card = (
            <motion.article
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.6, ease, delay: 0.05 * (i % 4) }}
              className="group flex h-full flex-col justify-between rounded-2xl border border-foreground/10 p-6 transition hover:border-foreground/30"
            >
              <div>
                <div className="flex items-center gap-2 text-[12px] uppercase tracking-wide text-foreground/40">
                  <FileText className="size-3.5" />
                  {formatDate(writing.publishedAt)}
                </div>
                <h3 className="mt-3 text-[22px] font-medium leading-snug">{writing.title}</h3>
                <p className="mt-2 text-[14px] leading-relaxed text-foreground/65">{writing.excerpt}</p>
              </div>

              <div className="mt-6 flex items-center justify-between">
                {parseTags(writing.tags).length > 0 && (
                  <div className="flex flex-wrap gap-1.5">
                    {parseTags(writing.tags)
                      .slice(0, 3)
                      .map((tag) => (
                        <span
                          key={tag}
                          className="rounded-full bg-foreground/5 px-2.5 py-1 text-[11px] uppercase tracking-wide text-foreground/55"
                        >
                          {tag}
                        </span>
                      ))}
                  </div>
                )}
                <span className="inline-flex items-center gap-1 text-[13px] font-medium uppercase tracking-wide text-foreground/70 transition group-hover:text-foreground">
                  {actionLabel}
                  <ArrowUpRight className="size-3.5" />
                </span>
              </div>
            </motion.article>
          );

          return isExternal ? (
            <a key={writing.id} href={href} target="_blank" rel="noopener noreferrer">
              {Card}
            </a>
          ) : (
            <Link key={writing.id} href={href}>
              {Card}
            </Link>
          );
        })}
      </div>
    </section>
  );
}
