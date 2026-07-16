"use client";

import { useEffect, useRef, useState } from "react";

/* ================================================================
   JUNGLE CREATURES — Premium atmospheric wildlife.
   All creatures are cinematic, stylized-realistic silhouettes.
   They feel like "discoveries", not decorations.
   ================================================================ */

/* ── Butterfly ────────────────────────────────────────────── */
function Butterfly({
  x, y, delay = 0, size = 1, color = "#f04e30",
}: { x: string; y: string; delay?: number; size?: number; color?: string; }) {
  return (
    <div
      className="absolute pointer-events-none select-none"
      style={{ left: x, top: y, zIndex: 22 }}
      aria-hidden="true"
    >
      <div style={{ animation: `butterflyFloat ${8 + delay}s ease-in-out ${delay}s infinite` }}>
        <svg
          width={40 * size}
          height={30 * size}
          viewBox="0 0 40 30"
          fill="none"
          style={{ animation: `butterflyWing 0.4s ease-in-out infinite alternate` }}
        >
          {/* Left wings */}
          <path d="M20 15 C12 6, 2 4, 1 12 C0 20, 10 24, 20 15Z" fill={color} opacity="0.85" />
          <path d="M20 15 C14 20, 6 28, 8 26 C10 24, 16 20, 20 15Z" fill={color} opacity="0.65" />
          {/* Right wings */}
          <path d="M20 15 C28 6, 38 4, 39 12 C40 20, 30 24, 20 15Z" fill={color} opacity="0.85" />
          <path d="M20 15 C26 20, 34 28, 32 26 C30 24, 24 20, 20 15Z" fill={color} opacity="0.65" />
          {/* Wing markings */}
          <circle cx="12" cy="11" r="3" fill="rgba(255,255,255,0.2)" />
          <circle cx="28" cy="11" r="3" fill="rgba(255,255,255,0.2)" />
          {/* Body */}
          <ellipse cx="20" cy="15" rx="1.5" ry="6" fill="#1a0a00" opacity="0.8" />
          {/* Antennae */}
          <path d="M19 10 C17 6, 14 4, 13 3" stroke="#1a0a00" strokeWidth="0.8" fill="none" strokeLinecap="round" />
          <path d="M21 10 C23 6, 26 4, 27 3" stroke="#1a0a00" strokeWidth="0.8" fill="none" strokeLinecap="round" />
          <circle cx="13" cy="3"  r="1" fill="#1a0a00" />
          <circle cx="27" cy="3"  r="1" fill="#1a0a00" />
        </svg>
      </div>
    </div>
  );
}

/* ── Tiny tree frog silhouette ──────────────────────────────── */
function TreeFrog({ x, y, size = 1 }: { x: string; y: string; size?: number }) {
  const [show, setShow] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setShow(true), 4000 + Math.random() * 6000);
    return () => clearTimeout(t);
  }, []);

  return (
    <div
      className="absolute pointer-events-none select-none"
      style={{
        left: x, top: y, zIndex: 20,
        opacity: show ? 0.7 : 0,
        transition: "opacity 3s ease",
      }}
      aria-hidden="true"
    >
      <svg width={28 * size} height={22 * size} viewBox="0 0 28 22" fill="none">
        {/* Body */}
        <ellipse cx="14" cy="13" rx="9" ry="7" fill="#2d6e2d" opacity="0.9" />
        {/* Head */}
        <circle cx="14" cy="7" r="6" fill="#3d8a3d" />
        {/* Eyes — big and round */}
        <circle cx="10" cy="5" r="2.8" fill="#62a062" />
        <circle cx="18" cy="5" r="2.8" fill="#62a062" />
        <circle cx="10" cy="5" r="1.5" fill="#0a1a0a" />
        <circle cx="18" cy="5" r="1.5" fill="#0a1a0a" />
        <circle cx="10.5" cy="4.5" r="0.5" fill="rgba(255,255,255,0.7)" />
        <circle cx="18.5" cy="4.5" r="0.5" fill="rgba(255,255,255,0.7)" />
        {/* Legs */}
        <path d="M5 16 C2 18, 0 20, 1 21" stroke="#2d6e2d" strokeWidth="2" strokeLinecap="round" fill="none" />
        <path d="M23 16 C26 18, 28 20, 27 21" stroke="#2d6e2d" strokeWidth="2" strokeLinecap="round" fill="none" />
        {/* Sticky toe pads */}
        <circle cx="1"  cy="21" r="1.5" fill="#3d8a3d" />
        <circle cx="27" cy="21" r="1.5" fill="#3d8a3d" />
        {/* Belly markings */}
        <ellipse cx="14" cy="14" rx="5" ry="4" fill="#62a062" opacity="0.4" />
        {/* Smile */}
        <path d="M11 10 Q14 12 17 10" stroke="#245824" strokeWidth="0.7" fill="none" strokeLinecap="round" />
      </svg>
    </div>
  );
}

/* ── Monkey silhouette in far distance ─────────────────────── */
function DistantMonkey({ x, y, delay = 0 }: { x: string; y: string; delay?: number }) {
  return (
    <div
      className="absolute pointer-events-none select-none"
      style={{ left: x, top: y, zIndex: 6, opacity: 0.35 }}
      aria-hidden="true"
    >
      <div style={{
        animation: `monkeySwing ${3.5 + delay * 0.5}s ease-in-out ${delay}s infinite`,
        transformOrigin: "top center",
      }}>
        {/* Very simplified silhouette — just a dark shape */}
        <svg width="16" height="28" viewBox="0 0 16 28" fill="none">
          {/* Vine */}
          <line x1="8" y1="0" x2="8" y2="8" stroke="#1a0f00" strokeWidth="1.5" />
          {/* Body silhouette */}
          <ellipse cx="8" cy="16" rx="5" ry="6" fill="#0a0500" />
          <circle cx="8" cy="9"  r="4" fill="#0a0500" />
          {/* Tail */}
          <path d="M12 20 C16 24, 16 28, 13 27" stroke="#0a0500" strokeWidth="2" fill="none" strokeLinecap="round" />
        </svg>
      </div>
    </div>
  );
}

