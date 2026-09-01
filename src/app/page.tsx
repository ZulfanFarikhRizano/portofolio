import { Suspense } from "react";
import { prisma } from "@/lib/prisma";
import { ParallaxHero } from "@/components/ParallaxHero";
import { Hero, type HeroContent } from "@/components/Hero";
import { WordCycleHero } from "@/components/WordCycleHero";
import { CursorGlow } from "@/components/CursorGlow";
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
  email: "farikhrizano@gmail.com",
  socials: []
};

interface SiteContent {
  parallaxName: string;
  parallaxScrollLabel: string;
  navLabels: {
    home: string;
    works: string;
    writings: string;
    about: string;
    contact: string;
    menuButton: string;
  };
  projectsEyebrow: string;
  projectsHeading: string;
  writingsEyebrow: string;
  writingsHeading: string;
  footerText: string;
}

const defaultSite: SiteContent = {
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
};

async function getSettings() {
  try {
    const rows = await prisma.siteSettings.findMany();
    const map = new Map(rows.map((r) => [r.key, JSON.parse(r.valueJson)]));
    const storedSite = map.get("site") as Partial<SiteContent> | undefined;

    return {
      hero: (map.get("hero") as HeroContent) ?? defaultHero,
      about: (map.get("about") as AboutContent) ?? defaultAbout,
      contact: (map.get("contact") as ContactContent) ?? defaultContact,
      site: {
        ...defaultSite,
        ...storedSite,
        navLabels: { ...defaultSite.navLabels, ...storedSite?.navLabels }
      } as SiteContent
    };
  } catch (error) {
    console.error("Gagal mengambil settings dari DB:", error);
    return {
      hero: defaultHero,
      about: defaultAbout,
      contact: defaultContact,
      site: defaultSite
    };
  }
}

async function getProjects(): Promise<ProjectDTO[]> {
  try {
    const projects = await prisma.project.findMany({
      where: { published: true },
      orderBy: { order: "asc" }
    });
    return projects.map((p) => ({
      ...p,
      createdAt: p.createdAt.toISOString(),
      updatedAt: p.updatedAt.toISOString()
    }));
  } catch (error) {
    console.error("Gagal mengambil projects dari DB:", error);
    return [];
  }
}

async function getWritings(): Promise<WritingDTO[]> {
  try {
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
  } catch (error) {
    console.error("Gagal mengambil writings dari DB:", error);
    return [];
  }
}

export default async function HomePage() {
  const [{ hero, about, contact, site }, projects, writings] = await Promise.all([
    getSettings(),
    getProjects(),
    getWritings()
  ]);

  return (
    <main className="relative min-h-screen bg-background text-foreground">
      <CursorGlow />

      <section id="home">
        <ParallaxHero name={site.parallaxName} scrollLabel={site.parallaxScrollLabel} />
        <Hero content={hero} />
        <WordCycleHero />
      </section>

      <section id="works">
        <ProjectShowcase
          projects={projects}
          eyebrow={site.projectsEyebrow}
          heading={site.projectsHeading}
        />
      </section>

      <section id="writings">
        <WritingsSection
          writings={writings}
          eyebrow={site.writingsEyebrow}
          heading={site.writingsHeading}
        />
      </section>

      <section id="about">
        <About content={about} />
      </section>

      <section id="contact">
        <Contact content={contact} footerText={site.footerText} />
      </section>

      <Suspense fallback={null}>
        <SiteNav labels={site.navLabels} />
        <ThemeToggleFab />
      </Suspense>
    </main>
  );
}