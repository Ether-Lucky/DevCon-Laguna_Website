import type { NextConfig } from "next";
import { remoteImagePatterns } from "./lib/remote-images";

const nextConfig: NextConfig = {
  turbopack: {
    root: __dirname,
  },
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
  },
};

export default nextConfig;
