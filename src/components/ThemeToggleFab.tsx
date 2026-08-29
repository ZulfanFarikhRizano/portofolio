"use client";

import CinematicThemeSwitcher from "@/components/ui/cinematic-theme-switcher";

export function ThemeToggleFab() {
  return (
    <div className="fixed right-5 top-5 z-[110] origin-top-right scale-[0.7] md:right-8 md:top-8 md:scale-90">
      <CinematicThemeSwitcher />
    </div>
  );
}
