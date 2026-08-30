import type { Metadata } from "next";
import "./globals.css";
import { ThemeProvider } from "@/components/ThemeProvider";
import { prisma } from "@/lib/prisma";

export const metadata: Metadata = {
  title: "Zuzu — Full-Stack Developer",
  description:
    "Portofolio Zuzu, full-stack web developer: proyek, studi kasus, dan cara menghubungi."
};

interface ThemeColors {
  background: string;
  foreground: string;
  muted: string;
  mutedForeground: string;
  ring: string;
}

async function getThemeOverrides() {
  const row = await prisma.siteSettings.findUnique({ where: { key: "theme" } });
  if (!row) return null;
  try {
    return JSON.parse(row.valueJson) as { light: ThemeColors; dark: ThemeColors };
  } catch {
    return null;
  }
}

// Build baris CSS var override, lewati field yang masih kosong (biar fallback ke default globals.css)
function buildVars(colors: ThemeColors | undefined) {
  if (!colors) return "";
  const map: Record<string, string> = {
    "--background": colors.background,
    "--foreground": colors.foreground,
    "--muted": colors.muted,
    "--muted-foreground": colors.mutedForeground,
    "--ring": colors.ring
  };
  return Object.entries(map)
    .filter(([, v]) => v && v.trim())
    .map(([k, v]) => `${k}: ${v};`)
    .join(" ");
}

export default async function RootLayout({
  children
}: {
  children: React.ReactNode;
}) {
  const theme = await getThemeOverrides();
  const lightVars = buildVars(theme?.light);
  const darkVars = buildVars(theme?.dark);

  return (
    <html lang="id" suppressHydrationWarning>
      <head>
        {/* Override warna tema kustom dari /admin/settings. Ditaruh setelah globals.css
            lewat urutan render, jadi menang atas nilai default kalau field-nya diisi. */}
        {(lightVars || darkVars) && (
          <style
            id="theme-overrides"
            dangerouslySetInnerHTML={{
              __html: `${lightVars ? `:root { ${lightVars} }` : ""} ${
                darkVars ? `.dark { ${darkVars} }` : ""
              }`
            }}
          />
        )}
      </head>
      <body className="bg-background text-foreground antialiased transition-colors duration-500">
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem={false} disableTransitionOnChange>
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}