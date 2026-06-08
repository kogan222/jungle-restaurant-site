"use client";

/* ============================================================
   JUNGLE VINES — Animated SVG vine decorations for section dividers
   ============================================================ */

export function VineDivider({ flip = false }: { flip?: boolean }) {
  return (
    <div
      className={`relative w-full overflow-hidden pointer-events-none select-none ${flip ? "scale-x-[-1]" : ""}`}
      style={{ height: 120 }}
      aria-hidden="true"
    >
      <svg
        viewBox="0 0 1440 120"
        fill="none"
        preserveAspectRatio="none"
        className="absolute inset-0 w-full h-full"
      >
        {/* Main vine line */}
        <path
          d="M0,60 C120,20 240,100 360,55 C480,10 600,90 720,50 C840,10 960,80 1080,45 C1200,10 1320,70 1440,40"
          stroke="rgba(45,110,45,0.5)"
          strokeWidth="2"
          fill="none"
          strokeDasharray="400"
          style={{
            animation: "vineGrow 3s ease forwards",
            strokeDashoffset: 400,
          }}
        />
        {/* Secondary vine */}
        <path
          d="M0,80 C200,40 400,110 600,70 C800,30 1000,90 1200,60 C1300,45 1380,75 1440,65"
          stroke="rgba(61,138,61,0.3)"
          strokeWidth="1.5"
          fill="none"
          strokeDasharray="400"
          style={{
            animation: "vineGrow 4s ease 0.5s forwards",
            strokeDashoffset: 400,
          }}
        />
        {/* Hanging leaves at intervals */}
        {[120, 280, 440, 600, 760, 920, 1080, 1240, 1380].map((x, i) => {
          const y = 50 + Math.sin(i * 0.8) * 20;
          const hang = 20 + (i % 3) * 12;
          return (
            <g key={i} className="leaf-float" style={{ animationDelay: `${i * 0.3}s` }}>
              {/* Hanging thread */}
              <line x1={x} y1={y} x2={x + 3} y2={y + hang} stroke="rgba(45,110,45,0.4)" strokeWidth="0.8" />
              {/* Small leaf */}
              <path
                d={`M${x + 3} ${y + hang} C${x - 5} ${y + hang + 8}, ${x} ${y + hang + 16}, ${x + 3} ${y + hang + 12} C${x + 10} ${y + hang + 8}, ${x + 10} ${y + hang}, ${x + 3} ${y + hang}Z`}
                fill={i % 2 === 0 ? "rgba(45,110,45,0.7)" : "rgba(61,138,61,0.6)"}
              />
            </g>
          );
        })}
        {/* Small flowers / buds */}
        {[200, 560, 900, 1200].map((x, i) => {
          const y = 45 + i * 8;
          return (
            <g key={i} className="gentle-pulse" style={{ animationDelay: `${i * 0.5}s` }}>
              <circle cx={x} cy={y} r="4" fill="rgba(232,86,42,0.5)" />
              <circle cx={x} cy={y} r="2" fill="rgba(244,115,74,0.8)" />
            </g>
          );
        })}
      </svg>
    </div>
  );
}

/* Large side vines for section decorations */
export function SideVine({ side = "left", height = 400 }: { side?: "left" | "right"; height?: number }) {
  const flip = side === "right";
  return (
    <div
      className={`absolute ${side}-0 top-0 pointer-events-none select-none overflow-hidden`}
      style={{ width: 120, height }}
      aria-hidden="true"
    >
      <svg
        viewBox={`0 0 120 ${height}`}
        fill="none"
        className={`w-full h-full ${flip ? "scale-x-[-1]" : ""}`}
      >
        {/* Main stem */}
        <path
          d={`M20,0 C30,${height * 0.15} 10,${height * 0.3} 25,${height * 0.45} C40,${height * 0.6} 15,${height * 0.75} 30,${height}`}
          stroke="rgba(45,110,45,0.4)"
          strokeWidth="2.5"
          fill="none"
        />
        {/* Branching stems */}
        {[0.15, 0.3, 0.48, 0.65, 0.8].map((frac, i) => {
          const y = height * frac;
          const dir = i % 2 === 0 ? 1 : -1;
          return (
            <g key={i}>
              <path
                d={`M${20 + i * 2},${y} C${40 + dir * 30},${y - 15} ${50 + dir * 20},${y + 5} ${60 + dir * 35},${y - 10}`}
                stroke="rgba(61,138,61,0.35)"
                strokeWidth="1.5"
                fill="none"
              />
              {/* Leaf at branch tip */}
              <g
                className="leaf-sway"
                style={{
                  transformOrigin: `${20 + i * 2}px ${y}px`,
                  animationDelay: `${i * 0.4}s`,
                }}
              >
                <path
                  d={`M${55 + dir * 35},${y - 10} C${45 + dir * 20},${y - 28} ${38 + dir * 15},${y - 18} ${55 + dir * 35},${y - 10}Z`}
                  fill={i % 2 === 0 ? "rgba(45,110,45,0.65)" : "rgba(36,88,36,0.6)"}
                />
                <path
                  d={`M${55 + dir * 35},${y - 10} C${65 + dir * 20},${y - 25} ${60 + dir * 10},${y - 12} ${55 + dir * 35},${y - 10}Z`}
                  fill="rgba(61,138,61,0.4)"
                />
              </g>
            </g>
          );
        })}

        {/* Hanging berries */}
        {[0.25, 0.55, 0.82].map((frac, i) => (
          <circle
            key={i}
            cx={25 + i * 5}
            cy={height * frac + 20}
            r="3"
            fill="rgba(232,86,42,0.4)"
            className="gentle-pulse"
            style={{ animationDelay: `${i * 0.7}s` }}
          />
        ))}
      </svg>
    </div>
  );
}

