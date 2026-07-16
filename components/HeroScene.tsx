"use client";

import { useRef, useMemo, useEffect, Suspense, useState } from "react";
import { Canvas, useFrame, useThree, extend } from "@react-three/fiber";
import { EffectComposer, Bloom, Vignette } from "@react-three/postprocessing";
import * as THREE from "three";
import { gsap } from "gsap";

/* ================================================================
   THE JUNGLE WEY — Three.js Cinematic Atmosphere Hero

   A 2.5D layered jungle environment using:
   - Fog-driven depth (FogExp2 for atmospheric falloff)
   - 3 parallax tree silhouette layers (ShapeGeometry)
   - Warm + cool dual light shafts (AdditiveBlending planes)
   - 500-particle humidity/dust system (Points)
   - 22 bioluminescent fireflies (Points + Bloom)
   - GSAP cinematic intro (camera push + fog density ramp)
   - Mouse-driven parallax (each layer at different speed)
   - Breathing camera motion (gentle float)
   - Bloom + Vignette post-processing

   Designed to feel like twilight golden hour in a dense
   tropical jungle — NOT a game, NOT a 3D scene.
   Pure cinematic atmosphere.
   ================================================================ */

/* ─── Performance detection ──────────────────────────────── */
function getPerf() {
  if (typeof navigator === "undefined") return "high";
  const isTouch = navigator.maxTouchPoints > 0;
  const isMobile = /iPhone|Android|iPad/i.test(navigator.userAgent);
  if (isMobile || isTouch) return "low";
  const mem = (navigator as unknown as { deviceMemory?: number }).deviceMemory;
  if (mem !== undefined && mem <= 2) return "low";
  return "high";
}

/* ─── Seeded random ──────────────────────────────────────── */
const sr = (s: number) => ((Math.sin(s * 91.23 + 423.1) * 48271) % 1 + 1) % 1;

/* ─── Scene background + fog setup ──────────────────────── */
function SceneSetup({ perf }: { perf: string }) {
  const { scene } = useThree();

  useEffect(() => {
    /* Gradient sky — warm amber sun (top-right) + cool twilight (top-left) */
    const canvas = document.createElement("canvas");
    canvas.width = 512; canvas.height = 512;
    const ctx = canvas.getContext("2d")!;

    ctx.fillStyle = "#020f0b";
    ctx.fillRect(0, 0, 512, 512);

    const sg = ctx.createRadialGradient(390, 110, 0, 390, 110, 320);
    sg.addColorStop(0,    "rgba(190,108,22,0.55)");
    sg.addColorStop(0.30, "rgba(105, 60,12,0.26)");
    sg.addColorStop(0.62, "rgba( 44, 24, 6,0.10)");
    sg.addColorStop(1,    "rgba(0,0,0,0)");
    ctx.fillStyle = sg; ctx.fillRect(0, 0, 512, 512);

    const mg = ctx.createRadialGradient(88, 88, 0, 88, 88, 245);
    mg.addColorStop(0,    "rgba(32,62,115,0.40)");
    mg.addColorStop(0.42, "rgba(16,36, 72,0.17)");
    mg.addColorStop(1,    "rgba(0,0,0,0)");
    ctx.fillStyle = mg; ctx.fillRect(0, 0, 512, 512);

    const hg = ctx.createLinearGradient(0, 285, 0, 405);
    hg.addColorStop(0,   "rgba(0,0,0,0)");
    hg.addColorStop(0.5, "rgba(10,44,20,0.20)");
    hg.addColorStop(1,   "rgba(0,0,0,0)");
    ctx.fillStyle = hg; ctx.fillRect(0, 0, 512, 512);

    const bg = ctx.createLinearGradient(0, 310, 0, 512);
    bg.addColorStop(0, "rgba(0,0,0,0)");
    bg.addColorStop(1, "rgba(1,5,2,0.98)");
    ctx.fillStyle = bg; ctx.fillRect(0, 0, 512, 512);

    const tex = new THREE.CanvasTexture(canvas);
    scene.background = tex;
    scene.fog = new THREE.FogExp2(new THREE.Color("#020e08"), perf === "low" ? 0.050 : 0.042);
    return () => { tex.dispose(); };
  }, [scene, perf]);

  return null;
}

