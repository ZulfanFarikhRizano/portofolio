import Link from "next/link";
import { LayoutDashboard, PlusCircle, ExternalLink, FileText } from "lucide-react";
import LogoutButton from "@/components/admin/LogoutButton";

export const metadata = {
  title: "Admin — Portofolio CMS"
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-cream text-ink">
      <div className="flex min-h-screen">
        <aside className="hidden w-64 shrink-0 border-r border-ink/10 bg-ink text-cream md:flex md:flex-col">
          <div className="px-6 py-8">
            <p className="text-[12px] uppercase tracking-[0.25em] text-cream/50">Portofolio</p>
            <p
              className="mt-1 text-[22px] uppercase"
              style={{ fontFamily: "'Trobika', 'Bebas Neue', sans-serif" }}
            >
              Admin CMS
            </p>
          </div>
          <nav className="flex flex-1 flex-col gap-1 px-4">
            <Link
              href="/admin"
              className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-[14px] text-cream/80 transition hover:bg-cream/10 hover:text-cream"
            >
              <LayoutDashboard className="size-4" />
              Dashboard Proyek
            </Link>
            <Link
              href="/admin/projects/new"
              className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-[14px] text-cream/80 transition hover:bg-cream/10 hover:text-cream"
            >
              <PlusCircle className="size-4" />
              Tambah Proyek
            </Link>
            <div className="my-2 border-t border-cream/10" />
            <Link
              href="/admin/writings"
              className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-[14px] text-cream/80 transition hover:bg-cream/10 hover:text-cream"
            >
              <FileText className="size-4" />
              Dashboard Karya Tulis
            </Link>
            <Link
              href="/admin/writings/new"
              className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-[14px] text-cream/80 transition hover:bg-cream/10 hover:text-cream"
            >
              <PlusCircle className="size-4" />
              Tambah Tulisan
            </Link>
          </nav>
          <div className="px-4 pb-6">
            <Link
              href="/"
              target="_blank"
              className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-[13px] text-cream/50 transition hover:bg-cream/10 hover:text-cream"
            >
              <ExternalLink className="size-4" />
              Lihat situs publik
            </Link>
            <LogoutButton />
          </div>
        </aside>

        <main className="flex-1 px-6 py-10 md:px-10">{children}</main>
      </div>
    </div>
  );
}
