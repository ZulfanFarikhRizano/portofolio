import Link from "next/link";
import { PlusCircle } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { ProjectTable } from "@/components/admin/ProjectTable";
import type { ProjectDTO } from "@/types";


export const dynamic = "force-dynamic";

async function getProjects(): Promise<ProjectDTO[]> {
  const projects = await prisma.project.findMany({ orderBy: { order: "asc" } });
  return projects.map((p) => ({
    ...p,
    createdAt: p.createdAt.toISOString(),
    updatedAt: p.updatedAt.toISOString()
  }));
}

export default async function AdminDashboardPage() {
  const projects = await getProjects();

  return (
    <div>
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-[13px] uppercase tracking-[0.25em] text-ink/50">Dashboard</p>
          <h1
            className="mt-1 text-[32px] uppercase leading-none"
            style={{ fontFamily: "'Trobika', 'Bebas Neue', sans-serif" }}
          >
            Manajemen Proyek
          </h1>
          <p className="mt-2 text-[14px] text-ink/50">
            {projects.length} proyek · atur urutan slide carousel, konten, dan tautan luar.
          </p>
        </div>
        <Link
          href="/admin/projects/new"
          className="inline-flex items-center gap-2 rounded-full bg-ink px-5 py-2.5 text-[13px] font-medium uppercase tracking-wide text-cream transition hover:bg-ink/85"
        >
          <PlusCircle className="size-4" />
          Tambah Proyek
        </Link>
      </div>

      <ProjectTable initialProjects={projects} />
    </div>
  );
}
