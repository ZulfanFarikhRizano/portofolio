# Portofolio Full-Stack — Next.js + Prisma + Supabase

Portofolio pribadi dinamis dengan CMS admin CRUD, dibangun dengan Next.js 14 (App Router), TypeScript, Tailwind CSS, Framer Motion, Lucide React, Prisma ORM, dan Supabase (Postgres + Storage + Auth). Deploy-ready untuk Vercel.

## Fitur

**Halaman publik (`/`)**
- **Hero** — headline animasi + marquee tanda tangan visual
- **Showcase Proyek** — `CoverflowCarousel` 3D (drag, keyboard arrow, pagination, navigasi) menampilkan galeri proyek dari database, lengkap dengan tautan **Live Demo**, **GitHub**, **Figma**
- **Karya Tulis** — daftar artikel/esai/catatan yang pernah dibuat. Tiap tulisan bisa berupa: **PDF yang diunggah** (dibaca langsung di halaman lewat viewer PDF bawaan browser, tanpa perlu diunduh), **tautan eksternal** (kalau sudah terbit di tempat lain), atau **teks langsung** yang ditulis di admin. Urutan prioritas: PDF → tautan eksternal → teks
- **About** — konten dinamis dari `SiteSettings`
- **Contact** — konten dinamis dari `SiteSettings`
- **FloatingMenu** — navigasi melayang yang membuka/menutup dengan animasi, memakai `TextRoll` untuk efek teks bergulir per-huruf saat hover, scroll-ke-section (Home / Works / Tulisan / About / Contact)

**Dark Mode & Akses Rahasia**
- Tombol toggle "Cinematic Theme Switcher" (kanan-atas halaman publik) — desain pill 3D dengan efek grain, particle burst, dan thumb spring animation
- Ganti tema dibungkus **Circular Reveal Transition** (View Transitions API): lingkaran melebar dari titik klik menutupi layar sebelum tema baru tampil. Otomatis fallback ke toggle instan di browser yang belum mendukung `document.startViewTransition`
- **Klik tombol ini 5x cepat berturut-turut (dalam ~1.8 detik) untuk masuk ke `/admin`** — tidak ada tombol/link admin yang terlihat di UI publik, ini sengaja tersembunyi
- `/admin` dilindungi Supabase Auth (lihat bagian "Keamanan Admin" di bawah) — akses rahasia ini cuma menyembunyikan pintu masuknya dari UI, lapisan keamanan sebenarnya ada di login + middleware

**Admin CMS (`/admin`)**
- Dashboard tabel semua proyek: naikkan/turunkan urutan slide, toggle tayang/draf, edit, hapus
- Form tambah/edit proyek: judul, subjudul, deskripsi, tag, banner (URL atau unggah file), Live Demo / GitHub / Figma
- **Dashboard Karya Tulis** (`/admin/writings`) — CRUD penuh: judul, ringkasan, **unggah PDF** (atau isi teks langsung, atau tautan eksternal), tanggal terbit, tag, gambar sampul, urutan tampil, status tayang/draf
- Endpoint unggah gambar (`/api/upload`) dan PDF (`/api/upload/pdf`) yang menyimpan file ke `public/uploads`

**API Routes**
| Method | Endpoint | Fungsi |
|---|---|---|
| GET | `/api/projects` | Daftar semua proyek |
| POST | `/api/projects` | Buat proyek baru |
| GET | `/api/projects/:id` | Detail satu proyek |
| PUT | `/api/projects/:id` | Update proyek |
| DELETE | `/api/projects/:id` | Hapus proyek |
| PATCH | `/api/projects/reorder` | Atur ulang urutan slide carousel sekaligus |
| POST | `/api/upload` | Unggah gambar banner |
| GET | `/api/writings` | Daftar semua karya tulis |
| POST | `/api/writings` | Buat karya tulis baru |
| GET | `/api/writings/:id` | Detail satu tulisan |
| PUT | `/api/writings/:id` | Update tulisan |
| DELETE | `/api/writings/:id` | Hapus tulisan |
| PATCH | `/api/writings/reorder` | Atur ulang urutan tampil tulisan sekaligus |
| POST | `/api/upload/pdf` | Unggah PDF karya tulis |

## Struktur Folder

```
portfolio/
├─ prisma/
│  ├─ schema.prisma      # Model Project, Writing & SiteSettings
│  └─ seed.ts            # Data contoh
├─ public/uploads/        # Gambar banner yang diunggah lewat admin
├─ src/
│  ├─ app/
│  │  ├─ page.tsx                    # Halaman utama (server component)
│  │  ├─ layout.tsx / globals.css
│  │  ├─ admin/
│  │  │  ├─ layout.tsx               # Sidebar admin
│  │  │  ├─ page.tsx                 # Dashboard CRUD Proyek
│  │  │  ├─ projects/new, [id]/      # Form tambah & edit proyek
│  │  │  └─ writings/, writings/new, writings/[id]/  # CRUD Karya Tulis
│  │  ├─ tulisan/[slug]/page.tsx     # Halaman baca tulisan internal (tanpa tautan eksternal)
│  │  └─ api/
│  │     ├─ projects/route.ts        # GET, POST
│  │     ├─ projects/[id]/route.ts   # GET, PUT, DELETE
│  │     ├─ projects/reorder/route.ts
│  │     ├─ writings/route.ts        # GET, POST
│  │     ├─ writings/[id]/route.ts   # GET, PUT, DELETE
│  │     ├─ writings/reorder/route.ts
│  │     ├─ upload/route.ts          # Unggah gambar (banner/cover)
│  │     └─ upload/pdf/route.ts      # Unggah PDF karya tulis
│  ├─ components/
│  │  ├─ TextRoll.tsx                # Efek teks bergulir per-huruf
│  │  ├─ FloatingMenu.tsx            # Navigasi melayang (memakai TextRoll)
│  │  ├─ CoverflowCarousel.tsx       # Slider 3D independen
│  │  ├─ SiteNav.tsx                 # Wiring FloatingMenu ↔ scroll section
│  │  ├─ ThemeProvider.tsx           # Wrapper next-themes
│  │  ├─ ThemeToggleFab.tsx          # Posisi fixed tombol tema di halaman publik
│  │  ├─ ui/cinematic-theme-switcher.tsx  # Toggle dark/light + reveal + akses rahasia
│  │  ├─ Hero.tsx / About.tsx / Contact.tsx / ProjectShowcase.tsx / WritingsSection.tsx
│  │  └─ admin/ProjectForm.tsx, ProjectTable.tsx, WritingForm.tsx, WritingTable.tsx
│  ├─ lib/prisma.ts, utils.ts
│  └─ types/index.ts
└─ package.json
```

