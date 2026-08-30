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
  background?: string;
  foreground?: string;
  muted?: string;
  mutedForeground?: string;
  ring?: string;
}

async function getThemeOverrides() {
  try {
    const row = await prisma.siteSettings.findUnique({ where: { key: "theme" } });
    if (!row?.valueJson) return null;
    return JSON.parse(row.valueJson) as { light?: ThemeColors; dark?: ThemeColors };
  } catch (error) {
    console.error("Failed to parse theme overrides:", error);
    return null;
  }
}

// Format variabel CSS agar selalu valid saat di-inject
function buildVars(colors?: ThemeColors) {
  if (!colors || typeof colors !== "object") return "";

  const map: Record<string, string | undefined> = {
    "--background": colors.background,
    "--foreground": colors.foreground,
    "--muted": colors.muted,
    "--muted-foreground": colors.mutedForeground,
    "--ring": colors.ring
  };

  const validEntries = Object.entries(map).filter(
    ([, val]) => typeof val === "string" && val.trim().length > 0
  );

  if (validEntries.length === 0) return "";

  return validEntries.map(([key, val]) => `${key}: ${val?.trim()};`).join(" ");
}

export default async function RootLayout({
  children
}: {
  children: React.ReactNode;
}) {
  const theme = await getThemeOverrides();
  const lightVars = buildVars(theme?.light);
  const darkVars = buildVars(theme?.dark);
  const hasOverrides = Boolean(lightVars || darkVars);

  return (
    <html lang="id" suppressHydrationWarning>
      <head>
        {hasOverrides && (
          <style
            id="theme-overrides"
            dangerouslySetInnerHTML={{
              __html: [
                lightVars ? `:root { ${lightVars} }` : "",
                darkVars ? `.dark { ${darkVars} }` : ""
              ]
                .filter(Boolean)
                .join(" ")
            }}
          />
        )}
      </head>
      <body className="bg-background text-foreground antialiased transition-colors duration-500">
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem={false}
          disableTransitionOnChange
        >
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}