"use client";

import { useMemo } from "react";

/* ================================================================
   FIREFLIES — Glowing ambient insects for dark sections
   Pure CSS animation, zero JS after mount.
   ================================================================ */

type Firefly = {
  id: number;
  x: number;
  y: number;
  size: number;
  glowColor: string;
  duration: number;
  delay: number;
  driftX: number;
  driftY: number;
};

function sr(seed: number) {
  const x = Math.sin(seed * 127.1 + 311.7) * 43758.5453;
  return x - Math.floor(x);
}

const GLOW_COLORS = [
  "rgba(180, 220, 80, 0.9)",   /* bioluminescent green */
  "rgba(140, 210, 100, 0.85)", /* jungle green */
  "rgba(220, 200, 80, 0.8)",   /* warm gold */
  "rgba(160, 230, 120, 0.9)",  /* bright lime */
  "rgba(200, 240, 100, 0.75)", /* yellow-green */
];

export default function Fireflies({
  count = 18,
  className = "",
}: {
  count?: number;
  className?: string;
}) {
  const flies: Firefly[] = useMemo(
    () =>
      Array.from({ length: count }, (_, i) => ({
        id: i,
        x: 2 + sr(i * 3.7) * 96,
        y: 5 + sr(i * 5.1) * 88,
        size: 2.5 + sr(i * 2.3) * 2.5,
        glowColor: GLOW_COLORS[Math.floor(sr(i * 7.9) * GLOW_COLORS.length)],
        duration: 5 + sr(i * 1.1) * 9,
        delay: sr(i * 4.3) * 8,
        driftX: (sr(i * 6.1) - 0.5) * 80,
        driftY: (sr(i * 8.3) - 0.5) * 60,
      })),
    [count]
  );

  return (
    <div
      className={`absolute inset-0 pointer-events-none overflow-hidden ${className}`}
      aria-hidden="true"
    >
      {flies.map((fly) => (
        <div
          key={fly.id}
          style={{
            position: "absolute",
            left: `${fly.x}%`,
            top: `${fly.y}%`,
            animation: `fireflyDrift ${fly.duration}s ease-in-out ${fly.delay}s infinite`,
            willChange: "transform, opacity",
          }}
        >
          {/* Outer glow halo */}
          <div
            style={{
              width: fly.size * 8,
              height: fly.size * 8,
              borderRadius: "50%",
              background: `radial-gradient(circle, ${fly.glowColor.replace("0.9", "0.2")} 0%, transparent 70%)`,
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              animation: `fireflyGlow ${fly.duration * 0.6}s ease-in-out ${fly.delay}s infinite alternate`,
            }}
          />
          {/* Core dot */}
          <div
            style={{
              width: fly.size,
              height: fly.size,
              borderRadius: "50%",
              background: fly.glowColor,
              boxShadow: `0 0 ${fly.size * 2}px ${fly.size}px ${fly.glowColor.replace("0.9", "0.6")}, 0 0 ${fly.size * 4}px ${fly.size * 2}px ${fly.glowColor.replace("0.9", "0.25")}`,
              animation: `fireflyPulse ${1.5 + sr(fly.id) * 2}s ease-in-out ${fly.delay * 0.5}s infinite alternate`,
            }}
          />
        </div>
      ))}
    </div>
  );
}