## Setup Supabase

1. Buat project baru di [supabase.com](https://supabase.com).
2. **Database** — buka *Project Settings → Database*, salin connection string mode **Connection pooling** (port 6543) untuk `DATABASE_URL`, dan mode **Direct connection** (port 5432) untuk `DIRECT_URL`.
3. **API keys** — buka *Project Settings → API*, salin `Project URL`, `anon public` key, dan `service_role` key (jangan pernah expose `service_role` ke browser/client component).
4. **Storage** — buka *Storage*, buat bucket baru bernama `portfolio-uploads` (atau nama lain, sesuaikan `NEXT_PUBLIC_SUPABASE_STORAGE_BUCKET`), set jadi **Public bucket** supaya gambar & PDF bisa diakses langsung lewat URL publik.
5. **Auth (login admin)** — buka *Authentication → Users*, klik **Add user** untuk buat akun admin kamu sendiri (email + password). Tidak perlu sign-up flow publik, cukup 1 akun.
6. Salin `.env.example` ke `.env` lalu isi semua value dari langkah 2–4:
   ```bash
   cp .env.example .env
   ```

## Menjalankan Proyek (lokal)

```bash
# 1. Install dependency
npm install

# 2. Push skema Prisma ke database Supabase (buat semua tabel)
npx prisma migrate dev --name init

# 3. Isi data contoh (opsional tapi disarankan)
npm run prisma:seed

# 4. Jalankan development server
npm run dev
```

Buka:
- `http://localhost:3000` — halaman publik
- `http://localhost:3000/admin/login` — login admin (pakai akun yang dibuat di langkah Auth di atas)

> Catatan: `npm install` menjalankan `prisma generate` otomatis lewat hook `postinstall`. Jika environment kamu membatasi akses jaringan ke `binaries.prisma.sh`, jalankan `npx prisma generate` secara manual di jaringan yang tidak dibatasi.

## Deploy ke Vercel

1. Push repo ini ke GitHub, lalu import project-nya di [vercel.com/new](https://vercel.com/new).
2. Di **Environment Variables**, isi semua variabel dari `.env` (`DATABASE_URL`, `DIRECT_URL`, `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY`, `NEXT_PUBLIC_SUPABASE_STORAGE_BUCKET`).
3. Set **Build Command** ke `npm run prisma:deploy && next build` (atau jalankan `npx prisma migrate deploy` sekali secara manual sebelum deploy pertama) supaya tabel di Supabase selalu sinkron dengan `prisma/schema.prisma`.
4. Deploy. Vercel otomatis jalanin `postinstall` (`prisma generate`) sebelum build.

> File yang diunggah lewat `/admin` (banner & PDF) disimpan permanen di Supabase Storage — tidak hilang saat serverless function di Vercel restart, beda dengan filesystem lokal yang dipakai versi SQLite sebelumnya.

## Membaca PDF Inline

Dokumen PDF yang diunggah dirender lewat `<iframe>` di `/tulisan/[slug]`, memakai viewer PDF bawaan browser (Chrome, Firefox, Edge, Safari desktop semuanya mendukung ini secara native). Pengunjung bisa scroll & baca langsung tanpa file terunduh ke perangkatnya. Beberapa browser mobile (terutama Safari iOS versi lama) kadang tetap memicu unduhan alih-alih menampilkan inline — sebagai jaring pengaman, halaman ini juga menyediakan tautan "Buka di tab baru".

## Keamanan Admin

`/admin/**` (halaman) dan `/api/projects`, `/api/writings`, `/api/upload*` (endpoint CRUD & upload) sekarang dilindungi Supabase Auth lewat `src/middleware.ts` — belum login akan di-redirect ke `/admin/login`, dan request API tanpa session valid ditolak dengan `401`. Tombol "5x klik tema" tetap ada sebagai pintu masuk tersembunyi dari UI publik, tapi sekarang bukan satu-satunya lapisan proteksi.

## Palet & Tipografi

Desain memakai token warna dari komponen aslinya: `#242424` (ink), `#f7f1ed` (cream), `#FFE862` (yolk). Font display: `Trobika` / fallback `Bebas Neue`. Font body: `Aeonik TRIAL` / fallback `Inter`. Jika font berlisensi tersebut tidak tersedia di environment kamu, browser otomatis jatuh ke fallback tanpa mengubah layout.
