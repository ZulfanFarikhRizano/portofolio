"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { ArrowUp, ArrowDown, Pencil, Trash2, ExternalLink, Github, Figma as FigmaIcon } from "lucide-react";
import type { ProjectDTO } from "@/types";
import { parseTags } from "@/lib/utils";

export function ProjectTable({ initialProjects }: { initialProjects: ProjectDTO[] }) {
  const [projects, setProjects] = useState(initialProjects);
  const [busyId, setBusyId] = useState<string | null>(null);
  const router = useRouter();

  async function persistOrder(next: ProjectDTO[]) {
    setProjects(next);
    await fetch("/api/projects/reorder", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        order: next.map((p, idx) => ({ id: p.id, order: idx }))
      })
    });
    router.refresh();
  }

  function move(index: number, dir: -1 | 1) {
    const target = index + dir;
    if (target < 0 || target >= projects.length) return;
    const next = [...projects];
    [next[index], next[target]] = [next[target], next[index]];
    persistOrder(next);
  }

  async function togglePublish(project: ProjectDTO) {
    setBusyId(project.id);
    try {
      const res = await fetch(`/api/projects/${project.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ published: !project.published })
      });
      if (res.ok) {
        setProjects((prev) =>
          prev.map((p) => (p.id === project.id ? { ...p, published: !p.published } : p))
        );
      }
    } finally {
      setBusyId(null);
    }
  }

  async function remove(project: ProjectDTO) {
    if (!confirm(`Hapus proyek "${project.title}"? Tindakan ini tidak bisa dibatalkan.`)) return;
    setBusyId(project.id);
    try {
      const res = await fetch(`/api/projects/${project.id}`, { method: "DELETE" });
      if (res.ok) {
        setProjects((prev) => prev.filter((p) => p.id !== project.id));
        router.refresh();
      }
    } finally {
      setBusyId(null);
    }
  }

  if (projects.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-ink/20 px-8 py-16 text-center text-ink/50">
        Belum ada proyek. Klik &ldquo;Tambah Proyek&rdquo; untuk mulai mengisi carousel.
      </div>
    );
  }

  return (
    <div className="overflow-x-auto rounded-2xl border border-ink/10">
  <table className="w-full min-w-[720px] border-collapse text-left text-[14px]">
        <thead>
          <tr className="border-b border-ink/10 bg-ink/[0.03] text-[12px] uppercase tracking-wide text-ink/50">
            <th className="px-4 py-3 font-medium">Urutan</th>
            <th className="px-4 py-3 font-medium">Banner</th>
            <th className="px-4 py-3 font-medium">Proyek</th>
            <th className="px-4 py-3 font-medium">Tautan</th>
            <th className="px-4 py-3 font-medium">Status</th>
            <th className="px-4 py-3 font-medium text-right">Aksi</th>
          </tr>
        </thead>
        <tbody>
          {projects.map((project, index) => (
            <tr key={project.id} className="border-b border-ink/10 last:border-0">
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
                    disabled={index === projects.length - 1}
                    aria-label="Turunkan urutan"
                    className="rounded-md p-1 text-ink/50 transition hover:bg-ink/5 hover:text-ink disabled:opacity-20"
                  >
                    <ArrowDown className="size-4" />
                  </button>
                  <span className="ml-1 text-ink/40">{index + 1}</span>
                </div>
              </td>
              <td className="px-4 py-3">
                <div className="relative size-14 overflow-hidden rounded-lg bg-ink/5">
                  <Image
                    src={project.bannerImage}
                    alt={project.title}
                    fill
                    sizes="56px"
                    className="object-cover"
                    unoptimized
                  />
                </div>
              </td>
              <td className="px-4 py-3">
                <p className="font-medium">{project.title}</p>
                {project.subtitle && <p className="text-[12px] text-ink/50">{project.subtitle}</p>}
                <div className="mt-1 flex flex-wrap gap-1">
                  {parseTags(project.tags)
                    .slice(0, 3)
                    .map((tag) => (
                      <span key={tag} className="rounded-full bg-ink/5 px-2 py-0.5 text-[11px] text-ink/60">
                        {tag}
                      </span>
                    ))}
                </div>
              </td>
              <td className="px-4 py-3">
                <div className="flex items-center gap-2 text-ink/50">
                  {project.liveUrl && <ExternalLink className="size-4" />}
                  {project.githubUrl && <Github className="size-4" />}
                  {project.figmaUrl && <FigmaIcon className="size-4" />}
                </div>
              </td>
              <td className="px-4 py-3">
                <button
                  onClick={() => togglePublish(project)}
                  disabled={busyId === project.id}
                  className={`rounded-full px-3 py-1 text-[12px] font-medium uppercase tracking-wide transition ${
                    project.published
                      ? "bg-ink text-cream hover:bg-ink/85"
                      : "bg-ink/5 text-ink/50 hover:bg-ink/10"
                  }`}
                >
                  {project.published ? "Tayang" : "Draf"}
                </button>
              </td>
              <td className="px-4 py-3">
                <div className="flex items-center justify-end gap-2">
                  <Link
                    href={`/admin/projects/${project.id}`}
                    className="rounded-md p-2 text-ink/50 transition hover:bg-ink/5 hover:text-ink"
                    aria-label="Edit proyek"
                  >
                    <Pencil className="size-4" />
                  </Link>
                  <button
                    onClick={() => remove(project)}
                    disabled={busyId === project.id}
                    className="rounded-md p-2 text-red-500/70 transition hover:bg-red-500/10 hover:text-red-600"
                    aria-label="Hapus proyek"
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
