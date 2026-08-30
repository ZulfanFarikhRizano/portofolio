"use client";

import { useEffect, useState } from "react";
import { Loader2, Plus, Trash2, Save } from "lucide-react";

interface HeroContent {
  eyebrow: string;
  headline: string;
  description: string;
}
interface AboutContent {
  heading: string;
  paragraphs: string[];
  skills: string[];
}
interface ContactContent {
  heading: string;
  email: string;
  socials: { label: string; url: string }[];
}
interface NavLabels {
  home: string;
  works: string;
  writings: string;
  about: string;
  contact: string;
  menuButton: string;
}
interface SiteContent {
  parallaxName: string;
  parallaxScrollLabel: string;
  navLabels: NavLabels;
  projectsEyebrow: string;
  projectsHeading: string;
  writingsEyebrow: string;
  writingsHeading: string;
  footerText: string;
}
interface ThemeColors {
  background: string;
  foreground: string;
  muted: string;
  mutedForeground: string;
  ring: string;
}
interface ThemeContent {
  light: ThemeColors;
  dark: ThemeColors;
}
interface Settings {
  hero: HeroContent;
  about: AboutContent;
  contact: ContactContent;
  site: SiteContent;
  theme: ThemeContent;
}

const inputClass =
  "w-full rounded-lg border border-ink/15 bg-white px-3 py-2 text-[14px] outline-none focus:border-ink/40";
const labelClass = "mb-1 block text-[13px] text-ink/60";
const sectionClass = "rounded-2xl border border-ink/10 bg-white/60 p-6";

const defaultLight: ThemeColors = {
  background: "#f7f1ed",
  foreground: "#242424",
  muted: "#e8e0d8",
  mutedForeground: "#666666",
  ring: "#ffe862"
};
const defaultDark: ThemeColors = {
  background: "#1a1a1a",
  foreground: "#f7f1ed",
  muted: "#2e2e2e",
  mutedForeground: "#a69f8f",
  ring: "#ffe862"
};

function hexToHslString(hex: string): string {
  const r = parseInt(hex.slice(1, 3), 16) / 255;
  const g = parseInt(hex.slice(3, 5), 16) / 255;
  const b = parseInt(hex.slice(5, 7), 16) / 255;
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h = 0;
  let s = 0;
  const l = (max + min) / 2;
  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r:
        h = (g - b) / d + (g < b ? 6 : 0);
        break;
      case g:
        h = (b - r) / d + 2;
        break;
      default:
        h = (r - g) / d + 4;
    }
    h /= 6;
  }
  return `${Math.round(h * 360)} ${Math.round(s * 100)}% ${Math.round(l * 100)}%`;
}

function hslStringToHex(hsl: string): string {
  const [hRaw, sRaw, lRaw] = hsl.trim().split(/\s+/);
  const h = parseFloat(hRaw) / 360;
  const s = parseFloat(sRaw) / 100;
  const l = parseFloat(lRaw) / 100;
  if (s === 0) {
    const v = Math.round(l * 255);
    return `#${[v, v, v].map((x) => x.toString(16).padStart(2, "0")).join("")}`;
  }
  const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
  const p = 2 * l - q;
  const hue2rgb = (t: number) => {
    let tt = t;
    if (tt < 0) tt += 1;
    if (tt > 1) tt -= 1;
    if (tt < 1 / 6) return p + (q - p) * 6 * tt;
    if (tt < 1 / 2) return q;
    if (tt < 2 / 3) return p + (q - p) * (2 / 3 - tt) * 6;
    return p;
  };
  const r = Math.round(hue2rgb(h + 1 / 3) * 255);
  const g = Math.round(hue2rgb(h) * 255);
  const b = Math.round(hue2rgb(h - 1 / 3) * 255);
  return `#${[r, g, b].map((x) => x.toString(16).padStart(2, "0")).join("")}`;
}

