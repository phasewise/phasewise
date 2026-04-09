"use client";

import { useEffect } from "react";

export default function NavScrollEffect() {
  useEffect(() => {
    const nav = document.getElementById("pw-nav");
    if (!nav) return;

    const onScroll = () => {
      if (window.scrollY > 20) {
        nav.classList.add("shadow-[0_2px_24px_rgba(26,46,34,0.08)]");
      } else {
        nav.classList.remove("shadow-[0_2px_24px_rgba(26,46,34,0.08)]");
      }
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return null;
}
