import { ProjectForm } from "@/components/admin/ProjectForm";

export default function NewProjectPage() {
  return (
    <div>
      <p className="text-[13px] uppercase tracking-[0.25em] text-ink/50">Proyek Baru</p>
      <h1
        className="mb-8 mt-1 text-[32px] uppercase leading-none"
        style={{ fontFamily: "'Trobika', 'Bebas Neue', sans-serif" }}
      >
        Tambah Proyek
      </h1>
      <ProjectForm mode="create" />
    </div>
  );
}
