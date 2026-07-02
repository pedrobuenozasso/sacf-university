"use client";

import { useEffect } from "react";

export function MouseAura() {
  useEffect(() => {
    // Respect reduced-motion and skip entirely on touch-only devices — this
    // effect is pure decoration, not worth the paint cost there.
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const hasFinePointer = window.matchMedia("(pointer: fine)").matches;
    if (prefersReducedMotion || !hasFinePointer) return;

    let frame = 0;
    let pendingX = 0;
    let pendingY = 0;

    function applyPosition() {
      frame = 0;
      document.documentElement.style.setProperty("--mouse-x", `${pendingX}px`);
      document.documentElement.style.setProperty("--mouse-y", `${pendingY}px`);
    }

    // Coalesce every pointermove into at most one style update per animation
    // frame (~60fps) instead of firing on every raw event, which can be
    // hundreds of times per second on a trackpad and was forcing a full
    // repaint behind every blurred surface (sidebar, topbar) on each move.
    function handlePointerMove(event: PointerEvent) {
      pendingX = event.clientX;
      pendingY = event.clientY;
      if (!frame) {
        frame = requestAnimationFrame(applyPosition);
      }
    }

    window.addEventListener("pointermove", handlePointerMove, { passive: true });
    return () => {
      window.removeEventListener("pointermove", handlePointerMove);
      if (frame) cancelAnimationFrame(frame);
    };
  }, []);

  return <div className="mouseAura" aria-hidden="true" />;
}
