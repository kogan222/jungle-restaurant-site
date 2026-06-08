"use client";

import { useEffect, useRef } from "react";

/* ================================================================
   DEPTH LAYER SYSTEM — CSS 3D cinematic jungle depth.

   Creates a 5-layer parallax forest composition:
   Layer 5 (deepest): Very blurred distant silhouettes
   Layer 4: Blurred mid trees
   Layer 3: Sharp mid trees with mist
   Layer 2: Dark foreground trees
   Layer 1 (closest): Large blurred foreground leaves

   Each layer moves at a different scroll speed via rAF.
   ================================================================ */

interface LayerConfig {
  speed: number;     /* scroll multiplier */
  blur: number;      /* CSS blur px */
  opacity: number;
  zIndex: number;
  scale: number;
}

const LAYERS: LayerConfig[] = [
  { speed: 0.55, blur: 8,  opacity: 0.50, zIndex: 1, scale: 1.15 }, /* deep bg */
  { speed: 0.38, blur: 4,  opacity: 0.65, zIndex: 2, scale: 1.1  }, /* mid-bg */
  { speed: 0.22, blur: 1,  opacity: 0.80, zIndex: 3, scale: 1.05 }, /* midground */
  { speed: 0.12, blur: 0,  opacity: 0.90, zIndex: 4, scale: 1.0  }, /* mid-fg */
  { speed: 0.05, blur: 14, opacity: 0.60, zIndex: 5, scale: 1.2  }, /* close fg */
];

/* SVG tree silhouettes per layer */
function TreeLayer({ layer, index }: { layer: LayerConfig; index: number }) {
  const spacing = 180 - index * 20;
  const treeCount = Math.ceil(1600 / spacing);
  const heights   = [200, 280, 240, 260, 320];
  const widths    = [80,  110, 95,  100, 130];
  const fills     = [
    ["#050e05", "#0a1a0a"],
    ["#0a1a0a", "#0c1f0c"],
    ["#0c1f0c", "#183018"],
    ["#183018", "#1e461e"],
    ["#0a0f0a", "#080d08"],
  ];
  const [fill1, fill2] = fills[index];

  function seededH(i: number) { return heights[index] + Math.sin(i * 2.3 + index) * 40; }
  function seededW(i: number) { return widths[index]  + Math.sin(i * 1.7 + index) * 20; }

  return (
    <div
      className="absolute inset-0 pointer-events-none select-none"
      style={{
        filter: layer.blur > 0 ? `blur(${layer.blur}px)` : undefined,
        opacity: layer.opacity,
        zIndex: layer.zIndex,
        transform: `scale(${layer.scale})`,
        transformOrigin: "bottom center",
      }}
      aria-hidden="true"
    >
      <svg
        viewBox="0 0 1600 900"
        preserveAspectRatio="xMidYMax slice"
        className="absolute inset-0 w-full h-full"
        fill="none"
      >
        {/* Ground */}
        <rect x="0" y="820" width="1600" height="80" fill={fill1} opacity="0.9" />

        {Array.from({ length: treeCount }, (_, i) => {
          const x  = i * spacing + (index % 2 === 0 ? 0 : spacing / 2) - 20;
          const h  = seededH(i);
          const w  = seededW(i);
          const y  = 820 - h;
          const ty = 10 + Math.abs(Math.sin(i * 3.1)) * 20; /* trunk height */

          /* Trunk */
          return (
            <g key={i} style={{ animation: `canopySway ${6 + (i % 5) * 0.8}s ease-in-out ${i * 0.3}s infinite alternate` }}>
              {/* Trunk */}
              <rect x={x + w / 2 - 5} y={y + h - ty} width={10 + index * 2} height={ty} rx="5" fill={fill1} opacity="0.9" />
              {/* Main canopy */}
              <ellipse cx={x + w / 2} cy={y} rx={w} ry={h * 0.6} fill={fill1} />
              {/* Secondary canopy lobe */}
              <ellipse cx={x + w / 2 - w * 0.2} cy={y + h * 0.1} rx={w * 0.7} ry={h * 0.45} fill={fill2} opacity="0.8" />
              {/* Top lobe */}
              <ellipse cx={x + w / 2 + w * 0.15} cy={y - h * 0.1} rx={w * 0.55} ry={h * 0.35} fill={fill2} opacity="0.7" />
            </g>
          );
        })}

        {/* Ground foliage */}
        {Array.from({ length: 20 }, (_, i) => (
          <ellipse
            key={i}
            cx={i * 85}
            cy={830}
            rx={55 + Math.sin(i * 1.3) * 20}
            ry={25 + Math.sin(i * 2.1) * 8}
            fill={fill2}
            opacity="0.8"
          />
        ))}
      </svg>
    </div>
  );
}