/* ─── Ambient + directional lighting ─────────────────────── */
function SceneLighting() {
  const sunRef  = useRef<THREE.DirectionalLight>(null);
  const moonRef = useRef<THREE.DirectionalLight>(null);

  useFrame(({ clock }) => {
    const t = clock.elapsedTime;
    if (sunRef.current) {
      sunRef.current.intensity = 0.18 + Math.sin(t * 0.12) * 0.04;
    }
    if (moonRef.current) {
      moonRef.current.intensity = 0.12 + Math.sin(t * 0.09 + 1.5) * 0.03;
    }
  });

  return (
    <>
      <ambientLight color="#081810" intensity={0.6} />
      {/* Sun — warm amber, top-right */}
      <directionalLight
        ref={sunRef}
        color="#ce8b4d"
        intensity={0.22}
        position={[8, 10, -2]}
      />
      {/* Moon — cool blue-white, top-left */}
      <directionalLight
        ref={moonRef}
        color="#90b8f0"
        intensity={0.14}
        position={[-8, 8, -1]}
      />
      {/* Ground bounce — very dim teal */}
      <directionalLight color="#204030" intensity={0.06} position={[0, -5, 2]} />
    </>
  );
}

/* ─── Single tree silhouette ──────────────────────────────── */
function JungleTree({
  x, y, z, scale = 1, seed = 0, layerDepth = 0,
}: {
  x: number; y: number; z: number;
  scale?: number; seed?: number; layerDepth?: number;
}) {
  const meshRef = useRef<THREE.Group>(null);

  const geo = useMemo(() => {
    /* Build organic tree profile using THREE.Shape */
    const shape = new THREE.Shape();
    const h  = 3.5 + sr(seed * 3.1) * 2.5;        /* trunk height */
    const cr = 1.2 + sr(seed * 5.7) * 1.0;         /* canopy radius */
    const cx = (sr(seed * 7.3) - 0.5) * 0.6;       /* canopy lean */

    shape.moveTo(-0.12, 0);
    shape.lineTo( 0.12, 0);
    shape.lineTo( 0.09, h * 0.5);
    /* organic trunk swell */
    shape.quadraticCurveTo(0.14 + cx * 0.1, h * 0.65, 0.05 + cx * 0.2, h * 0.75);

    /* Main canopy — large irregular blob */
    shape.bezierCurveTo(
      cx + cr * 0.9,  h + cr * 0.1,
      cx + cr * 1.0,  h + cr * 0.9,
      cx,             h + cr * 1.2,
    );
    shape.bezierCurveTo(
      cx - cr * 0.95, h + cr * 0.9,
      cx - cr * 1.05, h + cr * 0.15,
      -0.05 + cx * 0.15, h * 0.75,
    );
    shape.lineTo(-0.09, h * 0.5);
    shape.lineTo(-0.12, 0);
    shape.closePath();

    /* Secondary lobe (branch to one side) */
    const hole = new THREE.Path();
    const bx = cx + cr * (sr(seed * 9.1) > 0.5 ? 0.5 : -0.55);
    const by = h + cr * 0.55;
    const br = cr * (0.45 + sr(seed * 11.3) * 0.3);
    hole.absarc(bx, by, br, 0, Math.PI * 2, false);
    /* don't add as hole — add as extra shape for more lobe */

    return new THREE.ShapeGeometry(shape, 8);
  }, [seed]);

  /* Slow independent sway */
  const swaySpeed = 0.08 + sr(seed * 2.3) * 0.06;
  const swayPhase = sr(seed * 7.1) * Math.PI * 2;
  const swayAmp   = (0.004 + sr(seed * 4.7) * 0.006) * (1 + layerDepth * 0.3);

  useFrame(({ clock }) => {
    if (meshRef.current) {
      meshRef.current.rotation.z = Math.sin(clock.elapsedTime * swaySpeed + swayPhase) * swayAmp;
    }
  });

  /* Color slightly varies by layer — near trees are richer green-black */
  /* Atmospheric depth: far layers show more of the ambient green-teal haze */
  const color = layerDepth === 0 ? "#0c2012" : layerDepth === 1 ? "#071408" : "#030c05";

  return (
    <group ref={meshRef} position={[x, y, z]} scale={scale}>
      <mesh geometry={geo} renderOrder={layerDepth}>
        <meshLambertMaterial
          color={color}
          side={THREE.FrontSide}
          transparent
          opacity={0.94 + layerDepth * 0.02}
        />
      </mesh>
    </group>
  );
}

