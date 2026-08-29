import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./src/app/**/*.{ts,tsx}",
    "./src/components/**/*.{ts,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        // Warna brand tetap (dipakai FloatingMenu, TextRoll, CoverflowCarousel,
        // dan Contact section yang sengaja selalu kontras gelap) — tidak berubah per tema.
        ink: "#242424",
        cream: "#f7f1ed",
        yolk: "#FFE862",
        yolkDeep: "#d1bb3b",
        // Token semantik yang berganti otomatis lewat class "dark" di <html>
        // (lihat globals.css). Format "<alpha-value>" supaya bg-background/70 dst berfungsi.
        background: "hsl(var(--background) / <alpha-value>)",
        foreground: "hsl(var(--foreground) / <alpha-value>)",
        muted: "hsl(var(--muted) / <alpha-value>)",
        "muted-foreground": "hsl(var(--muted-foreground) / <alpha-value>)",
        ring: "hsl(var(--ring) / <alpha-value>)"
      },
      fontFamily: {
        display: ["'Trobika'", "'Bebas Neue'", "sans-serif"],
        body: ["'Aeonik TRIAL'", "'Inter'", "sans-serif"]
      },
      keyframes: {
        marquee: {
          "0%": { transform: "translateX(0%)" },
          "100%": { transform: "translateX(-50%)" }
        }
      },
      animation: {
        marquee: "marquee 22s linear infinite"
      }
    }
  },
  plugins: []
};

export default config;