/* Large foreground leaf */
function ForegroundLeaf({ x, size, blur, delay, flip }: {
  x: string; size: number; blur: number; delay: number; flip: boolean;
}) {
  return (
    <div
      className="absolute bottom-0 pointer-events-none select-none leaf-sway"
      style={{
        left: x,
        width: size,
        height: size * 1.5,
        filter: `blur(${blur}px)`,
        opacity: 0.55,
        transform: flip ? "scaleX(-1)" : undefined,
        animationDelay: `${delay}s`,
      }}
      aria-hidden="true"
    >
      <svg viewBox="0 0 100 150" fill="none" className="w-full h-full">
        <path d="M50 5 C28 20,3 60,10 100 C17 130,44 148,50 145 C35 120,32 88,50 5Z" fill="#0a1a0a" opacity="0.85" />
        <path d="M50 5 C72 20,97 60,90 100 C83 130,56 148,50 145 C65 120,68 88,50 5Z" fill="#0c1f0c" opacity="0.75" />
        <line x1="50" y1="10" x2="50" y2="140" stroke="#183018" strokeWidth="1.5" opacity="0.4" />
      </svg>
    </div>
  );
}

export default function DepthLayer({ className = "" }: { className?: string }) {
  const containerRef  = useRef<HTMLDivElement>(null);
  const layerRefs     = useRef<(HTMLDivElement | null)[]>([]);
  const scrollRef     = useRef(0);
  const rafRef        = useRef<number>(0);

  useEffect(() => {
    const onScroll = () => { scrollRef.current = window.scrollY; };
    window.addEventListener("scroll", onScroll, { passive: true });

    const update = () => {
      const y = scrollRef.current;
      layerRefs.current.forEach((el, i) => {
        if (!el) return;
        const speed = LAYERS[i].speed;
        el.style.transform = `scale(${LAYERS[i].scale}) translateY(${y * speed * 0.4}px)`;
      });
      rafRef.current = requestAnimationFrame(update);
    };
    rafRef.current = requestAnimationFrame(update);

    return () => {
      window.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(rafRef.current);
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className={`absolute inset-0 overflow-hidden pointer-events-none ${className}`}
      aria-hidden="true"
    >
      {LAYERS.map((layer, i) => (
        <div
          key={i}
          ref={(el) => { layerRefs.current[i] = el; }}
          className="absolute inset-0"
          style={{ willChange: "transform", transformOrigin: "bottom center" }}
        >
          <TreeLayer layer={layer} index={i} />
        </div>
      ))}

      {/* Foreground blur leaves — very close */}
      <ForegroundLeaf x="-3%" size={240} blur={18} delay={0}   flip={false} />
      <ForegroundLeaf x="-1%" size={180} blur={12} delay={1.5} flip={false} />
      <ForegroundLeaf x="88%" size={220} blur={16} delay={0.8} flip={true}  />
      <ForegroundLeaf x="92%" size={160} blur={10} delay={2.2} flip={true}  />
    </div>
  );
}
