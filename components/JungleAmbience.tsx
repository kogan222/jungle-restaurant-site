"use client";

import { useEffect, useRef, useState } from "react";

/* ================================================================
   JUNGLE AMBIENCE — Subtle global ambient layer.

   Keeps three premium details:
   1. Jungle eyes — appear rarely in dark edges (discoverable)
   2. Tropical bird — silhouette, occasionally crosses screen
   3. Cursor glow — soft jungle radial on desktop

   NO monkey. NO cartoons. Everything subtle and cinematic.
   ================================================================ */

/* Glowing jungle eyes — rare, mysterious */
function JungleEyes({ style }: { style?: React.CSSProperties }) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    let timer: ReturnType<typeof setTimeout>;
    const cycle = () => {
      setVisible(false);
      timer = setTimeout(() => {
        setVisible(true);
        timer = setTimeout(cycle, 2800 + Math.random() * 4200);
      }, 12000 + Math.random() * 20000);
    };
    timer = setTimeout(cycle, 8000 + Math.random() * 10000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div
      className="fixed pointer-events-none select-none"
      style={{
        ...style, zIndex: 15,
        opacity: visible ? 1 : 0,
        transition: "opacity 3s ease",
        filter: "drop-shadow(0 0 5px rgba(100,255,180,0.7))",
      }}
      aria-hidden="true"
    >
      <svg width="40" height="20" viewBox="0 0 40 20" fill="none">
        {[11, 29].map((cx, i) => (
          <g key={i}>
            <ellipse cx={cx} cy="10" rx="8.5" ry="5.5" fill="rgba(6,18,8,0.95)" />
            <ellipse cx={cx} cy="10" rx="5.5" ry="3.5" fill="#0e2a12"
              style={{ animation: `eyeBlink ${4.5 + i * 0.3}s ease-in-out ${i * 0.4}s infinite`, transformOrigin: `${cx}px 10px` }} />
            <circle cx={cx} cy="10" r="2.8" fill="#5abe78" />
            <circle cx={cx} cy="10" r="1.4" fill="#060e08" />
            <circle cx={cx + 1} cy={9} r="0.7" fill="rgba(255,255,255,0.65)" />
          </g>
        ))}
      </svg>
    </div>
  );
}

/* Tropical bird silhouette — elegant, dark, occasional */
function TropicalBird() {
  const [active, setActive] = useState(false);
  const [top, setTop]       = useState(25);
  const [flip, setFlip]     = useState(false);

  useEffect(() => {
    const launch = () => {
      setTop(10 + Math.random() * 35);
      setFlip(Math.random() > 0.5);
      setActive(true);
      setTimeout(() => setActive(false), 22000);
    };
    const t = setTimeout(launch, 8000);
    const iv = setInterval(launch, 45000 + Math.random() * 30000);
    return () => { clearTimeout(t); clearInterval(iv); };
  }, []);

  if (!active) return null;

  return (
    <div
      className="fixed pointer-events-none select-none"
      style={{
        top: `${top}%`,
        zIndex: 28,
        animation: "birdFly 22s ease-in-out forwards",
        transform: flip ? "scaleX(-1)" : "none",
        opacity: 0.65,
      }}
      aria-hidden="true"
    >
      {/* Elegant dark silhouette — no cartoon colours */}
      <svg width="38" height="22" viewBox="0 0 38 22" fill="none">
        <ellipse cx="19" cy="13" rx="9.5" ry="4"   fill="#050e05" />
        <circle  cx="27"  cy="10" r="4.2"           fill="#060f06" />
        <path    d="M30.5 10 L35 9.5 L30.5 11.5Z"  fill="#0a160a" />
        <path    d="M19 11 C11 4, 3 7, 0 9 C4 8, 11 10, 19 11Z"  fill="#040c04" />
        <path    d="M19 11 C11 17, 3 15, 0 13 C4 14, 11 12, 19 11Z" fill="#030a03" opacity="0.6" />
        <path    d="M9 13 L2 10 L2 14Z" fill="#040c04" />
        <circle  cx="27.5" cy="9.5" r="1.2" fill="#0f1e0f" />
        <circle  cx="27.8" cy="9.2" r="0.5" fill="rgba(255,255,255,0.25)" />
      </svg>
    </div>
  );
}

/* Desktop cursor glow */
function CursorGlow() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (typeof window === "undefined" || window.matchMedia("(hover: none)").matches) return;
    let visible = false;
    const onMove = (e: MouseEvent) => {
      if (!visible && ref.current) { ref.current.style.opacity = "1"; visible = true; }
      if (ref.current) {
        ref.current.style.left = `${e.clientX}px`;
        ref.current.style.top  = `${e.clientY}px`;
      }
    };
    const onLeave = () => { if (ref.current) { ref.current.style.opacity = "0"; visible = false; } };
    window.addEventListener("mousemove", onMove, { passive: true });
    document.addEventListener("mouseleave", onLeave);
    return () => { window.removeEventListener("mousemove", onMove); document.removeEventListener("mouseleave", onLeave); };
  }, []);

  return (
    <div
      ref={ref}
      className="cursor-glow hidden md:block"
      style={{ opacity: 0, transition: "opacity 0.4s ease" }}
    />
  );
}

export default function JungleAmbience() {
  return (
    <>
      <CursorGlow />
      <TropicalBird />
      {/* Eyes in extreme edges — barely visible, discovered on scroll */}
      <JungleEyes style={{ bottom: "30%", left: "0.5%" }} />
      <JungleEyes style={{ top:    "44%", right: "0.3%" }} />
    </>
  );
}
