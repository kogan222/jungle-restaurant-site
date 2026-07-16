"use client";

export default function FloatingLeaves() {
  return (
    <div className="pointer-events-none select-none" aria-hidden="true">
      {/* Large tropical leaf ג€” top left */}
      <div className="absolute -top-8 -left-6 w-48 h-48 opacity-70 leaf-float z-10">
        <svg viewBox="0 0 200 220" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path
            d="M100 10 C60 30, 10 80, 20 150 C30 200, 80 215, 100 210 C80 170, 75 130, 100 10Z"
            fill="#1d3927"
            opacity="0.9"
          />
          <path
            d="M100 10 C140 30, 180 90, 170 155 C160 200, 115 215, 100 210 C120 168, 128 128, 100 10Z"
            fill="#2d6e2d"
            opacity="0.8"
          />
          <line x1="100" y1="10" x2="100" y2="210" stroke="#3d8a3d" strokeWidth="1.5" opacity="0.5" />
          {[40,70,100,130,160].map((y, i) => (
            <line key={i} x1="100" y1={y} x2={i % 2 === 0 ? 60 : 140} y2={y + 20} stroke="#3d8a3d" strokeWidth="0.8" opacity="0.4" />
          ))}
        </svg>
      </div>

      {/* Monstera-style leaf ג€” top right */}
      <div className="absolute -top-4 -right-8 w-56 h-56 opacity-60 leaf-float-2 z-10">
        <svg viewBox="0 0 240 240" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path
            d="M120 20 C180 40, 220 100, 210 160 C200 210, 150 230, 120 225
               C140 200, 145 175, 140 150 C165 145, 175 130, 170 110 C165 90, 145 85, 140 100
               C135 80, 125 50, 120 20Z"
            fill="#245824"
            opacity="0.85"
          />
          <path
            d="M120 20 C60 45, 25 110, 40 165 C55 210, 100 228, 120 225
               C100 198, 95 170, 100 148 C75 142, 65 126, 72 108 C78 90, 98 88, 100 102
               C103 80, 112 52, 120 20Z"
            fill="#1d3927"
            opacity="0.9"
          />
          {/* holes */}
          <ellipse cx="155" cy="128" rx="10" ry="16" fill="#0c1f0c" opacity="0.6" transform="rotate(-20 155 128)" />
          <ellipse cx="85" cy="125" rx="9" ry="15" fill="#0c1f0c" opacity="0.6" transform="rotate(20 85 125)" />
        </svg>
      </div>

      {/* Small round leaf ג€” mid right */}
      <div className="absolute top-1/3 -right-4 w-28 h-28 opacity-50 leaf-float-3 z-10">
        <svg viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg">
          <ellipse cx="60" cy="60" rx="55" ry="45" fill="#2d6e2d" transform="rotate(-30 60 60)" />
          <line x1="60" y1="20" x2="60" y2="100" stroke="#62a062" strokeWidth="1" opacity="0.5" transform="rotate(-30 60 60)" />
        </svg>
      </div>

      {/* Thin palm frond ג€” bottom left */}
      <div className="absolute bottom-10 -left-10 w-40 h-64 opacity-50 leaf-float-4 z-10">
        <svg viewBox="0 0 160 280" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M80 270 Q70 200 30 160 Q10 140 5 110 Q20 125 40 140 Q60 155 70 170 Q75 140 60 110 Q45 80 50 50 Q65 80 75 115 Q80 90 72 55 Q85 80 88 115 Q95 90 92 55 Q105 82 100 118 Q110 95 115 65 Q118 100 108 135 Q120 115 135 100 Q125 128 110 148 Q130 135 148 130 Q130 155 112 165 Q130 165 148 160 Q128 185 108 188 Q80 200 80 270Z"
            fill="#1d3927" opacity="0.8" />
        </svg>
      </div>
    </div>
  );
}

