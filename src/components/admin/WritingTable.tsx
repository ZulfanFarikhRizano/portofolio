"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowUp, ArrowDown, Pencil, Trash2, ExternalLink, FileText, FileType } from "lucide-react";
import type { WritingDTO } from "@/types";
import { parseTags } from "@/lib/utils";

export function WritingTable({ initialWritings }: { initialWritings: WritingDTO[] }) {
  const [writings, setWritings] = useState(initialWritings);
  const [busyId, setBusyId] = useState<string | null>(null);
  const router = useRouter();

  async function persistOrder(next: WritingDTO[]) {
    setWritings(next);
    await fetch("/api/writings/reorder", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        order: next.map((w, idx) => ({ id: w.id, order: idx }))
      })
    });
    router.refresh();
  }

  function move(index: number, dir: -1 | 1) {
    const target = index + dir;
    if (target < 0 || target >= writings.length) return;
    const next = [...writings];
    [next[index], next[target]] = [next[target], next[index]];
    persistOrder(next);
  }

  async function togglePublish(writing: WritingDTO) {
    setBusyId(writing.id);
    try {
      const res = await fetch(`/api/writings/${writing.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ published: !writing.published })
      });
      if (res.ok) {
        setWritings((prev) =>
          prev.map((w) => (w.id === writing.id ? { ...w, published: !w.published } : w))
        );
      }
    } finally {
      setBusyId(null);
    }
  }

  async function remove(writing: WritingDTO) {
    if (!confirm(`Hapus tulisan "${writing.title}"? Tindakan ini tidak bisa dibatalkan.`)) return;
    setBusyId(writing.id);
    try {
      const res = await fetch(`/api/writings/${writing.id}`, { method: "DELETE" });
      if (res.ok) {
        setWritings((prev) => prev.filter((w) => w.id !== writing.id));
        router.refresh();
      }
    } finally {
      setBusyId(null);
    }
  }

  if (writings.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-ink/20 px-8 py-16 text-center text-ink/50">
        Belum ada karya tulis. Klik &ldquo;Tambah Tulisan&rdquo; untuk mulai mengisi.
      </div>
    );
  }

  return (
    <div className="overflow-x-auto rounded-2xl border border-ink/10">
  <table className="w-full min-w-[680px] border-collapse text-left text-[14px]">
        <thead>
          <tr className="border-b border-ink/10 bg-ink/[0.03] text-[12px] uppercase tracking-wide text-ink/50">
            <th className="px-4 py-3 font-medium">Urutan</th>
            <th className="px-4 py-3 font-medium">Judul</th>
            <th className="px-4 py-3 font-medium">Tautan</th>
            <th className="px-4 py-3 font-medium">Status</th>
            <th className="px-4 py-3 font-medium text-right">Aksi</th>
          </tr>
        </thead>
        <tbody>
          {writings.map((writing, index) => (
            <tr key={writing.id} className="border-b border-ink/10 last:border-0">
              <td className="px-4 py-3">
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => move(index, -1)}
                    disabled={index === 0}
                    aria-label="Naikkan urutan"
                    className="rounded-md p-1 text-ink/50 transition hover:bg-ink/5 hover:text-ink disabled:opacity-20"
                  >
                    <ArrowUp className="size-4" />
                  </button>
                  <button
                    onClick={() => move(index, 1)}
                    disabled={index === writings.length - 1}
                    aria-label="Turunkan urutan"
                    className="rounded-md p-1 text-ink/50 transition hover:bg-ink/5 hover:text-ink disabled:opacity-20"
                  >
                    <ArrowDown className="size-4" />
                  </button>
                  <span className="ml-1 text-ink/40">{index + 1}</span>
                </div>
              </td>
              <td className="px-4 py-3">
                <p className="font-medium">{writing.title}</p>
                <p className="line-clamp-1 text-[12px] text-ink/50">{writing.excerpt}</p>
                <div className="mt-1 flex flex-wrap gap-1">
                  {parseTags(writing.tags)
                    .slice(0, 3)
                    .map((tag) => (
                      <span key={tag} className="rounded-full bg-ink/5 px-2 py-0.5 text-[11px] text-ink/60">
                        {tag}
                      </span>
                    ))}
                </div>
              </td>
              <td className="px-4 py-3 text-ink/50">
                {writing.pdfUrl ? (
                  <span className="inline-flex items-center gap-1 text-[12px] uppercase tracking-wide">
                    <FileType className="size-3.5" />
                    PDF
                  </span>
                ) : writing.externalUrl ? (
                  <span className="inline-flex items-center gap-1 text-[12px] uppercase tracking-wide">
                    <ExternalLink className="size-3.5" />
                    Eksternal
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 text-[12px] uppercase tracking-wide">
                    <FileText className="size-3.5" />
                    Halaman internal
                  </span>
                )}
              </td>
              <td className="px-4 py-3">
                <button
                  onClick={() => togglePublish(writing)}
                  disabled={busyId === writing.id}
                  className={`rounded-full px-3 py-1 text-[12px] font-medium uppercase tracking-wide transition ${
                    writing.published
                      ? "bg-ink text-cream hover:bg-ink/85"
                      : "bg-ink/5 text-ink/50 hover:bg-ink/10"
                  }`}
                >
                  {writing.published ? "Tayang" : "Draf"}
                </button>
              </td>
              <td className="px-4 py-3">
                <div className="flex items-center justify-end gap-2">
                  <Link
                    href={`/admin/writings/${writing.id}`}
                    className="rounded-md p-2 text-ink/50 transition hover:bg-ink/5 hover:text-ink"
                    aria-label="Edit tulisan"
                  >
                    <Pencil className="size-4" />
                  </Link>
                  <button
                    onClick={() => remove(writing)}
                    disabled={busyId === writing.id}
                    className="rounded-md p-2 text-red-500/70 transition hover:bg-red-500/10 hover:text-red-600"
                    aria-label="Hapus tulisan"
                  >
                    <Trash2 className="size-4" />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
