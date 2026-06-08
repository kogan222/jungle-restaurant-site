"use client";

import { useRef, useCallback } from "react";

/* ================================================================
   useTilt — 3D mouse-tracking tilt for premium card interactions
   Disabled on touch/mobile devices automatically.
   ================================================================ */

export function useTilt(intensity = 8) {
  const ref = useRef<HTMLDivElement>(null);
  const rafRef = useRef<number>(0);

  const onMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (!ref.current) return;
    /* Skip on touch devices */
    if (window.matchMedia("(hover: none)").matches) return;

    cancelAnimationFrame(rafRef.current);
    rafRef.current = requestAnimationFrame(() => {
      if (!ref.current) return;
      const rect = ref.current.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      const dx = (e.clientX - cx) / (rect.width / 2);   /* -1 to 1 */
      const dy = (e.clientY - cy) / (rect.height / 2);   /* -1 to 1 */

      const rotX = -dy * intensity;
      const rotY =  dx * intensity;

      ref.current.style.transform = `perspective(900px) rotateX(${rotX}deg) rotateY(${rotY}deg) translateZ(8px)`;
      ref.current.style.transition = "transform 0.08s ease-out";

      /* Move internal shine layer if present */
      const shine = ref.current.querySelector(".tilt-shine") as HTMLElement;
      if (shine) {
        shine.style.opacity = "1";
        shine.style.transform = `translate(${dx * 30}%, ${dy * 30}%)`;
      }
    });
  }, [intensity]);

  const onMouseLeave = useCallback(() => {
    if (!ref.current) return;
    cancelAnimationFrame(rafRef.current);
    ref.current.style.transform = "perspective(900px) rotateX(0deg) rotateY(0deg) translateZ(0)";
    ref.current.style.transition = "transform 0.55s cubic-bezier(0.22,1,0.36,1)";
    const shine = ref.current.querySelector(".tilt-shine") as HTMLElement;
    if (shine) {
      shine.style.opacity = "0";
    }
  }, []);

  return { ref, onMouseMove, onMouseLeave };
}
