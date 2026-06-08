"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";

/* ════════════════════════════════════════════════════════════
   JUNGLE INTRO — Cinematic Leaf Entrance

   The viewport starts completely covered by massive
   close-up Alocasia (elephant-ear) leaves — the user
   feels like they are INSIDE the jungle foliage.

   GSAP animates the leaves parting outward, revealing
   the restaurant website underneath.

   Visual reference: dense tropical jungle with huge
   glossy backlit leaves, wet surface, strong veining.
════════════════════════════════════════════════════════════ */

/* ── Realistic Alocasia / elephant-ear leaf SVG ─────────── */
function AlocasiaLeaf({
  uid,
  flip    = false,
  backlit = false,
  tilt    = 0,
}: {
  uid:     string;
  flip?:   boolean;
  backlit?: boolean;
  tilt?:   number;
}) {
  const rgId = `rg-${uid}`;
  const blId = `bl-${uid}`;

  const tfParts: string[] = [];
  if (flip) tfParts.push("scaleX(-1)");
  if (tilt) tfParts.push(`rotate(${tilt}deg)`);
  const tf = tfParts.join(" ") || undefined;

  return (
    <svg
      viewBox="0 0 380 510"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      style={{ transform: tf, width: "100%", height: "100%" }}
    >
      <defs>
        {/* Leaf fill — dark rich tropical green with depth */}
        <radialGradient id={rgId} cx="38%" cy="28%" r="62%">
          <stop offset="0%"   stopColor={backlit ? "#2e6024" : "#1c3212"} />
          <stop offset="38%"  stopColor={backlit ? "#1a3e12" : "#10220a"} />
          <stop offset="100%" stopColor="#05090300" />
        </radialGradient>

        {/* Backlit luminous overlay — sun behind the leaf */}
        {backlit && (
          <radialGradient id={blId} cx="74%" cy="16%" r="44%">
            <stop offset="0%"   stopColor="rgba(148,218,82,0.22)" />
            <stop offset="45%"  stopColor="rgba(78,165,32,0.08)" />
            <stop offset="100%" stopColor="rgba(0,0,0,0)" />
          </radialGradient>
        )}
      </defs>

      {/* ── Main leaf body — sagittate/cordate (Alocasia-type) ── */}
      <path
        d="M190 500
           C174 478, 40 390, 16 278
           C-4  186, 36 78, 96 28
           C126 4,  162 -2, 190 0
           C218 -2, 254 4,  284 28
           C344 78, 384 186, 364 278
           C340 390, 206 478, 190 500Z"
        fill={`url(#${rgId})`}
      />

      {/* ── Backlit rim overlay ── */}
      {backlit && (
        <path
          d="M190 500
             C174 478, 40 390, 16 278
             C-4  186, 36 78, 96 28
             C126 4,  162 -2, 190 0
             C218 -2, 254 4,  284 28
             C344 78, 384 186, 364 278
             C340 390, 206 478, 190 500Z"
          fill={`url(#${blId})`}
        />
      )}

      {/* ── Central midrib — thick main vein ── */}
      <path
        d="M190 496 C190 380, 190 175, 190 4"
        stroke={backlit ? "#446232" : "#263c1a"}
        strokeWidth="3.2"
        opacity="0.55"
        fill="none"
        strokeLinecap="round"
      />

      {/* ── Lateral veins — right side ── */}
      {(
        [
          [190, 80,  302, 136, 318, 150],
          [190, 130, 320, 174, 336, 184],
          [190, 180, 332, 216, 348, 225],
          [190, 228, 328, 256, 338, 262],
          [190, 274, 316, 296, 324, 302],
          [190, 318, 295, 336, 300, 341],
        ] as [number,number,number,number,number,number][]
      ).map(([x1,y1,cx1,cy1,x2,y2], i) => (
        <path
          key={`vr${i}`}
          d={`M${x1} ${y1} Q${cx1} ${cy1} ${x2} ${y2}`}
          stroke={backlit ? "#446232" : "#263c1a"}
          strokeWidth={1.6 - i * 0.1}
          opacity={0.32 - i * 0.022}
          fill="none"
        />
      ))}

      {/* ── Lateral veins — left side (mirrored) ── */}
      {(
        [
          [190, 80,  78, 136, 62, 150],
          [190, 130, 60, 174, 44, 184],
          [190, 180, 48, 216, 32, 225],
          [190, 228, 52, 256, 42, 262],
          [190, 274, 64, 296, 56, 302],
          [190, 318, 85, 336, 80, 341],
        ] as [number,number,number,number,number,number][]
      ).map(([x1,y1,cx1,cy1,x2,y2], i) => (
        <path
          key={`vl${i}`}
          d={`M${x1} ${y1} Q${cx1} ${cy1} ${x2} ${y2}`}
          stroke={backlit ? "#446232" : "#263c1a"}
          strokeWidth={1.6 - i * 0.1}
          opacity={0.32 - i * 0.022}
          fill="none"
        />
      ))}

      {/* ── Wet specular highlights — glossy wet surface ── */}
      <ellipse
        cx="158" cy="106" rx="32" ry="17"
        fill="rgba(255,255,255,0.044)"
        transform="rotate(-28 158 106)"
      />
      <ellipse
        cx="167" cy="195" rx="21" ry="12"
        fill="rgba(255,255,255,0.028)"
        transform="rotate(-22 167 195)"
      />
      <ellipse
        cx="173" cy="278" rx="14" ry="8"
        fill="rgba(255,255,255,0.020)"
        transform="rotate(-16 173 278)"
      />

      {/* Tiny water droplets on surface */}
      {[[130,148,4],[195,220,3],[158,305,2.5],[182,260,2]].map(([cx,cy,r],i) => (
        <circle key={`d${i}`} cx={cx} cy={cy} r={r}
          fill="rgba(255,255,255,0.06)" />
      ))}
    </svg>
  );
}

