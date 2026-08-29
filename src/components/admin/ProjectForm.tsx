"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { UploadCloud, Loader2 } from "lucide-react";
import type { ProjectDTO, ProjectInput } from "@/types";

interface ProjectFormProps {
  mode: "create" | "edit";
  initialData?: ProjectDTO;
}

const emptyForm: ProjectInput = {
  title: "",
  subtitle: "",
  description: "",
  bannerImage: "",
  tags: "",
  liveUrl: "",
  githubUrl: "",
  figmaUrl: "",
  published: true
};

export function ProjectForm({ mode, initialData }: ProjectFormProps) {
  const router = useRouter();
  const [form, setForm] = useState<ProjectInput>(
    initialData
      ? {
          title: initialData.title,
          slug: initialData.slug,
          subtitle: initialData.subtitle ?? "",
          description: initialData.description,
          bannerImage: initialData.bannerImage,
          tags: initialData.tags,
          liveUrl: initialData.liveUrl ?? "",
          githubUrl: initialData.githubUrl ?? "",
          figmaUrl: initialData.figmaUrl ?? "",
          published: initialData.published
        }
      : emptyForm
  );
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function update<K extends keyof ProjectInput>(key: K, value: ProjectInput[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  async function handleFileUpload(file: File) {
    setUploading(true);
    setError(null);
    try {
      const body = new FormData();
      body.append("file", file);
      const res = await fetch("/api/upload", { method: "POST", body });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error ?? "Gagal mengunggah gambar.");
      update("bannerImage", json.data.url);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Gagal mengunggah gambar.");
    } finally {
      setUploading(false);
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError(null);
    try {
      const url = mode === "create" ? "/api/projects" : `/api/projects/${initialData!.id}`;
      const method = mode === "create" ? "POST" : "PUT";
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form)
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error ?? "Gagal menyimpan proyek.");
      router.push("/admin");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Gagal menyimpan proyek.");
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
          Judul Proyek *
        </label>
        <input
          required
          value={form.title}
          onChange={(e) => update("title", e.target.value)}
          className="w-full rounded-xl border border-ink/15 bg-white px-4 py-2.5 text-[15px] outline-none focus:border-ink/40"
          placeholder="mis. Kampung Dimsum POS"
        />
      </div>

      <div>
        <label className="mb-1.5 block text-[13px] font-medium uppercase tracking-wide text-ink/60">
          Subjudul
        </label>
        <input
          value={form.subtitle}
          onChange={(e) => update("subtitle", e.target.value)}
          className="w-full rounded-xl border border-ink/15 bg-white px-4 py-2.5 text-[15px] outline-none focus:border-ink/40"
          placeholder="mis. Sistem kasir multi-cabang"
        />
      </div>

      <div>
        <label className="mb-1.5 block text-[13px] font-medium uppercase tracking-wide text-ink/60">
          Deskripsi *
        </label>
        <textarea
          required
          rows={4}
          value={form.description}
          onChange={(e) => update("description", e.target.value)}
          className="w-full rounded-xl border border-ink/15 bg-white px-4 py-2.5 text-[15px] outline-none focus:border-ink/40"
          placeholder="Ceritakan proyek ini secara singkat…"
        />
      </div>

      <div>
        <label className="mb-1.5 block text-[13px] font-medium uppercase tracking-wide text-ink/60">
          Gambar Banner *
        </label>
        <div className="flex items-start gap-4">
          <div className="relative size-24 shrink-0 overflow-hidden rounded-xl border border-ink/10 bg-ink/5">
            {form.bannerImage ? (
              <Image src={form.bannerImage} alt="Preview banner" fill unoptimized className="object-cover" />
            ) : (
              <div className="flex h-full items-center justify-center text-ink/30">
                <UploadCloud className="size-6" />
              </div>
            )}
          </div>
          <div className="flex-1 space-y-2">
            <input
              required
              value={form.bannerImage}
              onChange={(e) => update("bannerImage", e.target.value)}
              className="w-full rounded-xl border border-ink/15 bg-white px-4 py-2.5 text-[15px] outline-none focus:border-ink/40"
              placeholder="https://... atau unggah file"
            />
            <label className="inline-flex cursor-pointer items-center gap-2 rounded-full border border-ink/20 px-4 py-2 text-[13px] uppercase tracking-wide text-ink/70 transition hover:border-ink/40">
              {uploading ? <Loader2 className="size-4 animate-spin" /> : <UploadCloud className="size-4" />}
              {uploading ? "Mengunggah…" : "Unggah gambar"}
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) handleFileUpload(file);
                }}
              />
            </label>
          </div>
        </div>
      </div>

      <div>
        <label className="mb-1.5 block text-[13px] font-medium uppercase tracking-wide text-ink/60">
          Tag (pisahkan dengan koma)
        </label>
        <input
          value={form.tags}
          onChange={(e) => update("tags", e.target.value)}
          className="w-full rounded-xl border border-ink/15 bg-white px-4 py-2.5 text-[15px] outline-none focus:border-ink/40"
          placeholder="Next.js, Prisma, Tailwind"
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <div>
          <label className="mb-1.5 block text-[13px] font-medium uppercase tracking-wide text-ink/60">
            Live Demo
          </label>
          <input
            value={form.liveUrl}
            onChange={(e) => update("liveUrl", e.target.value)}
            className="w-full rounded-xl border border-ink/15 bg-white px-4 py-2.5 text-[14px] outline-none focus:border-ink/40"
            placeholder="https://"
          />
        </div>
        <div>
          <label className="mb-1.5 block text-[13px] font-medium uppercase tracking-wide text-ink/60">
            GitHub
          </label>
          <input
            value={form.githubUrl}
            onChange={(e) => update("githubUrl", e.target.value)}
            className="w-full rounded-xl border border-ink/15 bg-white px-4 py-2.5 text-[14px] outline-none focus:border-ink/40"
            placeholder="https://github.com/…"
          />
        </div>
        <div>
          <label className="mb-1.5 block text-[13px] font-medium uppercase tracking-wide text-ink/60">
            Figma
          </label>
          <input
            value={form.figmaUrl}
            onChange={(e) => update("figmaUrl", e.target.value)}
            className="w-full rounded-xl border border-ink/15 bg-white px-4 py-2.5 text-[14px] outline-none focus:border-ink/40"
            placeholder="https://figma.com/…"
          />
        </div>
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
          disabled={saving || uploading}
          className="inline-flex items-center gap-2 rounded-full bg-ink px-6 py-3 text-[14px] font-medium uppercase tracking-wide text-cream transition hover:bg-ink/85 disabled:opacity-50"
        >
          {saving && <Loader2 className="size-4 animate-spin" />}
          {mode === "create" ? "Simpan Proyek" : "Perbarui Proyek"}
        </button>
        <button
          type="button"
          onClick={() => router.push("/admin")}
          className="rounded-full border border-ink/20 px-6 py-3 text-[14px] uppercase tracking-wide text-ink/70 transition hover:border-ink/40"
        >
          Batal
        </button>
      </div>
    </form>
  );
}