/* ─── Full tree forest (3 parallax layers) ───────────────── */
function JungleForest({ mouseRef }: { mouseRef: React.RefObject<THREE.Vector2> }) {
  const layers = [
    /* Layer 0 — deepest background (z = -14) */
    { z: -14, count: 14, spread: 26, yOffset: -4.5, scaleRange: [0.9, 1.6], depth: 0, parallax: 0.015 },
    /* Layer 1 — midground (z = -7) */
    { z: -7,  count: 10, spread: 20, yOffset: -3.5, scaleRange: [0.7, 1.2], depth: 1, parallax: 0.030 },
    /* Layer 2 — near (z = -2) */
    { z: -2,  count: 7,  spread: 14, yOffset: -2.8, scaleRange: [0.5, 0.9], depth: 2, parallax: 0.060 },
  ];

  const groupRefs = useRef<(THREE.Group | null)[]>([]);

  useFrame(() => {
    if (!mouseRef.current) return;
    const mx = mouseRef.current.x;
    const my = mouseRef.current.y;
    groupRefs.current.forEach((g, i) => {
      if (!g) return;
      const p = layers[i].parallax;
      g.position.x += (-mx * p * 2 - g.position.x) * 0.04;
      g.position.y += ( my * p * 1.2 - g.position.y) * 0.04;
    });
  });

  return (
    <>
      {layers.map((layer, li) => (
        <group
          key={li}
          ref={(el) => { groupRefs.current[li] = el; }}
        >
          {Array.from({ length: layer.count }, (_, i) => {
            const xRange = layer.spread;
            const x  = (i / (layer.count - 1) - 0.5) * xRange + (sr(i * li * 3.7 + 1.1) - 0.5) * 2;
            const y  = layer.yOffset + (sr(i * li * 5.3 + 2.7) - 0.5) * 1.2;
            const sc = layer.scaleRange[0] + sr(i * li * 7.1 + 0.9) * (layer.scaleRange[1] - layer.scaleRange[0]);
            return (
              <JungleTree
                key={i}
                x={x} y={y} z={layer.z}
                scale={sc}
                seed={i * 17 + li * 7}
                layerDepth={layer.depth}
              />
            );
          })}
        </group>
      ))}
    </>
  );
}

/* ─── Ground plane ────────────────────────────────────────── */
function GroundPlane() {
  return (
    <mesh position={[0, -3.2, -5]} rotation={[-Math.PI / 2, 0, 0]}>
      <planeGeometry args={[60, 30]} />
      <meshLambertMaterial color="#030e06" />
    </mesh>
  );
}

/* ─── Volumetric light shafts ────────────────────────────── */
function LightShaft({
  pos, rot, w, h, colorHex, baseOpacity, animOffset,
}: {
  pos: [number, number, number];
  rot: [number, number, number];
  w: number; h: number;
  colorHex: string;
  baseOpacity: number;
  animOffset: number;
}) {
  const matRef = useRef<THREE.MeshBasicMaterial>(null);

  useFrame(({ clock }) => {
    if (matRef.current) {
      matRef.current.opacity =
        baseOpacity * (0.72 + Math.sin(clock.elapsedTime * 0.18 + animOffset) * 0.28);
    }
  });

  return (
    <mesh position={pos} rotation={rot}>
      <planeGeometry args={[w, h]} />
      <meshBasicMaterial
        ref={matRef}
        color={colorHex}
        transparent
        opacity={baseOpacity}
        side={THREE.DoubleSide}
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </mesh>
  );
}

