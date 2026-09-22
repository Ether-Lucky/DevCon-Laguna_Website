import type { NextConfig } from "next";

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
     * Pinned to the portal's current Supabase project rather than `**.supabase.co`.
     * A wildcard would survive a project migration, but it would also trust every
     * Supabase project in existence.
     */
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'vdqczedgmehendqqifgs.supabase.co',
        pathname: '/storage/v1/object/public/**',
      },
    ],
  },
};

export default nextConfig;
