"use client";

import { useEffect } from "react";

export function MouseAura() {
  useEffect(() => {
    function handlePointerMove(event: PointerEvent) {
      document.documentElement.style.setProperty("--mouse-x", `${event.clientX}px`);
      document.documentElement.style.setProperty("--mouse-y", `${event.clientY}px`);
    }

    window.addEventListener("pointermove", handlePointerMove);
    return () => window.removeEventListener("pointermove", handlePointerMove);
  }, []);

  return <div className="mouseAura" aria-hidden="true" />;
}
