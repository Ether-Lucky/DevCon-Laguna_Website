"use client";

import { preload } from "react-dom";

type HeroImagePreloadProps = {
  desktop: { href: string; srcSet?: string };
  mobile: { href: string; srcSet?: string };
};

/**
 * HeroImagePreload — renders nothing; emits the LCP image preloads into <head>.
 *
 * The hero picture is server-rendered, so the LCP element exists in the HTML
 * immediately, but the parser only discovers its <img> after executing the
 * inline flight payload that precedes it (~0.5s of LCP "load delay" under
 * throttled CPUs). A head preload starts the transfer at TTFB instead.
 *
 * Two media-qualified preloads, mirroring the <picture> sources exactly
 * (same srcSet/sizes): only the breakpoint's own variant can match, so a
 * device still preloads exactly one image — the property that keeps a plain
 * `<Image priority>` on both variants from regressing bytes.
 */
export default function HeroImagePreload({
  desktop,
  mobile,
}: HeroImagePreloadProps) {
  if (desktop.srcSet) {
    preload(desktop.href, {
      as: "image",
      media: "(min-width: 768px)",
      imageSrcSet: desktop.srcSet,
      imageSizes: "60vw",
      fetchPriority: "high",
    });
  }
  if (mobile.srcSet) {
    preload(mobile.href, {
      as: "image",
      media: "(max-width: 767.98px)",
      imageSrcSet: mobile.srcSet,
      imageSizes: "140vw",
      fetchPriority: "high",
    });
  }
  return null;
}