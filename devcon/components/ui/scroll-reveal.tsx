"use client";

import { useEffect, useRef, type CSSProperties, type ReactNode } from "react";

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

/** Starting transform for each variant. Opacity is always 0 to begin with. */
const HIDDEN_TRANSFORM: Record<RevealVariant, string> = {
  "fade-up": "translateY(72px) scale(0.98)",
  fade: "none",
  scale: "translateY(36px) scale(0.9)",
};

const DURATION = 0.85;
const EASE = "cubic-bezier(0.22, 1, 0.36, 1)";

/**
 * Clear scroll-triggered entrance animation.
 * Plays once when the element enters the viewport; respects reduced-motion.
 *
 * Implemented with a CSS transition driven by an IntersectionObserver rather than
 * an animation library. framer-motion cost 154.5KB of the client bundle for three
 * entrance effects, and under Lighthouse's 4x CPU throttling that script evaluation
 * sat on the critical path — it showed up as LCP render delay (see PERF-03).
 *
 * The reveal is applied by mutating the node directly instead of through React
 * state, so entering the viewport costs no re-render, and the server and client
 * render identical markup.
 */
export default function ScrollReveal({
  children,
  className,
  delay = 0,
  variant = "fade-up",
  amount = 0.1,
}: ScrollRevealProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const reveal = () => {
      el.style.opacity = "1";
      el.style.transform = "none";
    };

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      el.style.transition = "none";
      reveal();
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            reveal();
            observer.disconnect();
          }
        }
      },
      // Matches framer-motion's `amount`: the fraction that must be visible.
      { threshold: Math.min(Math.max(amount, 0), 1) },
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [amount]);

  const style: CSSProperties = {
    opacity: 0,
    transform: HIDDEN_TRANSFORM[variant],
    transition: `opacity ${DURATION}s ${EASE} ${delay}s, transform ${DURATION}s ${EASE} ${delay}s`,
  };

  return (
    <div ref={ref} className={className} style={style}>
      {children}
    </div>
  );
}
