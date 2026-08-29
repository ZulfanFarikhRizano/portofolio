"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, UploadCloud, FileText, ExternalLink } from "lucide-react";
import type { WritingDTO, WritingInput } from "@/types";

interface WritingFormProps {
  mode: "create" | "edit";
  initialData?: WritingDTO;
}

function toDateInputValue(iso?: string) {
  if (!iso) return new Date().toISOString().slice(0, 10);
  return new Date(iso).toISOString().slice(0, 10);
}

const emptyForm: WritingInput = {
  title: "",
  excerpt: "",
  content: "",
  pdfUrl: "",
  coverImage: "",
  tags: "",
  externalUrl: "",
  published: true
};

export function WritingForm({ mode, initialData }: WritingFormProps) {
  const router = useRouter();
  const [form, setForm] = useState<WritingInput>(
    initialData
      ? {
          title: initialData.title,
          slug: initialData.slug,
          excerpt: initialData.excerpt,
          content: initialData.content ?? "",
          pdfUrl: initialData.pdfUrl ?? "",
          coverImage: initialData.coverImage ?? "",
          tags: initialData.tags,
          externalUrl: initialData.externalUrl ?? "",
          publishedAt: initialData.publishedAt,
          published: initialData.published
        }
      : emptyForm
  );
  const [dateValue, setDateValue] = useState(toDateInputValue(initialData?.publishedAt));
  const [uploadingPdf, setUploadingPdf] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function update<K extends keyof WritingInput>(key: K, value: WritingInput[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  async function handlePdfUpload(file: File) {
    setUploadingPdf(true);
    setError(null);
    try {
      const body = new FormData();
      body.append("file", file);
      const res = await fetch("/api/upload/pdf", { method: "POST", body });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error ?? "Gagal mengunggah PDF.");
      update("pdfUrl", json.data.url);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Gagal mengunggah PDF.");
    } finally {
      setUploadingPdf(false);
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError(null);
    try {
      const url = mode === "create" ? "/api/writings" : `/api/writings/${initialData!.id}`;
      const method = mode === "create" ? "POST" : "PUT";
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, publishedAt: new Date(dateValue).toISOString() })
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error ?? "Gagal menyimpan tulisan.");
      router.push("/admin/writings");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Gagal menyimpan tulisan.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-2xl space-y-6">
      {error && (
        <div className="rounded-xl border border-red-300 bg-red-50 px-4 py-3 text-[14px] text-red-700">
          {error}
        </div>
      )}

      <div>
        <label className="mb-1.5 block text-[13px] font-medium uppercase tracking-wide text-ink/60">
          Judul *
        </label>
        <input
          required
          value={form.title}
          onChange={(e) => update("title", e.target.value)}
          className="w-full rounded-xl border border-ink/15 bg-white px-4 py-2.5 text-[15px] outline-none focus:border-ink/40"
          placeholder="mis. Merancang Diagram Swimlane untuk Sistem Multi-Aktor"
        />
      </div>

      <div>
        <label className="mb-1.5 block text-[13px] font-medium uppercase tracking-wide text-ink/60">
          Ringkasan *
        </label>
        <textarea
          required
          rows={2}
          value={form.excerpt}
          onChange={(e) => update("excerpt", e.target.value)}
          className="w-full rounded-xl border border-ink/15 bg-white px-4 py-2.5 text-[15px] outline-none focus:border-ink/40"
          placeholder="1-2 kalimat, tampil di kartu daftar tulisan"
        />
      </div>

      <div>
        <label className="mb-1.5 block text-[13px] font-medium uppercase tracking-wide text-ink/60">
          Tanggal Terbit
        </label>
        <input
          type="date"
          value={dateValue}
          onChange={(e) => setDateValue(e.target.value)}
          className="w-full rounded-xl border border-ink/15 bg-white px-4 py-2.5 text-[15px] outline-none focus:border-ink/40 sm:w-64"
        />
      </div>

      <div>
        <label className="mb-1.5 block text-[13px] font-medium uppercase tracking-wide text-ink/60">
          PDF (dibaca langsung di web, tanpa perlu diunduh)
        </label>
        <div className="space-y-2">
          <label className="inline-flex cursor-pointer items-center gap-2 rounded-full border border-ink/20 px-4 py-2 text-[13px] uppercase tracking-wide text-ink/70 transition hover:border-ink/40">
            {uploadingPdf ? <Loader2 className="size-4 animate-spin" /> : <UploadCloud className="size-4" />}
            {uploadingPdf ? "Mengunggah…" : form.pdfUrl ? "Ganti PDF" : "Unggah PDF"}
            <input
              type="file"
              accept="application/pdf"
              className="hidden"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) handlePdfUpload(file);
              }}
            />
          </label>
          {form.pdfUrl && (
            <div className="flex items-center gap-3 text-[13px] text-ink/60">
              <FileText className="size-4" />
              <a
                href={form.pdfUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 underline decoration-ink/30 underline-offset-2 hover:text-ink"
              >
                Lihat PDF saat ini
                <ExternalLink className="size-3.5" />
              </a>
              <button
                type="button"
                onClick={() => update("pdfUrl", "")}
                className="text-red-500/70 hover:text-red-600"
              >
                Hapus
              </button>
            </div>
          )}
          <p className="text-[12px] text-ink/45">
            Kalau ada PDF terunggah, pengunjung akan membacanya langsung di halaman tulisan (embed), bukan lewat
            teks di bawah atau tautan eksternal.
          </p>
        </div>
      </div>

      <div>
        <label className="mb-1.5 block text-[13px] font-medium uppercase tracking-wide text-ink/60">
          Tautan Eksternal (opsional)
        </label>
        <input
          value={form.externalUrl}
          onChange={(e) => update("externalUrl", e.target.value)}
          className="w-full rounded-xl border border-ink/15 bg-white px-4 py-2.5 text-[15px] outline-none focus:border-ink/40"
          placeholder="https://medium.com/… — dipakai kalau tidak ada PDF terunggah"
        />
      </div>

      <div>
        <label className="mb-1.5 block text-[13px] font-medium uppercase tracking-wide text-ink/60">
          Isi Tulisan {form.pdfUrl || form.externalUrl ? "(diabaikan karena ada PDF/tautan eksternal)" : ""}
        </label>
        <textarea
          rows={10}
          value={form.content}
          onChange={(e) => update("content", e.target.value)}
          disabled={Boolean(form.pdfUrl) || Boolean(form.externalUrl)}
          className="w-full rounded-xl border border-ink/15 bg-white px-4 py-2.5 text-[15px] outline-none focus:border-ink/40 disabled:bg-ink/5 disabled:text-ink/40"
          placeholder="Pisahkan paragraf dengan baris kosong. Tampil di halaman /tulisan/[slug]."
        />
      </div>

      <div>
        <label className="mb-1.5 block text-[13px] font-medium uppercase tracking-wide text-ink/60">
          Tag (pisahkan dengan koma)
        </label>
        <input
          value={form.tags}
          onChange={(e) => update("tags", e.target.value)}
          className="w-full rounded-xl border border-ink/15 bg-white px-4 py-2.5 text-[15px] outline-none focus:border-ink/40"
          placeholder="UML, Sistem Informasi, Riset"
        />
      </div>

      <div>
        <label className="mb-1.5 block text-[13px] font-medium uppercase tracking-wide text-ink/60">
          Gambar Sampul (opsional, URL)
        </label>
        <input
          value={form.coverImage}
          onChange={(e) => update("coverImage", e.target.value)}
          className="w-full rounded-xl border border-ink/15 bg-white px-4 py-2.5 text-[15px] outline-none focus:border-ink/40"
          placeholder="https://…"
        />
      </div>

      <label className="flex items-center gap-2 text-[14px] text-ink/70">
        <input
          type="checkbox"
          checked={form.published}
          onChange={(e) => update("published", e.target.checked)}
          className="size-4 rounded border-ink/30"
        />
        Tayangkan di halaman publik
      </label>

      <div className="flex items-center gap-3 pt-2">
        <button
          type="submit"
          disabled={saving || uploadingPdf}
          className="inline-flex items-center gap-2 rounded-full bg-ink px-6 py-3 text-[14px] font-medium uppercase tracking-wide text-cream transition hover:bg-ink/85 disabled:opacity-50"
        >
          {saving && <Loader2 className="size-4 animate-spin" />}
          {mode === "create" ? "Simpan Tulisan" : "Perbarui Tulisan"}
        </button>
        <button
          type="button"
          onClick={() => router.push("/admin/writings")}
          className="rounded-full border border-ink/20 px-6 py-3 text-[14px] uppercase tracking-wide text-ink/70 transition hover:border-ink/40"
        >
          Batal
        </button>
      </div>
    </form>
  );
}
