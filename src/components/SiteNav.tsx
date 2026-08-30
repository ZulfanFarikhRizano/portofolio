"use client";

import FloatingMenu from "./FloatingMenu";

function scrollToId(id: string) {
  document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
}

interface NavLabels {
  home: string;
  works: string;
  writings: string;
  about: string;
  contact: string;
  menuButton: string;
}

export function SiteNav({ labels }: { labels: NavLabels }) {
  return (
    <FloatingMenu
      buttonLabel={labels.menuButton}
      items={[
        { label: labels.home, onClick: () => scrollToId("home") },
        { label: labels.works, onClick: () => scrollToId("works") },
        { label: labels.writings, onClick: () => scrollToId("writings") },
        { label: labels.about, onClick: () => scrollToId("about") },
        { label: labels.contact, onClick: () => scrollToId("contact") }
      ]}
    />
  );
}