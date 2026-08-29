import Link from "next/link";
import { PlusCircle } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { WritingTable } from "@/components/admin/WritingTable";
import type { WritingDTO } from "@/types";

export const dynamic = "force-dynamic";

async function getWritings(): Promise<WritingDTO[]> {
  const writings = await prisma.writing.findMany({ orderBy: { order: "asc" } });
  return writings.map((w) => ({
    ...w,
    publishedAt: w.publishedAt.toISOString(),
    createdAt: w.createdAt.toISOString(),
    updatedAt: w.updatedAt.toISOString()
  }));
}

export default async function AdminWritingsPage() {
  const writings = await getWritings();

  return (
    <div>
      <div className="mb-8 flex items-center justify-between">
        <div>
          <p className="text-[13px] uppercase tracking-[0.25em] text-ink/50">Dashboard</p>
          <h1
            className="mt-1 text-[32px] uppercase leading-none"
            style={{ fontFamily: "'Trobika', 'Bebas Neue', sans-serif" }}
          >
            Karya Tulis
          </h1>
          <p className="mt-2 text-[14px] text-ink/50">
            {writings.length} tulisan · atur urutan tampil, isi, dan status tayang.
          </p>
        </div>
        <Link
          href="/admin/writings/new"
          className="inline-flex items-center gap-2 rounded-full bg-ink px-5 py-2.5 text-[13px] font-medium uppercase tracking-wide text-cream transition hover:bg-ink/85"
        >
          <PlusCircle className="size-4" />
          Tambah Tulisan
        </Link>
      </div>

      <WritingTable initialWritings={writings} />
    </div>
  );
}
