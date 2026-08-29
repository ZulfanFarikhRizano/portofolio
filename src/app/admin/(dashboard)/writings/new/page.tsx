import { WritingForm } from "@/components/admin/WritingForm";

export default function NewWritingPage() {
  return (
    <div>
      <p className="text-[13px] uppercase tracking-[0.25em] text-ink/50">Tulisan Baru</p>
      <h1
        className="mb-8 mt-1 text-[32px] uppercase leading-none"
        style={{ fontFamily: "'Trobika', 'Bebas Neue', sans-serif" }}
      >
        Tambah Karya Tulis
      </h1>
      <WritingForm mode="create" />
    </div>
  );
}
