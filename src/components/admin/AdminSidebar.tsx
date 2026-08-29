"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  PlusCircle,
  ExternalLink,
  FileText,
  Settings,
  Menu,
  X
} from "lucide-react";
import LogoutButton from "@/components/admin/LogoutButton";

const navLinks = [
  { href: "/admin", label: "Dashboard Proyek", icon: LayoutDashboard },
  { href: "/admin/projects/new", label: "Tambah Proyek", icon: PlusCircle },
  { divider: true },
  { href: "/admin/writings", label: "Dashboard Karya Tulis", icon: FileText },
  { href: "/admin/writings/new", label: "Tambah Tulisan", icon: PlusCircle },
  { divider: true },
  { href: "/admin/settings", label: "Pengaturan Situs", icon: Settings }
] as const;

function NavLinks({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = usePathname();
  return (
    <>
      {navLinks.map((item, i) => {
        if ("divider" in item) {
          return <div key={`divider-${i}`} className="my-2 border-t border-cream/10" />;
        }
        const Icon = item.icon;
        const active = pathname === item.href;
        return (
          <Link
            key={item.href}
            href={item.href}
            onClick={onNavigate}
            className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-[14px] transition ${
              active ? "bg-cream/10 text-cream" : "text-cream/80 hover:bg-cream/10 hover:text-cream"
            }`}
          >
            <Icon className="size-4" />
            {item.label}
          </Link>
        );
      })}
    </>
  );
}

export function AdminSidebar() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <>
      {/* ----- Top bar mobile (< md): logo + tombol hamburger ----- */}
      <div className="sticky top-0 z-40 flex items-center justify-between border-b border-ink/10 bg-ink px-4 py-3.5 text-cream md:hidden">
        <div>
          <p className="text-[11px] uppercase tracking-[0.25em] text-cream/50">Portofolio</p>
          <p
            className="text-[18px] uppercase leading-none"
            style={{ fontFamily: "'Trobika', 'Bebas Neue', sans-serif" }}
          >
            Admin CMS
          </p>
        </div>
        <button
          onClick={() => setMobileOpen(true)}
          aria-label="Buka menu admin"
          className="rounded-lg p-2 text-cream/80 transition hover:bg-cream/10 hover:text-cream"
        >
          <Menu className="size-6" />
        </button>
      </div>

      {/* ----- Drawer mobile: full-screen overlay saat hamburger diklik ----- */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 flex flex-col bg-ink text-cream md:hidden">
          <div className="flex items-center justify-between px-4 py-3.5">
            <p
              className="text-[18px] uppercase leading-none"
              style={{ fontFamily: "'Trobika', 'Bebas Neue', sans-serif" }}
            >
              Admin CMS
            </p>
            <button
              onClick={() => setMobileOpen(false)}
              aria-label="Tutup menu"
              className="rounded-lg p-2 text-cream/80 transition hover:bg-cream/10 hover:text-cream"
            >
              <X className="size-6" />
            </button>
          </div>
          <nav className="flex flex-1 flex-col gap-1 overflow-y-auto px-4 py-2">
            <NavLinks onNavigate={() => setMobileOpen(false)} />
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
        </div>
      )}

      {/* ----- Sidebar desktop (>= md) ----- */}
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
          <NavLinks />
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
    </>
  );
}