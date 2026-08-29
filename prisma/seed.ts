import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  await prisma.project.deleteMany();
  await prisma.writing.deleteMany();
  await prisma.siteSettings.deleteMany();

  const projects = [
    {
      title: "Kampung Dimsum POS",
      slug: "kampung-dimsum-pos",
      subtitle: "Sistem kasir multi-cabang",
      description:
        "Aplikasi point-of-sale untuk jaringan resto dimsum multi-cabang, lengkap dengan manajemen stok, laporan penjualan real-time, dan dokumentasi UML penuh.",
      bannerImage: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=1200&q=80",
      tags: "Next.js,PostgreSQL,POS,UML",
      liveUrl: "https://example.com/kampung-dimsum",
      githubUrl: "https://github.com/",
      figmaUrl: "https://figma.com/",
      order: 0
    },
    {
      title: "Z-Wealth",
      slug: "z-wealth",
      subtitle: "Web app finansial dengan theme transition",
      description:
        "Web app finansial pribadi dengan transisi tema circular ripple reveal memakai CSS mask-image radial-gradient, dioptimalkan untuk performa mobile.",
      bannerImage: "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=1200&q=80",
      tags: "React,Tailwind,Framer Motion",
      liveUrl: "https://example.com/z-wealth",
      githubUrl: "https://github.com/",
      figmaUrl: "",
      order: 1
    },
    {
      title: "Multi-Exchange Trading Bot",
      slug: "trading-bot",
      subtitle: "Bot futures TypeScript",
      description:
        "Bot trading futures multi-exchange berbasis TypeScript yang berjalan di atas Supabase Edge Functions dengan strategi otomatis dan monitoring risiko.",
      bannerImage: "https://images.unsplash.com/photo-1642790106117-e829e14a795f?w=1200&q=80",
      tags: "TypeScript,Supabase,Trading",
      liveUrl: "",
      githubUrl: "https://github.com/",
      figmaUrl: "",
      order: 2
    }
  ];

  for (const p of projects) {
    await prisma.project.create({ data: p });
  }

  const writings = [
    {
      title: "Merancang Activity Diagram Swimlane untuk Sistem Multi-Aktor",
      slug: "activity-diagram-swimlane-multi-aktor",
      excerpt:
        "Catatan pendekatan swimlane-first saat mendokumentasikan alur bisnis lintas peran di proyek Kampung Dimsum POS.",
      content:
        "Saat mendokumentasikan sistem dengan banyak aktor — kasir, dapur, dan manajer cabang — pendekatan swimlane-first membantu memisahkan tanggung jawab tiap peran secara visual sejak awal.\n\nDengan swimlane, setiap alur keputusan bisa ditelusuri milik siapa, sehingga proses review dengan tim non-teknis jadi lebih cepat.",
      tags: "UML,Sistem Informasi,Dokumentasi",
      externalUrl: "",
      order: 0
    },
    {
      title: "Circular Reveal Transition: Menyusun Efek Ripple Ganti Tema di CSS",
      slug: "circular-reveal-transition-css",
      excerpt:
        "Eksperimen memakai clip-path radial dan View Transitions API untuk transisi tema yang terasa sinematik, termasuk siasat di perangkat mobile.",
      content:
        "Transisi tema dengan efek ripple melingkar terlihat sederhana, tapi ada beberapa jebakan di mobile — terutama soal repaint dan dukungan browser terhadap View Transitions API.\n\nPendekatan yang saya pakai: hitung titik klik sebagai pusat lingkaran, lalu animasikan clip-path dari radius 0 sampai menutupi sudut layar terjauh, dengan fallback instan untuk browser yang belum mendukung.",
      tags: "CSS,Frontend,Animasi",
      externalUrl: "",
      order: 1
    },
    {
      title: "Catatan Ujian Keamanan Sistem Informasi",
      slug: "catatan-ujian-keamanan-sistem-informasi",
      excerpt:
        "Rangkuman topik CIA triad, serangan jaringan, topologi firewall IPFire, dan metodologi ethical hacking untuk persiapan ujian.",
      content:
        "Confidentiality, Integrity, Availability — tiga pilar ini jadi kerangka utama saat menilai risiko keamanan sebuah sistem.\n\nCatatan ini juga membahas topologi firewall IPFire dan tahapan metodologi ethical hacking secara garis besar sebagai bahan belajar.",
      tags: "Keamanan Informasi,Kuliah",
      externalUrl: "",
      order: 2
    }
  ];

  for (const w of writings) {
    await prisma.writing.create({ data: w });
  }

  await prisma.siteSettings.create({
    data: {
      key: "hero",
      valueJson: JSON.stringify({
        eyebrow: "Full-Stack Developer",
        headline: "Zuzu membangun produk web dari ide sampai produksi.",
        description:
          "Mahasiswa & full-stack web developer berbasis Jabodetabek, fokus pada antarmuka yang presisi dan sistem backend yang rapi."
      })
    }
  });

  await prisma.siteSettings.create({
    data: {
      key: "about",
      valueJson: JSON.stringify({
        heading: "Tentang",
        paragraphs: [
          "Saya mahasiswa yang tengah menuntaskan proyek kerja praktek, dengan fokus utama sebagai full-stack web developer.",
          "Terbiasa membangun sistem end-to-end: dari desain UML, backend API, sampai antarmuka yang halus secara animasi."
        ],
        skills: ["Next.js", "TypeScript", "Prisma", "Tailwind CSS", "Framer Motion", "PostgreSQL/SQLite"]
      })
    }
  });

  await prisma.siteSettings.create({
    data: {
      key: "contact",
      valueJson: JSON.stringify({
        heading: "Kontak",
        email: "zuzu@example.com",
        socials: [
          { label: "GitHub", url: "https://github.com/" },
          { label: "LinkedIn", url: "https://linkedin.com/" },
          { label: "Instagram", url: "https://instagram.com/" }
        ]
      })
    }
  });

  console.log("Seed selesai.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
