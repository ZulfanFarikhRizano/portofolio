import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

const ALLOWED_KEYS = ["hero", "about", "contact", "site", "theme"] as const;
type SettingKey = (typeof ALLOWED_KEYS)[number];

const defaults: Record<SettingKey, unknown> = {
  hero: {
    eyebrow: "Full-Stack Developer",
    headline: "Membangun produk web dari ide sampai produksi.",
    description:
      "Mahasiswa & full-stack web developer, fokus pada antarmuka yang presisi dan sistem backend yang rapi."
  },
  about: {
    heading: "Tentang",
    paragraphs: ["Belum ada konten. Isi lewat halaman /admin."],
    skills: []
  },
  contact: {
    heading: "Kontak",
    email: "hello@example.com",
    socials: []
  },
  // Teks-teks lain yang tersebar di berbagai bagian situs (bukan Hero/About/Kontak)
  site: {
    parallaxName: "ZULFAN FARIKH RIZANO",
    parallaxScrollLabel: "Scroll",
    navLabels: {
      home: "Home",
      works: "Works",
      writings: "Tulisan",
      about: "About",
      contact: "Contact",
      menuButton: "Menu"
    },
    projectsEyebrow: "Proyek",
    projectsHeading: "Karya Terpilih",
    writingsEyebrow: "Karya Tulis",
    writingsHeading: "Tulisan & Catatan",
    footerText: "Dibangun dengan Next.js, Prisma & Framer Motion"
  },
  // Warna kustom tema terang & gelap. Kalau null/kosong, pakai default dari globals.css.
  theme: {
    light: { background: "", foreground: "", muted: "", mutedForeground: "", ring: "" },
    dark: { background: "", foreground: "", muted: "", mutedForeground: "", ring: "" }
  }
};

// GET /api/settings — kembalikan semua key sekaligus (fallback ke default kalau belum diisi)
export async function GET() {
  const rows = await prisma.siteSettings.findMany();
  const map = new Map(rows.map((r) => [r.key, JSON.parse(r.valueJson)]));

  const result: Record<string, unknown> = {};
  for (const key of ALLOWED_KEYS) {
    const stored = map.get(key);
    // Merge dangkal supaya field baru yang ditambahkan di masa depan tetap ada
    // nilai default-nya walau data lama di DB belum punya field itu.
    result[key] =
      stored && typeof stored === "object" && !Array.isArray(stored)
        ? { ...(defaults[key] as object), ...stored }
        : (stored ?? defaults[key]);
  }

  return NextResponse.json({ data: result });
}

// PUT /api/settings — body: { key: "hero" | "about" | "contact" | "site" | "theme", value: {...} }
export async function PUT(req: NextRequest) {
  try {
    const body = await req.json();
    const { key, value } = body as { key: string; value: unknown };

    if (!ALLOWED_KEYS.includes(key as SettingKey)) {
      return NextResponse.json({ error: "Key pengaturan tidak dikenali." }, { status: 400 });
    }

    const updated = await prisma.siteSettings.upsert({
      where: { key },
      update: { valueJson: JSON.stringify(value) },
      create: { key, valueJson: JSON.stringify(value) }
    });

    return NextResponse.json({ data: JSON.parse(updated.valueJson) });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Gagal menyimpan pengaturan." }, { status: 500 });
  }
}