function LightShafts() {
  /* Sun shafts — warm amber, from top-right */
  const sunShafts = [
    { pos: [ 3.5, 2, -6], rot: [0, 0, -0.38], w: 0.28, h: 22, color: "#c8901a", op: 0.062, off: 0.0 },
    { pos: [ 4.8, 1, -7], rot: [0, 0, -0.42], w: 0.40, h: 25, color: "#b87e14", op: 0.044, off: 0.9 },
    { pos: [ 2.2, 3, -5], rot: [0, 0, -0.34], w: 0.18, h: 18, color: "#d4a030", op: 0.075, off: 1.8 },
    { pos: [ 5.8, 0, -8], rot: [0, 0, -0.48], w: 0.55, h: 28, color: "#a07020", op: 0.034, off: 2.7 },
    { pos: [ 1.6, 4, -4], rot: [0, 0, -0.30], w: 0.14, h: 15, color: "#e0b840", op: 0.082, off: 3.5 },
  ];

  /* Moon shafts — cool blue-white, from top-left */
  const moonShafts = [
    { pos: [-3.8, 2, -5], rot: [0, 0,  0.40], w: 0.35, h: 20, color: "#6090d0", op: 0.038, off: 0.5 },
    { pos: [-5.2, 1, -7], rot: [0, 0,  0.48], w: 0.22, h: 24, color: "#5080c0", op: 0.027, off: 1.4 },
    { pos: [-2.5, 3, -4], rot: [0, 0,  0.32], w: 0.18, h: 16, color: "#7098d8", op: 0.052, off: 2.2 },
  ];

  return (
    <>
      {[...sunShafts, ...moonShafts].map((s, i) => (
        <LightShaft
          key={i}
          pos={s.pos as [number, number, number]}
          rot={s.rot as [number, number, number]}
          w={s.w} h={s.h}
          colorHex={s.color}
          baseOpacity={s.op}
          animOffset={s.off}
        />
      ))}
    </>
  );
}

/* ─── Humidity / dust particle system ─────────────────────── */
function DustParticles({ count = 500 }: { count?: number }) {
  const ref = useRef<THREE.Points>(null);

  const [positions, velocities] = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const vel = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      pos[i * 3]     = (sr(i * 7.3) - 0.5) * 22;
      pos[i * 3 + 1] = (sr(i * 2.9) - 0.5) * 14;
      pos[i * 3 + 2] = -(sr(i * 5.1)) * 14 - 1;
      vel[i * 3]     = (sr(i * 9.7) - 0.5) * 0.003;
      vel[i * 3 + 1] = sr(i * 3.3)  * 0.005 + 0.001;
      vel[i * 3 + 2] = (sr(i * 11.1) - 0.5) * 0.002;
    }
    return [pos, vel];
  }, [count]);

  useFrame(() => {
    if (!ref.current) return;
    const pos = ref.current.geometry.attributes.position;
    const arr = pos.array as Float32Array;
    for (let i = 0; i < count; i++) {
      arr[i * 3]     += velocities[i * 3];
      arr[i * 3 + 1] += velocities[i * 3 + 1];
      arr[i * 3 + 2] += velocities[i * 3 + 2];
      /* Wrap vertically */
      if (arr[i * 3 + 1] > 8)  arr[i * 3 + 1] = -8;
      /* Wrap horizontally */
      if (arr[i * 3]     > 12) arr[i * 3]     = -12;
      if (arr[i * 3]     < -12)arr[i * 3]     =  12;
    }
    pos.needsUpdate = true;
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[positions, 3]}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.018}
        color="#ce8b4d"
        transparent
        opacity={0.35}
        sizeAttenuation
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}

