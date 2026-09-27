import type { NextConfig } from "next";
import { remoteImagePatterns } from "./lib/remote-images";

const nextConfig: NextConfig = {
  turbopack: {
    root: __dirname,
  },
  /**
   * Where the build goes. `.next` in every normal case.
   *
   * The test suite builds the site a second time, against a fixture portal, so
   * the path where the portal returns data is covered rather than only the
   * fallback (TEST-01). The homepage is prerendered, so that second build has to
   * be a real build with the portal configured — serving the first build from a
   * second port would just serve the first build's fallback HTML — and two
   * builds cannot share one output directory.
   */
  distDir: process.env.NEXT_DIST_DIR ?? '.next',
  images: {
    /**
     * Officer and event photos come from the DevConnect Portal as absolute
     * Supabase Storage URLs (CMS-02, CMS-03). `next/image` refuses to optimise a
     * remote host that is not listed here, which is the point — an allowlist
     * stops this site being used to proxy and resize arbitrary images.
     *
     * The list lives in `lib/remote-images.ts` so the portal content layer can
     * check photos against the same list before rendering them.
     */
    remotePatterns: remoteImagePatterns,
    /**
     * AVIF first, WebP for browsers without it (PERF-02).
     *
     * Measured with real throttling, the landing page's LCP was almost all the
     * hero image downloading: 2.25s of a 2.9s LCP, sharing a slow connection
     * with the fonts. The hero is a transparent collage, which AVIF compresses
     * far better than WebP — 102 KB became 36 KB — and LCP went from 2.90s to
     * 2.41s. Confirmed A-B-A (2.90 → 2.41 → 2.91), because an earlier PERF-02
     * "improvement" turned out to be a stale server.
     *
     * The cost: each image is encoded and cached in both formats, and AVIF is
     * slower to encode the first time a size is requested. Both are one-off per
     * image and size.
     */
    formats: ['image/avif', 'image/webp'],
  },
};

export default nextConfig;
