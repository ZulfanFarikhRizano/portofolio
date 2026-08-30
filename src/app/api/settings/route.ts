import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// Pakai dynamic agar Vercel tidak meng-cache API route ini secara statis
export const dynamic = "force-dynamic";

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
  theme: {
    light: { background: "", foreground: "", muted: "", mutedForeground: "", ring: "" },
    dark: { background: "", foreground: "", muted: "", mutedForeground: "", ring: "" }
  }
};

function safeJsonParse(jsonString: string) {
  try {
    return JSON.parse(jsonString);
  } catch {
    return null;
  }
}

// GET /api/settings
export async function GET() {
  try {
    const rows = await prisma.siteSettings.findMany();

    const map = new Map(
      rows.map((r) => [r.key, r.valueJson ? safeJsonParse(r.valueJson) : null])
    );

    const result: Record<string, unknown> = {};
    for (const key of ALLOWED_KEYS) {
      const stored = map.get(key);

      result[key] =
        stored && typeof stored === "object" && !Array.isArray(stored)
          ? { ...(defaults[key] as object), ...stored }
          : (stored ?? defaults[key]);
    }

    return NextResponse.json({ data: result }, { status: 200 });
  } catch (error) {
    console.error("GET /api/settings error:", error);
    return NextResponse.json({ data: defaults }, { status: 200 });
  }
}

// PUT /api/settings
export async function PUT(req: NextRequest) {
  try {
    const body = await req.json().catch(() => null);

    if (!body || typeof body !== "object") {
      return NextResponse.json({ error: "Body request tidak valid." }, { status: 400 });
    }

    const { key, value } = body as { key: string; value: unknown };

    if (!ALLOWED_KEYS.includes(key as SettingKey)) {
      return NextResponse.json({ error: "Key pengaturan tidak dikenali." }, { status: 400 });
    }

    const valueJson = JSON.stringify(value ?? defaults[key as SettingKey]);

    const updated = await prisma.siteSettings.upsert({
      where: { key },
      update: { valueJson },
      create: { key, valueJson }
    });

    const parsedData = safeJsonParse(updated.valueJson) ?? defaults[key as SettingKey];

    return NextResponse.json({ data: parsedData }, { status: 200 });
  } catch (error) {
    console.error("PUT /api/settings error:", error);
    return NextResponse.json({ error: "Gagal menyimpan pengaturan." }, { status: 500 });
  }
}

// OPTIONS /api/settings (CORS Preflight Handler)
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 204,
    headers: {
      "Allow": "GET, PUT, OPTIONS",
      "Access-Control-Allow-Methods": "GET, PUT, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, Authorization"
    }
  });
}