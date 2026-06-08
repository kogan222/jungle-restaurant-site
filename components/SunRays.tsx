"use client";

/* Cinematic sun rays — dappled light through tree canopy */
export default function SunRays({
  count = 6,
  className = "",
}: {
  count?: number;
  className?: string;
}) {
  return (
    <div
      className={`absolute inset-0 pointer-events-none overflow-hidden ${className}`}
      aria-hidden="true"
    >
      <svg
        className="absolute inset-0 w-full h-full"
        viewBox="0 0 1440 900"
        preserveAspectRatio="xMidYMid slice"
        fill="none"
      >
        <defs>
          <radialGradient id="rayGrad" cx="60%" cy="0%" r="80%" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#d4b483" stopOpacity="0.25" />
            <stop offset="100%" stopColor="#d4b483" stopOpacity="0" />
          </radialGradient>
          <linearGradient id="rayLinear" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#d4b483" stopOpacity="0.2" />
            <stop offset="100%" stopColor="#d4b483" stopOpacity="0" />
          </linearGradient>
        </defs>

        {/* Radial glow at light source */}
        <ellipse cx="62%" cy="-5%" rx="300" ry="250" fill="url(#rayGrad)" />

        {/* Individual sun rays */}
        {Array.from({ length: count }).map((_, i) => {
          const baseAngle = -15 + i * (50 / count);
          const width = 40 + (i % 3) * 25;
          const x1 = 860 + i * 15;
          const tipX = x1 + Math.sin(baseAngle * Math.PI / 180) * 1200;
          const tipX2 = x1 + Math.sin((baseAngle + 3) * Math.PI / 180) * 1200;
          return (
            <polygon
              key={i}
              points={`${x1},0 ${x1 + width},0 ${tipX2 + width},900 ${tipX},900`}
              fill="url(#rayLinear)"
              opacity={0.08 + (i % 3) * 0.03}
              className="sun-ray"
              style={{ animationDelay: `${i * 0.6}s` }}
            />
          );
        })}

        {/* Floating dust / light motes */}
        {[
          { cx: 900, cy: 200, r: 3 },
          { cx: 750, cy: 350, r: 2 },
          { cx: 1050, cy: 280, r: 2.5 },
          { cx: 820, cy: 450, r: 2 },
          { cx: 980, cy: 180, r: 1.5 },
          { cx: 670, cy: 320, r: 3 },
        ].map((mote, i) => (
          <circle
            key={i}
            cx={mote.cx}
            cy={mote.cy}
            r={mote.r}
            fill="#d4b483"
            opacity={0.35}
            className="gentle-pulse"
            style={{ animationDelay: `${i * 0.4}s` }}
          />
        ))}
      </svg>
    </div>
  );
}