/* ─── Firefly particle system ────────────────────────────── */
function Fireflies({ count = 22 }: { count?: number }) {
  const ref      = useRef<THREE.Points>(null);
  const matRef   = useRef<THREE.PointsMaterial>(null);

  const [positions, targets, speeds] = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const tgt = new Float32Array(count * 3);
    const spd = new Float32Array(count);
    for (let i = 0; i < count; i++) {
      pos[i * 3]     = (sr(i * 7.1) - 0.5) * 14;
      pos[i * 3 + 1] = (sr(i * 3.3) - 0.5) * 8 - 1;
      pos[i * 3 + 2] = -(sr(i * 5.5)) * 10 - 1;
      tgt[i * 3]     = (sr(i * 11.9) - 0.5) * 14;
      tgt[i * 3 + 1] = (sr(i * 13.7) - 0.5) * 7 - 1;
      tgt[i * 3 + 2] = -(sr(i * 9.3))  * 10 - 1;
      spd[i]         = 0.01 + sr(i * 15.1) * 0.025;
    }
    return [pos, tgt, spd];
  }, [count]);

  useFrame(({ clock }) => {
    if (!ref.current || !matRef.current) return;
    const pos = ref.current.geometry.attributes.position;
    const arr = pos.array as Float32Array;
    const t   = clock.elapsedTime;

    for (let i = 0; i < count; i++) {
      const ix = i * 3, iy = i * 3 + 1, iz = i * 3 + 2;
      const dx = targets[ix] - arr[ix];
      const dy = targets[iy] - arr[iy];
      const dist = Math.hypot(dx, dy);

      /* Pick new target when close */
      if (dist < 0.3) {
        targets[ix] = (sr(arr[ix] * 0.1 + t * 0.01 + i) - 0.5) * 14;
        targets[iy] = (sr(arr[iy] * 0.1 + t * 0.013 + i) - 0.5) * 7 - 1;
      } else {
        arr[ix] += (dx / dist) * speeds[i];
        arr[iy] += (dy / dist) * speeds[i] * 0.6;
      }
      /* Subtle vertical sine */
      arr[iy] += Math.sin(t * 0.4 + i * 1.3) * 0.002;
    }
    pos.needsUpdate = true;

    /* Pulse brightness */
    const bright = 0.55 + Math.sin(t * 1.8) * 0.25 +
                   Math.sin(t * 2.9 + 1.2) * 0.12 +
                   Math.sin(t * 0.7 + 2.4) * 0.08;
    matRef.current.opacity = Math.max(0, Math.min(1, bright * 0.9));
    matRef.current.size    = 0.055 + bright * 0.025;
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[positions, 3]}
        />
      </bufferGeometry>
      <pointsMaterial
        ref={matRef}
        size={0.06}
        color="#64ffd0"
        transparent
        opacity={0.8}
        sizeAttenuation
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}

/* ─── Ground mist — drifting fog planes near the forest floor ── */
function MistPlane({
  y, z, w, h, color, offset,
}: {
  y: number; z: number; w: number; h: number; color: string; offset: number;
}) {
  const matRef  = useRef<THREE.MeshBasicMaterial>(null);
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame(({ clock }) => {
    const t = clock.elapsedTime;
    if (meshRef.current) meshRef.current.position.x = Math.sin(t * 0.07 + offset) * 2.8;
    if (matRef.current)  matRef.current.opacity      = 0.065 + Math.sin(t * 0.11 + offset) * 0.022;
  });

  return (
    <mesh ref={meshRef} position={[0, y, z]} rotation={[-Math.PI * 0.055, 0, 0]}>
      <planeGeometry args={[w, h]} />
      <meshBasicMaterial
        ref={matRef}
        color={color}
        transparent
        opacity={0.065}
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </mesh>
  );
}

function GroundMist() {
  return (
    <>
      <MistPlane y={-2.85} z={-8}  w={48} h={5.0} color="#1c3422" offset={0.0} />
      <MistPlane y={-2.45} z={-5}  w={40} h={3.8} color="#162c1c" offset={1.4} />
      <MistPlane y={-2.05} z={-2.5} w={32} h={2.8} color="#102018" offset={2.8} />
    </>
  );
}