/* ════════════════════════════════════════════════════════════
   Main intro overlay
════════════════════════════════════════════════════════════ */
export default function JungleIntro({ onReveal }: { onReveal?: () => void }) {
  const overlayRef = useRef<HTMLDivElement>(null);
  const tlRef      = useRef<HTMLDivElement>(null);  // top-left  close
  const trRef      = useRef<HTMLDivElement>(null);  // top-right close
  const blRef      = useRef<HTMLDivElement>(null);  // btm-left  mid
  const brRef      = useRef<HTMLDivElement>(null);  // btm-right mid
  const mlRef      = useRef<HTMLDivElement>(null);  // mid-left  accent
  const mrRef      = useRef<HTMLDivElement>(null);  // mid-right accent
  const atmoRef    = useRef<HTMLDivElement>(null);  // dark wash
  const ran        = useRef(false);

  useEffect(() => {
    if (ran.current) return;
    ran.current = true;

    /* ── Pre-reveal organic breathing ─────────────────────── */
    const breathe = [
      { el: tlRef.current, y: -7,  x: -4,  r: -1.8 },
      { el: trRef.current, y: -5,  x:  4,  r:  1.4 },
      { el: blRef.current, y:  5,  x: -3,  r: -1.2 },
      { el: brRef.current, y:  4,  x:  3,  r:  1.0 },
      { el: mlRef.current, y: -4,  x:  2,  r:  0.8 },
      { el: mrRef.current, y:  3,  x: -2,  r: -0.7 },
    ];

    breathe.forEach(({ el, y, x, r }) => {
      if (!el) return;
      gsap.to(el, {
        y, x, rotation: r,
        duration: 1.8,
        ease: "sine.inOut",
        yoyo: true,
        repeat: 1,
      });
    });

    /* ── Main reveal timeline ──────────────────────────────── */
    const tl = gsap.timeline({ delay: 0.7 });

    tl
      /* Top-left — sweeps up-left */
      .to(tlRef.current, {
        x: "-105%", y: "-78%",
        rotation: -22, scale: 0.80, opacity: 0,
        duration: 2.8, ease: "power2.inOut",
      }, 0)

      /* Top-right — sweeps up-right */
      .to(trRef.current, {
        x: "100%", y: "-72%",
        rotation: 18, scale: 0.80, opacity: 0,
        duration: 2.8, ease: "power2.inOut",
      }, 0.12)

      /* Bottom-left — drops down-left */
      .to(blRef.current, {
        x: "-88%", y: "90%",
        rotation: -16, scale: 0.76, opacity: 0,
        duration: 2.6, ease: "power2.inOut",
      }, 0.22)

      /* Bottom-right — drops down-right */
      .to(brRef.current, {
        x: "92%", y: "85%",
        rotation: 14, scale: 0.76, opacity: 0,
        duration: 2.6, ease: "power2.inOut",
      }, 0.30)

      /* Mid-left — fades out left */
      .to(mlRef.current, {
        x: "-70%", y: "22%", opacity: 0,
        duration: 2.2, ease: "power1.inOut",
      }, 0.40)

      /* Mid-right — fades out right */
      .to(mrRef.current, {
        x: "75%", y: "18%", opacity: 0,
        duration: 2.2, ease: "power1.inOut",
      }, 0.46)

      /* Dark atmosphere wash clears */
      .to(atmoRef.current, {
        opacity: 0,
        duration: 2.0, ease: "power1.inOut",
      }, 0.50)

      /* Trigger content reveal — leaves are ~50% open */
      .call(() => onReveal?.(), [], 1.15)

      /* Remove overlay from DOM */
      .call(() => {
        if (overlayRef.current) overlayRef.current.style.display = "none";
      }, [], 3.2);

    return () => { tl.kill(); };
  }, [onReveal]);

  return (
    <div
      ref={overlayRef}
      className="fixed inset-0 select-none"
      style={{ zIndex: 500, pointerEvents: "none", willChange: "transform" }}
      aria-hidden="true"
    >
      {/* ── Dark atmospheric wash ──────────────────────────── */}
      <div
        ref={atmoRef}
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 120% 120% at 50% 40%, rgba(3,14,5,0.45) 0%, rgba(1,7,2,0.90) 100%)",
        }}
      />

      {/* ══ FOREGROUND — very close, heavy blur (depth of field) ══ */}

      {/* Top-left: enormous close leaf */}
      <div
        ref={tlRef}
        className="absolute"
        style={{
          top: "-14%", left: "-18%",
          width: "78vw", height: "95vh",
          filter: "blur(26px)",
          opacity: 0.93,
          transformOrigin: "18% 22%",
          willChange: "transform, opacity",
        }}
      >
        <AlocasiaLeaf uid="tl" backlit tilt={8} />
      </div>

      {/* Top-right: enormous close leaf, flipped */}
      <div
        ref={trRef}
        className="absolute"
        style={{
          top: "-16%", right: "-20%",
          width: "74vw", height: "90vh",
          filter: "blur(22px)",
          opacity: 0.90,
          transformOrigin: "82% 20%",
          willChange: "transform, opacity",
        }}
      >
        <AlocasiaLeaf uid="tr" flip backlit tilt={-7} />
      </div>

      {/* ══ MID GROUND — in focus, primary visual ══ */}

      {/* Bottom-left: sharp in-focus */}
      <div
        ref={blRef}
        className="absolute"
        style={{
          bottom: "-20%", left: "-8%",
          width: "62vw", height: "80vh",
          filter: "blur(2px)",
          opacity: 0.97,
          transformOrigin: "22% 82%",
          willChange: "transform, opacity",
        }}
      >
        <AlocasiaLeaf uid="bl" tilt={-5} />
      </div>

      {/* Bottom-right: sharp in-focus */}
      <div
        ref={brRef}
        className="absolute"
        style={{
          bottom: "-22%", right: "-10%",
          width: "66vw", height: "84vh",
          filter: "blur(4px)",
          opacity: 0.95,
          transformOrigin: "78% 84%",
          willChange: "transform, opacity",
        }}
      >
        <AlocasiaLeaf uid="br" flip tilt={6} />
      </div>

      {/* ══ ACCENT — mid-range, blurred, fills gaps ══ */}

      {/* Mid-left */}
      <div
        ref={mlRef}
        className="absolute"
        style={{
          top: "20%", left: "-5%",
          width: "42vw", height: "60vh",
          filter: "blur(10px)",
          opacity: 0.70,
          transformOrigin: "8% 50%",
          willChange: "transform, opacity",
        }}
      >
        <AlocasiaLeaf uid="ml" backlit tilt={24} />
      </div>

      {/* Mid-right */}
      <div
        ref={mrRef}
        className="absolute"
        style={{
          top: "24%", right: "-7%",
          width: "40vw", height: "56vh",
          filter: "blur(12px)",
          opacity: 0.65,
          transformOrigin: "92% 52%",
          willChange: "transform, opacity",
        }}
      >
        <AlocasiaLeaf uid="mr" flip tilt={-20} />
      </div>
    </div>
  );
}
