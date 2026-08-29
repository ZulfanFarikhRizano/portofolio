"use client";

import FloatingMenu from "./FloatingMenu";

function scrollToId(id: string) {
  document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
}

export function SiteNav() {
  return (
    <FloatingMenu
      items={[
        { label: "Home", onClick: () => scrollToId("home") },
        { label: "Works", onClick: () => scrollToId("works") },
        { label: "Tulisan", onClick: () => scrollToId("writings") },
        { label: "About", onClick: () => scrollToId("about") },
        { label: "Contact", onClick: () => scrollToId("contact") }
      ]}
    />
  );
}
