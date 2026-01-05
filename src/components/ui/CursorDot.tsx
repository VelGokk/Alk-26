"use client";

import { useEffect } from "react";

interface CursorDotProps {
  color?: string;
}

export default function CursorDot({ color = "var(--brand-accent)" }: CursorDotProps) {
  useEffect(() => {
    if (typeof window === "undefined") return;
    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (prefersReduced.matches) {
      return;
    }
    if (!window.matchMedia("(pointer: fine)").matches) {
      return;
    }

    const dot = document.createElement("div");
    dot.className = "cursor-dot";
    Object.assign(dot.style, {
      position: "fixed",
      pointerEvents: "none",
      width: "16px",
      height: "16px",
      borderRadius: "999px",
      border: "2px solid transparent",
      backgroundColor: color,
      mixBlendMode: "difference",
      transform: "translate(-50%, -50%) scale(0.4)",
      transition: "transform 0.25s ease, opacity 0.35s ease",
      opacity: "0",
      zIndex: "9999",
      boxShadow: `0 0 18px ${color}66`,
    });
    document.body.appendChild(dot);

    const handleMove = (event: MouseEvent) => {
      dot.style.left = `${event.clientX}px`;
      dot.style.top = `${event.clientY}px`;
      dot.style.opacity = "1";
      dot.style.transform = "translate(-50%, -50%) scale(1)";
    };

    const handleLeave = () => {
      dot.style.opacity = "0";
      dot.style.transform = "translate(-50%, -50%) scale(0.4)";
    };

    window.addEventListener("pointermove", handleMove);
    window.addEventListener("mouseleave", handleLeave);

    return () => {
      window.removeEventListener("pointermove", handleMove);
      window.removeEventListener("mouseleave", handleLeave);
      document.body.removeChild(dot);
    };
  }, [color]);

  return null;
}