export default function SettingsPage() {
  const [settings, setSettings] = useState<Settings | null>(null);
  const [loading, setLoading] = useState(true);
  const [savingKey, setSavingKey] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadSettings() {
      try {
        const res = await fetch("/api/settings", { cache: "no-store" });
        if (!res.ok) {
          throw new Error(`Gagal memuat data (HTTP Status ${res.status})`);
        }
        const text = await res.text();
        if (!text) throw new Error("Respons server kosong.");
        
        const json = JSON.parse(text);
        if (json.data) {
          setSettings(json.data);
        } else {
          throw new Error(json.error ?? "Format data tidak valid.");
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "Gagal memuat pengaturan.");
      } finally {
        setLoading(false);
      }
    }
    loadSettings();
  }, []);

  async function saveSection(key: keyof Settings, value: unknown) {
    setSavingKey(key);
    setError(null);
    setMessage(null);
    try {
      const res = await fetch("/api/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ key, value })
      });

      const text = await res.text();
      let json;
      try {
        json = text ? JSON.parse(text) : {};
      } catch {
        throw new Error("Server tidak mengembalikan format JSON yang valid.");
      }

      if (!res.ok) throw new Error(json.error ?? `Gagal menyimpan (Status ${res.status}).`);
      
      setMessage(`Bagian "${key}" tersimpan.`);
      setTimeout(() => setMessage(null), 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Gagal menyimpan.");
    } finally {
      setSavingKey(null);
    }
  }

  if (loading) {
    return (
      <div className="flex items-center gap-2 text-ink/60">
        <Loader2 className="size-4 animate-spin" /> Memuat pengaturan...
      </div>
    );
  }

  if (!settings) {
    return <p className="text-red-600">{error ?? "Pengaturan tidak ditemukan."}</p>;
  }

  return (
    <div className="max-w-2xl space-y-8">
      <div>
        <h1 className="text-[22px] font-medium">Pengaturan Situs</h1>
        <p className="mt-1 text-[14px] text-ink/60">
          Ubah konten Hero, Tentang, Kontak, teks-teks lain di situs, dan warna tema — semua
          tampil di halaman publik setelah disimpan.
        </p>
      </div>

      {message && (
        <div className="rounded-xl border border-green-300 bg-green-50 px-4 py-3 text-[14px] text-green-700">
          {message}
        </div>
      )}
      {error && (
        <div className="rounded-xl border border-red-300 bg-red-50 px-4 py-3 text-[14px] text-red-700">
          {error}
        </div>
      )}

      <HeroSection
        value={settings.hero}
        saving={savingKey === "hero"}
        onSave={(v) => saveSection("hero", v)}
      />
      <AboutSection
        value={settings.about}
        saving={savingKey === "about"}
        onSave={(v) => saveSection("about", v)}
      />
      <ContactSection
        value={settings.contact}
        saving={savingKey === "contact"}
        onSave={(v) => saveSection("contact", v)}
      />
      <SiteTextSection
        value={settings.site}
        saving={savingKey === "site"}
        onSave={(v) => saveSection("site", v)}
      />
      <ThemeSection
        value={settings.theme}
        saving={savingKey === "theme"}
        onSave={(v) => saveSection("theme", v)}
      />
    </div>
  );
}

function SaveButton({ saving }: { saving: boolean }) {
  return (
    <button
      type="submit"
      disabled={saving}
      className="flex items-center gap-2 rounded-full bg-ink px-5 py-2.5 text-[13px] font-medium uppercase tracking-wide text-cream transition hover:bg-ink/85 disabled:opacity-50"
    >
      {saving ? <Loader2 className="size-4 animate-spin" /> : <Save className="size-4" />}
      Simpan
    </button>
  );
}

function HeroSection({
  value,
  saving,
  onSave
}: {
  value: HeroContent;
  saving: boolean;
  onSave: (v: HeroContent) => void;
}) {
  const [form, setForm] = useState(value);
  return (
    <form
      className={sectionClass}
      onSubmit={(e) => {
        e.preventDefault();
        onSave(form);
      }}
    >
      <h2 className="mb-4 text-[16px] font-medium uppercase tracking-wide">Hero (Beranda)</h2>
      <div className="space-y-4">
        <div>
          <label className={labelClass}>Eyebrow (label kecil di atas judul)</label>
          <input
            className={inputClass}
            value={form.eyebrow}
            onChange={(e) => setForm({ ...form, eyebrow: e.target.value })}
          />
        </div>
        <div>
          <label className={labelClass}>Headline</label>
          <textarea
            className={inputClass}
            rows={2}
            value={form.headline}
            onChange={(e) => setForm({ ...form, headline: e.target.value })}
          />
        </div>
        <div>
          <label className={labelClass}>Deskripsi</label>
          <textarea
            className={inputClass}
            rows={3}
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
          />
        </div>
      </div>
      <div className="mt-5">
        <SaveButton saving={saving} />
      </div>
    </form>
  );
}

