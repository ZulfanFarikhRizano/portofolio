import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ExternalLink } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { parseTags } from "@/lib/utils";

export const dynamic = "force-dynamic";

function formatDate(date: Date) {
  return date.toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" });
}

export default async function WritingDetailPage({ params }: { params: { slug: string } }) {
  const writing = await prisma.writing.findUnique({ where: { slug: params.slug } });

  if (!writing || !writing.published) notFound();

  const hasPdf = Boolean(writing.pdfUrl);

  return (
    <main className={`mx-auto px-6 py-20 md:px-0 ${hasPdf ? "max-w-4xl" : "max-w-2xl"}`}>
      <Link
        href="/#writings"
        className="inline-flex items-center gap-2 text-[13px] uppercase tracking-wide text-foreground/50 transition hover:text-foreground"
      >
        <ArrowLeft className="size-4" />
        Kembali
      </Link>

      <p className="mt-8 text-[13px] uppercase tracking-[0.25em] text-foreground/50">
        {formatDate(writing.publishedAt)}
      </p>
      <h1
        className="mt-3 text-[9vw] uppercase leading-[0.95] md:text-[3.4vw]"
        style={{ fontFamily: "'Trobika', 'Bebas Neue', sans-serif" }}
      >
        {writing.title}
      </h1>
      <p className="mt-4 max-w-xl text-[15px] leading-relaxed text-foreground/65">{writing.excerpt}</p>

      {parseTags(writing.tags).length > 0 && (
        <div className="mt-5 flex flex-wrap gap-2">
          {parseTags(writing.tags).map((tag) => (
            <span
              key={tag}
              className="rounded-full bg-foreground/5 px-3 py-1 text-[12px] uppercase tracking-wide text-foreground/60"
            >
              {tag}
            </span>
          ))}
        </div>
      )}

      {hasPdf ? (
        <div className="mt-10">
          <div className="mb-3 flex items-center justify-between">
            <p className="text-[12px] uppercase tracking-wide text-foreground/45">Dokumen PDF</p>
            <a
              href={writing.pdfUrl!}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-[13px] text-foreground/60 underline decoration-foreground/25 underline-offset-2 transition hover:text-foreground"
            >
              Buka di tab baru
              <ExternalLink className="size-3.5" />
            </a>
          </div>
          {/* Dirender inline lewat viewer PDF bawaan browser — pengunjung bisa baca
              langsung tanpa perlu mengunduh filenya. */}
          <iframe
            src={`${writing.pdfUrl}#view=FitH`}
            title={writing.title}
            className="h-[75vh] w-full rounded-2xl border border-foreground/10"
          />
          <p className="mt-3 text-[12px] text-foreground/40">
            Kalau dokumen tidak tampil (mis. di sebagian browser mobile), gunakan tautan &ldquo;Buka di tab
            baru&rdquo; di atas.
          </p>
        </div>
      ) : (
        <div className="prose prose-neutral mt-10 max-w-none text-[17px] leading-relaxed text-foreground/85">
          {(writing.content || writing.excerpt).split(/\n{2,}/).map((paragraph, i) => (
            <p key={i} className="mb-5">
              {paragraph}
            </p>
          ))}
        </div>
      )}
    </main>
  );
}
