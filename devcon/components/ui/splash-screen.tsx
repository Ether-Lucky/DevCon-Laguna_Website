"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import "./splash-screen.css";

const COLORS = {
  yellow: "#F0C419",
  orange: "#F2801E",
  green: "#6FC71E",
  purple: "#6A0DF2",
} as const;

const LETTERS = ["L", "O", "A", "D", "I", "N", "G"] as const;

/** Hold before exit (~1.4s + 0.45s exit ≈ 1.85s total) */
const HOLD_MS = 1400;

export default function SplashScreen() {
  const [show, setShow] = useState(true);
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const hold = reducedMotion ? 80 : HOLD_MS;
    const timer = window.setTimeout(() => setShow(false), hold);

    return () => {
      window.clearTimeout(timer);
      document.body.style.overflow = previousOverflow;
    };
  }, [reducedMotion]);

  return (
    <AnimatePresence
      onExitComplete={() => {
        document.body.style.overflow = "";
      }}
    >
      {show && (
        <motion.div
          className="splash"
          role="status"
          aria-live="polite"
          aria-label="Loading"
          initial={reducedMotion ? false : { opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={
            reducedMotion
              ? { opacity: 0 }
              : { opacity: 0, scale: 1.03, filter: "blur(4px)" }
          }
          transition={{
            duration: reducedMotion ? 0.1 : 0.45,
            ease: [0.22, 1, 0.36, 1],
          }}
        >
          <motion.div
            className="splash-loader"
            aria-hidden="true"
            initial={reducedMotion ? false : { scale: 0.7, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
          >
            <motion.div
              className="splash-spinner"
              animate={
                reducedMotion ? undefined : { rotate: 360, scale: [1, 0.52, 1] }
              }
              transition={
                reducedMotion
                  ? undefined
                  : {
                      rotate: {
                        duration: 1.05,
                        ease: "linear",
                        repeat: Infinity,
                      },
                      scale: {
                        duration: 1.05,
                        ease: [0.45, 0, 0.55, 1],
                        repeat: Infinity,
                      },
                    }
              }
            >
              <span
                className="splash-dot splash-dot--yellow"
                style={{ background: COLORS.yellow }}
              />
              <span
                className="splash-dot splash-dot--orange"
                style={{ background: COLORS.orange }}
              />
              <span
                className="splash-dot splash-dot--green"
                style={{ background: COLORS.green }}
              />
              <span
                className="splash-dot splash-dot--purple"
                style={{ background: COLORS.purple }}
              />
            </motion.div>
          </motion.div>

          <p className="splash-loading" aria-hidden="true">
            {LETTERS.map((letter, i) => (
              <motion.span
                key={letter}
                className="splash-letter"
                initial={reducedMotion ? false : { opacity: 0, y: 6 }}
                animate={
                  reducedMotion
                    ? { opacity: 0.88 }
                    : {
                        opacity: 0.88,
                        y: [0, -4, 0],
                        color: ["#eaeaea", COLORS.orange, "#eaeaea"],
                      }
                }
                transition={
                  reducedMotion
                    ? { duration: 0.1 }
                    : {
                        opacity: { duration: 0.25, delay: 0.12 + i * 0.04 },
                        y: {
                          duration: 0.85,
                          ease: "easeInOut",
                          repeat: Infinity,
                          delay: 0.4 + i * 0.05,
                          times: [0, 0.35, 1],
                        },
                        color: {
                          duration: 0.85,
                          ease: "easeInOut",
                          repeat: Infinity,
                          delay: 0.4 + i * 0.05,
                          times: [0, 0.35, 1],
                        },
                      }
                }
              >
                {letter}
              </motion.span>
            ))}
          </p>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