function AboutSection({
  value,
  saving,
  onSave
}: {
  value: AboutContent;
  saving: boolean;
  onSave: (v: AboutContent) => void;
}) {
  const [form, setForm] = useState(value);

  function updateParagraph(i: number, text: string) {
    const next = [...form.paragraphs];
    next[i] = text;
    setForm({ ...form, paragraphs: next });
  }
  function addParagraph() {
    setForm({ ...form, paragraphs: [...form.paragraphs, ""] });
  }
  function removeParagraph(i: number) {
    setForm({ ...form, paragraphs: form.paragraphs.filter((_, idx) => idx !== i) });
  }

  function updateSkill(i: number, text: string) {
    const next = [...form.skills];
    next[i] = text;
    setForm({ ...form, skills: next });
  }
  function addSkill() {
    setForm({ ...form, skills: [...form.skills, ""] });
  }
  function removeSkill(i: number) {
    setForm({ ...form, skills: form.skills.filter((_, idx) => idx !== i) });
  }

  return (
    <form
      className={sectionClass}
      onSubmit={(e) => {
        e.preventDefault();
        onSave({
          ...form,
          paragraphs: form.paragraphs.map((p) => p.trim()).filter(Boolean),
          skills: form.skills.map((s) => s.trim()).filter(Boolean)
        });
      }}
    >
      <h2 className="mb-4 text-[16px] font-medium uppercase tracking-wide">Tentang</h2>
      <div className="space-y-4">
        <div>
          <label className={labelClass}>Judul Bagian</label>
          <input
            className={inputClass}
            value={form.heading}
            onChange={(e) => setForm({ ...form, heading: e.target.value })}
          />
        </div>

        <div>
          <label className={labelClass}>Paragraf</label>
          <div className="space-y-2">
            {form.paragraphs.map((p, i) => (
              <div key={i} className="flex gap-2">
                <textarea
                  className={inputClass}
                  rows={2}
                  value={p}
                  onChange={(e) => updateParagraph(i, e.target.value)}
                />
                <button
                  type="button"
                  onClick={() => removeParagraph(i)}
                  className="shrink-0 rounded-lg border border-ink/15 p-2 text-ink/50 hover:bg-red-50 hover:text-red-600"
                >
                  <Trash2 className="size-4" />
                </button>
              </div>
            ))}
          </div>
          <button
            type="button"
            onClick={addParagraph}
            className="mt-2 flex items-center gap-1 text-[13px] text-ink/60 hover:text-ink"
          >
            <Plus className="size-3.5" /> Tambah paragraf
          </button>
        </div>

        <div>
          <label className={labelClass}>Skill / Tag</label>
          <div className="flex flex-wrap gap-2">
            {form.skills.map((s, i) => (
              <div key={i} className="flex items-center gap-1 rounded-full border border-ink/15 pl-3 pr-1 py-1">
                <input
                  className="w-24 bg-transparent text-[13px] outline-none"
                  value={s}
                  onChange={(e) => updateSkill(i, e.target.value)}
                />
                <button
                  type="button"
                  onClick={() => removeSkill(i)}
                  className="rounded-full p-1 text-ink/40 hover:bg-red-50 hover:text-red-600"
                >
                  <Trash2 className="size-3" />
                </button>
              </div>
            ))}
            <button
              type="button"
              onClick={addSkill}
              className="flex items-center gap-1 rounded-full border border-dashed border-ink/25 px-3 py-1 text-[13px] text-ink/60 hover:text-ink"
            >
              <Plus className="size-3.5" /> Tambah
            </button>
          </div>
        </div>
      </div>
      <div className="mt-5">
        <SaveButton saving={saving} />
      </div>
    </form>
  );
}

