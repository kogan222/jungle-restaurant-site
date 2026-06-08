"use client";

import { useEffect, useRef, useMemo } from "react";

/* ================================================================
   FALLING LEAVES — Cinematic ambient leaf system
   Uses nested div technique for compound motion (horizontal drift
   + vertical fall + rotation) with pure CSS for max performance.
   ================================================================ */

const LEAF_SHAPES = [
  /* Narrow elongated tropical */
  "M10 2 C6 7, 1 14, 3 20 C5 25, 10 27, 10 27 C10 27, 9 18, 10 2Z M10 2 C14 7, 19 14, 17 20 C15 25, 10 27, 10 27 C10 27, 11 18, 10 2Z",
  /* Wide monstera-style */
  "M14 2 C6 8, 0 18, 5 26 C8 31, 16 33, 17 29 C11 24, 9 16, 14 2Z M14 2 C22 7, 28 18, 23 26 C20 31, 12 33, 11 29 C17 24, 19 16, 14 2Z",
  /* Round leaf */
  "M9 3 C3 8, 1 16, 5 22 C7 26, 13 27, 13 23 C9 19, 7 13, 9 3Z M9 3 C15 7, 17 15, 13 22 C11 26, 5 27, 5 23 C9 19, 11 13, 9 3Z",
  /* Small oval bud */
  "M7 2 C3 6, 1 11, 3 16 C5 19, 9 20, 9 17 C7 14, 6 9, 7 2Z M7 2 C11 5, 13 11, 11 16 C9 19, 5 20, 5 17 C7 14, 8 9, 7 2Z",
  /* Elongated palm frond */
  "M8 1 C4 5, 0 12, 2 20 C4 26, 8 28, 8 25 C6 20, 5 14, 8 1Z M8 1 C12 4, 16 12, 14 20 C12 26, 8 28, 8 25 C10 20, 11 14, 8 1Z",
];

const LEAF_COLORS = [
  "#1e461e", "#245824", "#2d6e2d", "#3d8a3d",
  "#183a18", "#1a4a1a", "#a67035", "#8a5a28",
  "#62a062", "#4a8a4a",
];

const VEIN_COLORS = [
  "#2d6e2d", "#3d8a3d", "#4a9a4a", "#c49050", "#7ab07a",
];

type LeafConfig = {
  id: number;
  x: number;
  driftX: number;
  fallDuration: number;
  driftDuration: number;
  delay: number;
  size: number;
  shapeIdx: number;
  colorIdx: number;
  veinIdx: number;
  rotStart: number;
  rotEnd: number;
  opacity: number;
};

function seededRandom(seed: number) {
  const x = Math.sin(seed + 1) * 10000;
  return x - Math.floor(x);
}

function buildLeaves(count: number): LeafConfig[] {
  return Array.from({ length: count }, (_, i) => ({
    id: i,
    x: seededRandom(i * 7.3) * 96,
    driftX: (seededRandom(i * 3.1) - 0.5) * 120,
    fallDuration: 12 + seededRandom(i * 1.9) * 16,
    driftDuration: 5 + seededRandom(i * 4.7) * 8,
    delay: seededRandom(i * 2.3) * 25,
    size: 18 + seededRandom(i * 5.1) * 22,
    shapeIdx: Math.floor(seededRandom(i * 6.3) * LEAF_SHAPES.length),
    colorIdx: Math.floor(seededRandom(i * 8.1) * LEAF_COLORS.length),
    veinIdx: Math.floor(seededRandom(i * 9.7) * VEIN_COLORS.length),
    rotStart: seededRandom(i * 2.7) * 360,
    rotEnd: seededRandom(i * 3.9) * 360 + 360,
    opacity: 0.35 + seededRandom(i * 1.3) * 0.55,
  }));
}

export default function FallingLeaves({ count = 22 }: { count?: number }) {
  const leaves = useMemo(() => buildLeaves(count), [count]);

  return (
    <div
      className="fixed inset-0 pointer-events-none overflow-hidden z-10"
      aria-hidden="true"
      style={{ perspective: "800px" }}
    >
      {leaves.map((leaf) => (
        <div
          key={leaf.id}
          style={{
            position: "absolute",
            top: "-8vh",
            left: `${leaf.x}%`,
            /* Outer div handles horizontal drift only */
            animation: `leafWindDrift ${leaf.driftDuration}s ease-in-out ${leaf.delay}s infinite alternate`,
            willChange: "transform",
          }}
        >
          <div
            style={{
              /* Inner div handles vertical fall + rotation */
              animation: `leafFallDown ${leaf.fallDuration}s linear ${leaf.delay}s infinite`,
              willChange: "transform, opacity",
            }}
          >
            <svg
              width={leaf.size}
              height={leaf.size * 1.5}
              viewBox="0 0 20 28"
              fill="none"
              style={{
                opacity: leaf.opacity,
                filter: `drop-shadow(0 2px 4px rgba(0,0,0,0.25))`,
                animation: `leafRotateFall ${leaf.fallDuration}s linear ${leaf.delay}s infinite`,
              }}
            >
              <path
                d={LEAF_SHAPES[leaf.shapeIdx]}
                fill={LEAF_COLORS[leaf.colorIdx]}
              />
              <line
                x1="10" y1="3" x2="10" y2="24"
                stroke={VEIN_COLORS[leaf.veinIdx]}
                strokeWidth="0.6"
                opacity="0.5"
              />
              {/* Side veins */}
              {[8, 13, 18].map((y, vi) => (
                <g key={vi}>
                  <line x1="10" y1={y} x2={6 - vi * 0.5} y2={y + 3} stroke={VEIN_COLORS[leaf.veinIdx]} strokeWidth="0.4" opacity="0.35" />
                  <line x1="10" y1={y} x2={14 + vi * 0.5} y2={y + 3} stroke={VEIN_COLORS[leaf.veinIdx]} strokeWidth="0.4" opacity="0.35" />
                </g>
              ))}
            </svg>
          </div>
        </div>
      ))}
    </div>
  );
}
