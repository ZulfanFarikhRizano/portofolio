import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { ProjectForm } from "@/components/admin/ProjectForm";
import type { ProjectDTO } from "@/types";

export const dynamic = "force-dynamic";

export default async function EditProjectPage({ params }: { params: { id: string } }) {
  const project = await prisma.project.findUnique({ where: { id: params.id } });
  if (!project) notFound();

  const dto: ProjectDTO = {
    ...project,
    createdAt: project.createdAt.toISOString(),
    updatedAt: project.updatedAt.toISOString()
  };

  return (
    <div>
      <p className="text-[13px] uppercase tracking-[0.25em] text-ink/50">Edit Proyek</p>
      <h1
        className="mb-8 mt-1 text-[32px] uppercase leading-none"
        style={{ fontFamily: "'Trobika', 'Bebas Neue', sans-serif" }}
      >
        {project.title}
      </h1>
      <ProjectForm mode="edit" initialData={dto} />
    </div>
  );
}