function ContactSection({
  value,
  saving,
  onSave
}: {
  value: ContactContent;
  saving: boolean;
  onSave: (v: ContactContent) => void;
}) {
  const [form, setForm] = useState(value);

  function updateSocial(i: number, field: "label" | "url", text: string) {
    const next = [...form.socials];
    next[i] = { ...next[i], [field]: text };
    setForm({ ...form, socials: next });
  }
  function addSocial() {
    setForm({ ...form, socials: [...form.socials, { label: "", url: "" }] });
  }
  function removeSocial(i: number) {
    setForm({ ...form, socials: form.socials.filter((_, idx) => idx !== i) });
  }

  return (
    <form
      className={sectionClass}
      onSubmit={(e) => {
        e.preventDefault();
        onSave({
          ...form,
          socials: form.socials
            .map((s) => ({ label: s.label.trim(), url: s.url.trim() }))
            .filter((s) => s.label && s.url)
        });
      }}
    >
      <h2 className="mb-4 text-[16px] font-medium uppercase tracking-wide">
        Kontak & Footer
      </h2>
      <div className="space-y-4">
        <div>
          <label className={labelClass}>Judul Bagian</label>
          <input
            className={inputClass}
            value={form.heading}
            onChange={(e) => setForm({ ...form, heading: e.target.value })}
          />
        </div>
        <div>
          <label className={labelClass}>Email (tampil besar di footer)</label>
          <input
            type="email"
            className={inputClass}
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
          />
        </div>

        <div>
          <label className={labelClass}>Social links</label>
          <div className="space-y-2">
            {form.socials.map((s, i) => (
              <div key={i} className="flex gap-2">
                <input
                  className={inputClass}
                  placeholder="Label (mis. Instagram)"
                  value={s.label}
                  onChange={(e) => updateSocial(i, "label", e.target.value)}
                />
                <input
                  className={inputClass}
                  placeholder="https://..."
                  value={s.url}
                  onChange={(e) => updateSocial(i, "url", e.target.value)}
                />
                <button
                  type="button"
                  onClick={() => removeSocial(i)}
                  className="shrink-0 rounded-lg border border-ink/15 p-2 text-ink/50 hover:bg-red-50 hover:text-red-600"
                >
                  <Trash2 className="size-4" />
                </button>
              </div>
            ))}
          </div>
          <button
            type="button"
            onClick={addSocial}
            className="mt-2 flex items-center gap-1 text-[13px] text-ink/60 hover:text-ink"
          >
            <Plus className="size-3.5" /> Tambah social link
          </button>
        </div>
      </div>
      <div className="mt-5">
        <SaveButton saving={saving} />
      </div>
    </form>
  );
}

function SiteTextSection({
  value,
  saving,
  onSave
}: {
  value: SiteContent;
  saving: boolean;
  onSave: (v: SiteContent) => void;
}) {
  const [form, setForm] = useState(value);

  return (
    <form
      className={sectionClass}
      onSubmit={(e) => {
        e.preventDefault();
        onSave(form);
      }}
    >
      <h2 className="mb-1 text-[16px] font-medium uppercase tracking-wide">Teks Website</h2>
      <p className="mb-4 text-[13px] text-ink/50">
        Teks-teks lain yang tersebar di berbagai bagian situs, di luar Hero/Tentang/Kontak.
      </p>

      <div className="space-y-5">
        <div>
          <label className={labelClass}>Nama besar di section pembuka (parallax)</label>
          <input
            className={inputClass}
            value={form.parallaxName}
            onChange={(e) => setForm({ ...form, parallaxName: e.target.value })}
          />
          <p className="mt-1 text-[12px] text-ink/40">
            Dipisah spasi = jadi beberapa baris tersusun (mis. "ZULFAN FARIKH RIZANO" → 3 baris).
          </p>
        </div>

        <div>
          <label className={labelClass}>Label "Scroll" di section pembuka</label>
          <input
            className={inputClass}
            value={form.parallaxScrollLabel}
            onChange={(e) => setForm({ ...form, parallaxScrollLabel: e.target.value })}
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className={labelClass}>Eyebrow section Proyek</label>
            <input
              className={inputClass}
              value={form.projectsEyebrow}
              onChange={(e) => setForm({ ...form, projectsEyebrow: e.target.value })}
            />
          </div>
          <div>
            <label className={labelClass}>Judul section Proyek</label>
            <input
              className={inputClass}
              value={form.projectsHeading}
              onChange={(e) => setForm({ ...form, projectsHeading: e.target.value })}
            />
          </div>
          <div>
            <label className={labelClass}>Eyebrow section Karya Tulis</label>
            <input
              className={inputClass}
              value={form.writingsEyebrow}
              onChange={(e) => setForm({ ...form, writingsEyebrow: e.target.value })}
            />
          </div>
          <div>
            <label className={labelClass}>Judul section Karya Tulis</label>
            <input
              className={inputClass}
              value={form.writingsHeading}
              onChange={(e) => setForm({ ...form, writingsHeading: e.target.value })}
            />
          </div>
        </div>

        <div>
          <label className={labelClass}>Teks footer (setelah "© 2026 · ")</label>
          <input
            className={inputClass}
            value={form.footerText}
            onChange={(e) => setForm({ ...form, footerText: e.target.value })}
          />
        </div>

        <div>
          <label className={labelClass}>Menu navigasi (label tombol + item)</label>
          <div className="grid grid-cols-2 gap-3 rounded-xl border border-ink/10 p-4">
            <div>
              <label className={labelClass}>Tombol Menu</label>
              <input
                className={inputClass}
                value={form.navLabels.menuButton}
                onChange={(e) =>
                  setForm({ ...form, navLabels: { ...form.navLabels, menuButton: e.target.value } })
                }
              />
            </div>
            <div>
              <label className={labelClass}>Home</label>
              <input
                className={inputClass}
                value={form.navLabels.home}
                onChange={(e) =>
                  setForm({ ...form, navLabels: { ...form.navLabels, home: e.target.value } })
                }
              />
            </div>
            <div>
              <label className={labelClass}>Works</label>
              <input
                className={inputClass}
                value={form.navLabels.works}
                onChange={(e) =>
                  setForm({ ...form, navLabels: { ...form.navLabels, works: e.target.value } })
                }
              />
            </div>
            <div>
              <label className={labelClass}>Tulisan</label>
              <input
                className={inputClass}
                value={form.navLabels.writings}
                onChange={(e) =>
                  setForm({ ...form, navLabels: { ...form.navLabels, writings: e.target.value } })
                }
              />
            </div>
            <div>
              <label className={labelClass}>About</label>
              <input
                className={inputClass}
                value={form.navLabels.about}
                onChange={(e) =>
                  setForm({ ...form, navLabels: { ...form.navLabels, about: e.target.value } })
                }
              />
            </div>
            <div>
              <label className={labelClass}>Contact</label>
              <input
                className={inputClass}
                value={form.navLabels.contact}
                onChange={(e) =>
                  setForm({ ...form, navLabels: { ...form.navLabels, contact: e.target.value } })
                }
              />
            </div>
          </div>
        </div>
      </div>

      <div className="mt-5">
        <SaveButton saving={saving} />
      </div>
    </form>
  );
}