/* Corner branch — for top corners of sections */
export function CornerBranch({ corner = "tl" }: { corner?: "tl" | "tr" | "bl" | "br" }) {
  const flipX = corner === "tr" || corner === "br";
  const flipY = corner === "bl" || corner === "br";

  return (
    <div
      className="absolute pointer-events-none select-none overflow-hidden"
      style={{
        top: flipY ? "auto" : 0,
        bottom: flipY ? 0 : "auto",
        left: flipX ? "auto" : 0,
        right: flipX ? 0 : "auto",
        width: 220,
        height: 200,
      }}
      aria-hidden="true"
    >
      <svg
        viewBox="0 0 220 200"
        fill="none"
        className="w-full h-full"
        style={{
          transform: `scale(${flipX ? -1 : 1}, ${flipY ? -1 : 1})`,
        }}
      >
        {/* Main branch from corner */}
        <path
          d="M0,0 C50,10 80,50 120,60 C160,70 185,50 220,80"
          stroke="rgba(36,88,36,0.55)"
          strokeWidth="3"
          fill="none"
        />
        <path
          d="M0,0 C20,40 30,90 60,120 C90,150 110,160 130,200"
          stroke="rgba(36,88,36,0.45)"
          strokeWidth="2.5"
          fill="none"
        />

        {/* Leaves along branch */}
        {[
          { cx: 80, cy: 52, rot: -20 },
          { cx: 130, cy: 62, rot: 15 },
          { cx: 185, cy: 54, rot: -30 },
          { cx: 58, cy: 118, rot: 25 },
          { cx: 95, cy: 148, rot: -15 },
          { cx: 128, cy: 190, rot: 10 },
        ].map((leaf, i) => (
          <g
            key={i}
            className="leaf-float"
            style={{
              transformOrigin: `${leaf.cx}px ${leaf.cy}px`,
              animationDelay: `${i * 0.5}s`,
            }}
          >
            <ellipse
              cx={leaf.cx}
              cy={leaf.cy}
              rx={22 + i * 2}
              ry={12 + i}
              fill={i % 3 === 0 ? "rgba(45,110,45,0.7)" : i % 3 === 1 ? "rgba(36,88,36,0.65)" : "rgba(61,138,61,0.55)"}
              transform={`rotate(${leaf.rot} ${leaf.cx} ${leaf.cy})`}
            />
            {/* Leaf vein */}
            <line
              x1={leaf.cx - 12}
              y1={leaf.cy}
              x2={leaf.cx + 12}
              y2={leaf.cy}
              stroke="rgba(98,160,98,0.3)"
              strokeWidth="0.8"
              transform={`rotate(${leaf.rot} ${leaf.cx} ${leaf.cy})`}
            />
          </g>
        ))}

        {/* Hanging moss strands */}
        {[110, 170].map((x, i) => (
          <path
            key={i}
            d={`M${x},${60 + i * 10} C${x + 3},${80 + i * 10} ${x - 3},${95 + i * 10} ${x + 2},${110 + i * 10}`}
            stroke="rgba(45,110,45,0.3)"
            strokeWidth="1.2"
            fill="none"
            className="leaf-sway"
            style={{ transformOrigin: `${x}px ${60 + i * 10}px`, animationDelay: `${i * 0.6}s` }}
          />
        ))}

        {/* Small berry */}
        <circle cx="190" cy="56" r="4" fill="rgba(232,86,42,0.5)" className="gentle-pulse" />
        <circle cx="65" cy="122" r="3" fill="rgba(232,86,42,0.4)" className="gentle-pulse" style={{ animationDelay: "1s" }} />
      </svg>
    </div>
  );
}
