"use client";

import { type ReactNode } from "react";
import { motion, useReducedMotion, type Variants } from "framer-motion";

type RevealVariant = "fade-up" | "fade" | "scale";

type ScrollRevealProps = {
  children: ReactNode;
  className?: string;
  /** Extra delay after the section enters the viewport (seconds). */
  delay?: number;
  variant?: RevealVariant;
  /** Fraction of the element that must be visible before animating (0–1). */
  amount?: number;
};

const variants: Record<RevealVariant, Variants> = {
  "fade-up": {
    hidden: { opacity: 0, y: 72, scale: 0.98 },
    visible: { opacity: 1, y: 0, scale: 1 },
  },
  fade: {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
  },
  scale: {
    hidden: { opacity: 0, y: 36, scale: 0.9 },
    visible: { opacity: 1, y: 0, scale: 1 },
  },
};

const EASE = [0.22, 1, 0.36, 1] as const;

/**
 * Clear scroll-triggered entrance animation.
 * Plays once when the element enters the viewport; respects reduced-motion.
 */
export default function ScrollReveal({
  children,
  className,
  delay = 0,
  variant = "fade-up",
  amount = 0.1,
}: ScrollRevealProps) {
  const prefersReducedMotion = useReducedMotion();

  if (prefersReducedMotion) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      className={className}
      variants={variants[variant]}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount }}
      transition={{
        duration: 0.85,
        ease: EASE,
        delay,
      }}
      style={{ willChange: "transform, opacity" }}
    >
      {children}
    </motion.div>
  );
}