function ColorField({
  label,
  hex,
  onChange
}: {
  label: string;
  hex: string;
  onChange: (hex: string) => void;
}) {
  return (
    <div className="flex items-center gap-3">
      <input
        type="color"
        value={hex}
        onChange={(e) => onChange(e.target.value)}
        className="h-9 w-12 shrink-0 cursor-pointer rounded-md border border-ink/15 bg-transparent p-0.5"
      />
      <span className="text-[13px] text-ink/70">{label}</span>
    </div>
  );
}

function ThemePalette({
  title,
  colors,
  defaults,
  onChange
}: {
  title: string;
  colors: ThemeColors;
  defaults: ThemeColors;
  onChange: (colors: ThemeColors) => void;
}) {
  const fields: { key: keyof ThemeColors; label: string }[] = [
    { key: "background", label: "Background" },
    { key: "foreground", label: "Teks utama" },
    { key: "muted", label: "Muted (elemen halus)" },
    { key: "mutedForeground", label: "Teks muted" },
    { key: "ring", label: "Aksen (ring/highlight)" }
  ];

  return (
    <div className="rounded-xl border border-ink/10 p-4">
      <div className="mb-3 flex items-center justify-between">
        <p className="text-[13px] font-medium uppercase tracking-wide text-ink/70">{title}</p>
        <button
          type="button"
          onClick={() =>
            onChange({ background: "", foreground: "", muted: "", mutedForeground: "", ring: "" })
          }
          className="text-[12px] text-ink/40 underline hover:text-ink"
        >
          Reset ke default
        </button>
      </div>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
        {fields.map(({ key, label }) => (
          <ColorField
            key={key}
            label={label}
            hex={colors[key] ? hslStringToHex(colors[key]) : defaults[key]}
            onChange={(hex) => onChange({ ...colors, [key]: hexToHslString(hex) })}
          />
        ))}
      </div>
    </div>
  );
}

function ThemeSection({
  value,
  saving,
  onSave
}: {
  value: ThemeContent;
  saving: boolean;
  onSave: (v: ThemeContent) => void;
}) {
  const [form, setForm] = useState(value);

  return (
    <form
      className={sectionClass}
      onSubmit={(e) => {
        e.preventDefault();
        onSave(form);
      }}
    >
      <h2 className="mb-1 text-[16px] font-medium uppercase tracking-wide">Tema Warna</h2>
      <p className="mb-4 text-[13px] text-ink/50">
        Ganti warna tema terang dan gelap. Klik "Reset ke default" buat balik ke warna bawaan situs.
      </p>

      <div className="space-y-4">
        <ThemePalette
          title="Tema Terang"
          colors={form.light}
          defaults={defaultLight}
          onChange={(light) => setForm({ ...form, light })}
        />
        <ThemePalette
          title="Tema Gelap"
          colors={form.dark}
          defaults={defaultDark}
          onChange={(dark) => setForm({ ...form, dark })}
        />
      </div>

      <div className="mt-5">
        <SaveButton saving={saving} />
      </div>
    </form>
  );
}