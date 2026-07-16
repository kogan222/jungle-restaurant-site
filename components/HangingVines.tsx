"use client";

/* ================================================================
   HANGING VINES — Vines that drape from the top of the hero
   SVG paths with leaf buds, gentle sway animation
   ================================================================ */

type VineConfig = {
  x: number;          /* % from left */
  length: number;     /* height in vh units */
  curve: number;      /* horizontal curve offset */
  swayDuration: number;
  swayDelay: number;
  opacity: number;
  thickness: number;
  leafCount: number;
};

const VINES: VineConfig[] = [
  { x: 3,  length: 28, curve: 12,  swayDuration: 5.5, swayDelay: 0,   opacity: 0.75, thickness: 3,   leafCount: 4 },
  { x: 11, length: 42, curve: -8,  swayDuration: 7,   swayDelay: 0.8, opacity: 0.6,  thickness: 2.5, leafCount: 5 },
  { x: 21, length: 20, curve: 15,  swayDuration: 4.8, swayDelay: 1.5, opacity: 0.5,  thickness: 2,   leafCount: 3 },
  { x: 68, length: 35, curve: -12, swayDuration: 6.2, swayDelay: 0.3, opacity: 0.55, thickness: 2.5, leafCount: 4 },
  { x: 79, length: 22, curve: 8,   swayDuration: 5,   swayDelay: 1.2, opacity: 0.65, thickness: 2,   leafCount: 3 },
  { x: 89, length: 50, curve: -18, swayDuration: 8,   swayDelay: 0.5, opacity: 0.7,  thickness: 3,   leafCount: 6 },
  { x: 96, length: 30, curve: 10,  swayDuration: 6,   swayDelay: 2,   opacity: 0.5,  thickness: 2,   leafCount: 3 },
];

function VinePath({
  vine,
  index,
}: {
  vine: VineConfig;
  index: number;
}) {
  const H = vine.length * 10; /* SVG internal height */
  const W = 60;
  const cx = W / 2;

  /* Bezier control points for natural hang */
  const cp1x = cx + vine.curve * 0.6;
  const cp2x = cx + vine.curve;
  const endX = cx + vine.curve * 0.3;
  const path = `M${cx},0 C${cp1x},${H * 0.3} ${cp2x},${H * 0.65} ${endX},${H}`;

  /* Leaf positions along the vine (parameterized) */
  const leafTs = Array.from({ length: vine.leafCount }, (_, i) => 0.15 + (i / vine.leafCount) * 0.75);

  function lerp(a: number, b: number, t: number) { return a + (b - a) * t; }
  function getPoint(t: number) {
    /* Cubic bezier point */
    const mt = 1 - t;
    const x = mt * mt * mt * cx + 3 * mt * mt * t * cp1x + 3 * mt * t * t * cp2x + t * t * t * endX;
    const y = mt * mt * mt * 0   + 3 * mt * mt * t * (H * 0.3) + 3 * mt * t * t * (H * 0.65) + t * t * t * H;
    return { x, y };
  }

  return (
    <div
      className="absolute top-0 pointer-events-none select-none"
      style={{
        left: `${vine.x}%`,
        width: W,
        height: `${vine.length}vh`,
        transform: "translateX(-50%)",
        transformOrigin: "top center",
        animation: `leafSway ${vine.swayDuration}s ease-in-out ${vine.swayDelay}s infinite alternate`,
        zIndex: 20,
      }}
      aria-hidden="true"
    >
      <svg
        viewBox={`0 0 ${W} ${H}`}
        fill="none"
        width="100%"
        height="100%"
        preserveAspectRatio="none"
      >
        {/* Shadow vine (depth) */}
        <path
          d={path}
          stroke="rgba(10,26,10,0.4)"
          strokeWidth={vine.thickness + 1.5}
          strokeLinecap="round"
          transform="translate(2, 3)"
        />
        {/* Main vine stem */}
        <path
          d={path}
          stroke={`rgba(36,88,36,${vine.opacity})`}
          strokeWidth={vine.thickness}
          strokeLinecap="round"
        />
        {/* Highlight edge */}
        <path
          d={path}
          stroke={`rgba(61,138,61,${vine.opacity * 0.4})`}
          strokeWidth={vine.thickness * 0.4}
          strokeLinecap="round"
        />

        {/* Leaves along vine */}
        {leafTs.map((t, li) => {
          const pt = getPoint(t);
          const dir = li % 2 === 0 ? 1 : -1;
          const leafW = 14 + (li % 3) * 4;
          const leafH = 10 + (li % 3) * 3;
          const angle = -25 * dir + (li % 2) * 10;
          const leafColor = li % 3 === 0 ? "#1d3927" : li % 3 === 1 ? "#2d6e2d" : "#245824";

          return (
            <g
              key={li}
              style={{
                transformOrigin: `${pt.x}px ${pt.y}px`,
                animation: `leafSway ${vine.swayDuration * 0.7}s ease-in-out ${vine.swayDelay + li * 0.2}s infinite alternate`,
              }}
            >
              {/* Leaf stem */}
              <line
                x1={pt.x}
                y1={pt.y}
                x2={pt.x + dir * 8}
                y2={pt.y + 4}
                stroke={`rgba(36,88,36,${vine.opacity * 0.7})`}
                strokeWidth="1"
              />
              {/* Leaf blade */}
              <ellipse
                cx={pt.x + dir * (8 + leafW * 0.35)}
                cy={pt.y + 4}
                rx={leafW}
                ry={leafH}
                fill={leafColor}
                opacity={vine.opacity * 0.9}
                transform={`rotate(${angle} ${pt.x + dir * (8 + leafW * 0.35)} ${pt.y + 4})`}
              />
              {/* Leaf vein */}
              <line
                x1={pt.x + dir * 8}
                y1={pt.y + 4}
                x2={pt.x + dir * (8 + leafW * 0.9)}
                y2={pt.y + 4}
                stroke="rgba(61,138,61,0.4)"
                strokeWidth="0.5"
                transform={`rotate(${angle} ${pt.x + dir * (8 + leafW * 0.35)} ${pt.y + 4})`}
              />
              {/* Tiny berry on some */}
              {li === 1 && (
                <circle
                  cx={pt.x + dir * (8 + leafW * 1.1)}
                  cy={pt.y + 2}
                  r="2.5"
                  fill="rgba(240,78,48,0.55)"
                />
              )}
            </g>
          );
        })}

        {/* Drip at vine tip */}
        <circle
          cx={endX}
          cy={H}
          r="2.5"
          fill={`rgba(45,110,45,${vine.opacity * 0.7})`}
        />
      </svg>
    </div>
  );
}

export default function HangingVines() {
  return (
    <div className="absolute top-0 left-0 right-0 pointer-events-none overflow-hidden" style={{ zIndex: 20, height: "55vh" }} aria-hidden="true">
      {VINES.map((vine, i) => (
        <VinePath key={i} vine={vine} index={i} />
      ))}
    </div>
  );
}