/* ── Gecko on surface ──────────────────────────────────────── */
function Gecko({ x, y }: { x: string; y: string }) {
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 8000 + Math.random() * 10000);
    return () => clearTimeout(t);
  }, []);

  return (
    <div
      className="absolute pointer-events-none select-none"
      style={{
        left: x, bottom: y, zIndex: 25,
        opacity: visible ? 0.6 : 0,
        transition: "opacity 4s ease",
      }}
      aria-hidden="true"
    >
      <svg width="36" height="16" viewBox="0 0 36 16" fill="none">
        {/* Body */}
        <ellipse cx="18" cy="9" rx="11" ry="5" fill="#3d8a3d" opacity="0.9" />
        {/* Head */}
        <ellipse cx="30" cy="9" rx="6" ry="4.5" fill="#4a9a4a" />
        {/* Tail */}
        <path d="M7 9 C4 10, 2 9, 0 10" stroke="#2d6e2d" strokeWidth="3" fill="none" strokeLinecap="round" />
        {/* Eyes */}
        <circle cx="32" cy="7" r="1.5" fill="#ce8b4d" />
        <ellipse cx="32" cy="7" rx="0.5" ry="1.2" fill="#0a1a0a" />
        {/* Legs */}
        <path d="M12 9 L9 14" stroke="#2d6e2d" strokeWidth="1.5" strokeLinecap="round" />
        <path d="M12 9 L9 4" stroke="#2d6e2d" strokeWidth="1.5" strokeLinecap="round" />
        <path d="M24 9 L27 14" stroke="#2d6e2d" strokeWidth="1.5" strokeLinecap="round" />
        <path d="M24 9 L27 4" stroke="#2d6e2d" strokeWidth="1.5" strokeLinecap="round" />
        {/* Scale pattern */}
        {[13,17,21].map((cx, i) => (
          <circle key={i} cx={cx} cy={8} r="1" fill="#62a062" opacity="0.5" />
        ))}
      </svg>
    </div>
  );
}

/* ── Glowing firefly swarm (dense version for special sections) */
export function DenseFireflies({ count = 30 }: { count?: number }) {
  function sr(s: number) { return (Math.sin(s * 127.1 + 311.7) * 43758.5453) % 1; }
  const flies = Array.from({ length: count }, (_, i) => ({
    x: sr(i * 7.3) * 95 + 2,
    y: sr(i * 3.1) * 90 + 5,
    size: 2 + sr(i * 5.7) * 2.5,
    dur: 4 + sr(i * 2.9) * 8,
    delay: sr(i * 9.3) * 6,
    color: sr(i * 11.7) < 0.5
      ? `rgba(180,220,80,`
      : sr(i * 13.3) < 0.7
      ? `rgba(140,210,100,`
      : `rgba(220,200,80,`,
  }));

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden" aria-hidden="true">
      {flies.map((f, i) => (
        <div
          key={i}
          className="absolute"
          style={{
            left: `${f.x}%`, top: `${f.y}%`,
            animation: `fireflyDrift ${f.dur}s ease-in-out ${f.delay}s infinite`,
          }}
        >
          <div
            style={{
              width: f.size, height: f.size, borderRadius: "50%",
              background: `${f.color}0.9)`,
              boxShadow: `0 0 ${f.size * 3}px ${f.size * 1.5}px ${f.color}0.4), 0 0 ${f.size * 6}px ${f.size * 3}px ${f.color}0.15)`,
              animation: `fireflyPulse ${1 + sr(i * 15.7) * 2}s ease-in-out ${f.delay * 0.3}s infinite alternate`,
            }}
          />
        </div>
      ))}
    </div>
  );
}

/* ── Main export — place in different sections ─────────────── */
export default function JungleCreatures({ section = "hero" }: { section?: string }) {
  if (section === "hero") {
    return (
      <>
        {/* Distant monkeys in the tree canopy */}
        <DistantMonkey x="8%"  y="22%" delay={0} />
        <DistantMonkey x="82%" y="28%" delay={1.8} />
        <DistantMonkey x="61%" y="18%" delay={0.9} />
        {/* Butterflies near CTA */}
        <Butterfly x="72%" y="58%" delay={0}   size={1.1} color="#f04e30" />
        <Butterfly x="18%" y="65%" delay={2.5} size={0.8} color="#62a062" />
        {/* Tiny gecko on a branch */}
        <Gecko x="78%" y="35%" />
      </>
    );
  }
  if (section === "vibe") {
    return (
      <>
        <Butterfly x="85%" y="20%" delay={1}   size={0.9} color="#ce8b4d" />
        <Butterfly x="5%"  y="45%" delay={3.2} size={0.8} color="#62a062" />
        <TreeFrog x="90%" y="35%" />
        <DistantMonkey x="12%" y="15%" delay={0.5} />
      </>
    );
  }
  if (section === "drinks") {
    return (
      <>
        <Butterfly x="88%" y="15%" delay={0.5} size={1.0} color="#62a062" />
        <TreeFrog x="2%" y="45%" />
      </>
    );
  }
  return null;
}
