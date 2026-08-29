import { prisma } from "@/lib/prisma";
import { Hero, type HeroContent } from "@/components/Hero";
import { ProjectShowcase } from "@/components/ProjectShowcase";
import { WritingsSection } from "@/components/WritingsSection";
import { About, type AboutContent } from "@/components/About";
import { Contact, type ContactContent } from "@/components/Contact";
import { SiteNav } from "@/components/SiteNav";
import { ThemeToggleFab } from "@/components/ThemeToggleFab";
import type { ProjectDTO, WritingDTO } from "@/types";

export const dynamic = "force-dynamic";

const defaultHero: HeroContent = {
  eyebrow: "Full-Stack Developer",
  headline: "Membangun produk web dari ide sampai produksi.",
  description:
    "Mahasiswa & full-stack web developer, fokus pada antarmuka yang presisi dan sistem backend yang rapi."
};

const defaultAbout: AboutContent = {
  heading: "Tentang",
  paragraphs: ["Belum ada konten. Isi lewat halaman /admin."],
  skills: []
};

const defaultContact: ContactContent = {
  heading: "Kontak",
  email: "hello@example.com",
  socials: []
};

async function getSettings() {
  const rows = await prisma.siteSettings.findMany();
  const map = new Map(rows.map((r) => [r.key, JSON.parse(r.valueJson)]));
  return {
    hero: (map.get("hero") as HeroContent) ?? defaultHero,
    about: (map.get("about") as AboutContent) ?? defaultAbout,
    contact: (map.get("contact") as ContactContent) ?? defaultContact
  };
}

async function getProjects(): Promise<ProjectDTO[]> {
  const projects = await prisma.project.findMany({
    where: { published: true },
    orderBy: { order: "asc" }
  });
  return projects.map((p) => ({
    ...p,
    createdAt: p.createdAt.toISOString(),
    updatedAt: p.updatedAt.toISOString()
  }));
}

async function getWritings(): Promise<WritingDTO[]> {
  const writings = await prisma.writing.findMany({
    where: { published: true },
    orderBy: { order: "asc" }
  });
  return writings.map((w) => ({
    ...w,
    publishedAt: w.publishedAt.toISOString(),
    createdAt: w.createdAt.toISOString(),
    updatedAt: w.updatedAt.toISOString()
  }));
}

export default async function HomePage() {
  const [{ hero, about, contact }, projects, writings] = await Promise.all([
    getSettings(),
    getProjects(),
    getWritings()
  ]);

  return (
    <main className="relative">
      <Hero content={hero} />
      <ProjectShowcase projects={projects} />
      <WritingsSection writings={writings} />
      <About content={about} />
      <Contact content={contact} />
      <SiteNav />
      <ThemeToggleFab />
    </main>
  );
}
