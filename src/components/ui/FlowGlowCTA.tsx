"use client";

import { motion, useReducedMotion } from "framer-motion";

interface FlowGlowCTAProps {
  ready: boolean;
  onClick?: () => void;
}

export default function FlowGlowCTA({ ready, onClick }: FlowGlowCTAProps) {
  const shouldReduceMotion = useReducedMotion();
  const animateProps = ready
    ? {
        scale: [1, 1.03, 1],
        boxShadow: [
          "0px 0px 0px rgba(0,0,0,0)",
          "0px 0px 30px rgba(15,23,42,0.25)",
          "0px 0px 0px rgba(0,0,0,0)",
        ],
      }
    : undefined;

  return (
    <motion.button
      type="button"
      onClick={onClick}
      animate={shouldReduceMotion ? undefined : animateProps}
      transition={{ duration: 2, repeat: ready ? Infinity : 0 }}
      className={`rounded-full px-4 py-1 text-xs font-semibold uppercase tracking-[0.3em] text-white transition ${
        ready ? " bg-gradient-to-r from-brand-primary to-brand-accent" : "bg-zinc-400"
      }`}
      style={{
        backgroundColor: ready ? "var(--brand-primary)" : "#9CA3AF",
      }}
    >
      LISTO PARA AMPLIFICAR
    </motion.button>
  );
}