/* ─── Camera rig ─────────────────────────────────────────── */
function CameraRig({ mouseRef }: { mouseRef: React.RefObject<THREE.Vector2> }) {
  const { camera } = useThree();
  const targetPos  = useRef(new THREE.Vector3(0, 0.2, 5));
  const initiated  = useRef(false);

  useEffect(() => {
    if (initiated.current) return;
    initiated.current = true;

    /* GSAP cinematic intro: camera drifts from far-back to rest */
    camera.position.set(0, 0.5, 11);
    (camera as THREE.PerspectiveCamera).fov = 82;
    camera.updateProjectionMatrix();

    const proxy = { z: 11, fov: 82, y: 0.5 };
    gsap.to(proxy, {
      z: 5.0, fov: 72, y: 0.2,
      duration: 4.5,
      ease: "power2.inOut",
      onUpdate: () => {
        camera.position.z = proxy.z;
        camera.position.y = proxy.y;
        (camera as THREE.PerspectiveCamera).fov = proxy.fov;
        camera.updateProjectionMatrix();
      },
    });
  }, [camera]);

  useFrame(({ clock }) => {
    const t   = clock.elapsedTime;
    const mx  = mouseRef.current?.x ?? 0;
    const my  = mouseRef.current?.y ?? 0;

    /* Breathing motion */
    targetPos.current.set(
      -mx * 0.35,
      0.2 + my * 0.22 + Math.sin(t * 0.20) * 0.08,
      5.0 + Math.sin(t * 0.14) * 0.10,
    );

    camera.position.lerp(targetPos.current, 0.028);
    camera.lookAt(0, 0.5, 0);
  });

  return null;
}

/* ─── Post-processing ────────────────────────────────────── */
function PostFX({ perf }: { perf: string }) {
  if (perf === "low") return null;
  return (
    <EffectComposer multisampling={0}>
      <Bloom
        luminanceThreshold={0.38}
        luminanceSmoothing={0.6}
        intensity={0.55}
        radius={0.6}
      />
      <Vignette eskil={false} offset={0.38} darkness={0.75} />
    </EffectComposer>
  );
}

/* ─── Inner scene (needs R3F context) ───────────────────── */
function JungleScene({ perf }: { perf: string }) {
  const mouseRef = useRef<THREE.Vector2>(new THREE.Vector2(0, 0));

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      mouseRef.current.x = (e.clientX / window.innerWidth  - 0.5) * 2;
      mouseRef.current.y = (e.clientY / window.innerHeight - 0.5) * 2;
    };
    window.addEventListener("mousemove", onMove, { passive: true });
    return () => window.removeEventListener("mousemove", onMove);
  }, []);

  return (
    <>
      <SceneSetup perf={perf} />
      <SceneLighting />
      <GroundPlane />
      <GroundMist />
      <JungleForest mouseRef={mouseRef} />
      <LightShafts />
      <DustParticles count={perf === "low" ? 200 : 500} />
      <Fireflies count={perf === "low" ? 12 : 22} />
      <CameraRig mouseRef={mouseRef} />
      <PostFX perf={perf} />
    </>
  );
}

/* ─── Loading fallback ───────────────────────────────────── */
function LoadingCanvas() {
  return (
    <div
      className="absolute inset-0"
      style={{
        background: "radial-gradient(ellipse at 70% 35%, rgba(80,55,15,0.45) 0%, #020d0e 65%)",
      }}
    />
  );
}

/* ─── Main export ────────────────────────────────────────── */
export default function HeroScene() {
  const [perf] = useState(() => (typeof window !== "undefined" ? getPerf() : "high"));

  return (
    <div className="absolute inset-0" aria-hidden="true">
      <Suspense fallback={<LoadingCanvas />}>
        <Canvas
          dpr={perf === "low" ? [0.6, 1.0] : [0.75, 1.5]}
          camera={{ position: [0, 0.5, 11], fov: 82, near: 0.1, far: 60 }}
          gl={{
            antialias: false,
            alpha: false,
            powerPreference: "high-performance",
            stencil: false,
          }}
          style={{ background: "#020d0e" }}
        >
          <JungleScene perf={perf} />
        </Canvas>
      </Suspense>
    </div>
  );
}
