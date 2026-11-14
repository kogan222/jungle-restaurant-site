"use client";

import { useEffect } from "react";

/*
  Pauses every CSS animation inside a homepage section while that section is
  off screen (globals.css → .anim-offscreen). The page runs hundreds of
  decorative loops (fireflies, vine leaves, fog); paused animations cost
  nothing, so only what the visitor can actually see keeps animating.
  The 200px margin restarts a section just before it scrolls into view.
*/
export default function AnimationGate() {
  useEffect(() => {
    const sections = document.querySelectorAll<HTMLElement>("#main-content > *");
    if (!sections.length || !("IntersectionObserver" in window)) return;
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) e.target.classList.toggle("anim-offscreen", !e.isIntersecting);
      },
      { rootMargin: "200px 0px" }
    );
    sections.forEach((s) => io.observe(s));
    return () => io.disconnect();
  }, []);

  return null;
}
