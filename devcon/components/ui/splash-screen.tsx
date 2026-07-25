"use client";

import { useEffect, useRef, useState } from "react";
import { MotionConfig, motion } from "framer-motion";

const HOLD_MS = 2200;
const EXIT_MS = 450;
const LABEL = "DevCon Laguna";

export default function SplashScreen() {
  const ref = useRef<HTMLDivElement>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setReady(true);

    const el = ref.current;
    if (!el) return;

    document.body.classList.add("splash-active");
    const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
    const hold = reduced ? 400 : HOLD_MS;

    const exit = setTimeout(() => el.classList.add("splash--exit"), hold);
    const done = setTimeout(() => {
      el.remove();
      document.body.classList.remove("splash-active");
    }, hold + EXIT_MS);

    return () => {
      clearTimeout(exit);
      clearTimeout(done);
    };
  }, []);

  return (
    <MotionConfig reducedMotion="never">
      <div
        ref={ref}
        id="splash-screen"
        className="splash"
        role="status"
        aria-label="Loading"
      >
        <div className="splash-loader" aria-hidden="true">
          <i />
          <i />
          <i />
          <i />
        </div>

        <p className="splash-label" aria-hidden="true">
          {ready
            ? LABEL.split("").map((char, i) => (
                <motion.span
                  key={`${char}-${i}`}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{
                    duration: 0.35,
                    delay: 0.12 + i * 0.04,
                    ease: [0.22, 1, 0.36, 1],
                  }}
                >
                  {char === " " ? "\u00A0" : char}
                </motion.span>
              ))
            : LABEL}
        </p>
      </div>
    </MotionConfig>
  );
}
