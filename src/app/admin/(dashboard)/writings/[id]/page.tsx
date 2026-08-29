import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { WritingForm } from "@/components/admin/WritingForm";
import type { WritingDTO } from "@/types";

export const dynamic = "force-dynamic";

export default async function EditWritingPage({ params }: { params: { id: string } }) {
  const writing = await prisma.writing.findUnique({ where: { id: params.id } });
  if (!writing) notFound();

  const dto: WritingDTO = {
    ...writing,
    publishedAt: writing.publishedAt.toISOString(),
    createdAt: writing.createdAt.toISOString(),
    updatedAt: writing.updatedAt.toISOString()
  };

  return (
    <div>
      <p className="text-[13px] uppercase tracking-[0.25em] text-ink/50">Edit Tulisan</p>
      <h1
        className="mb-8 mt-1 text-[32px] uppercase leading-none"
        style={{ fontFamily: "'Trobika', 'Bebas Neue', sans-serif" }}
      >
        {writing.title}
      </h1>
      <WritingForm mode="edit" initialData={dto} />
    </div>
  );
}
