import type { NextConfig } from "next";

const securityHeaders = [
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "X-Frame-Options", value: "DENY" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" }
];

const basePath = (process.env.NEXT_PUBLIC_BASE_PATH ?? "").replace(/\/$/, "");

const nextConfig: NextConfig = {
  // Empty on local/Vercel previews; /academy in the Hostinger VPS build.
  // This makes Next generate routes and static assets below sacf.io/academy.
  basePath,
  output: "standalone",
  // Next's built-in optimizer resolves public assets from the domain root.
  // Under /academy that points to the main SACF site, so serve local images directly.
  images: {
    unoptimized: Boolean(basePath)
  },
  async headers() {
    return [{ source: "/(.*)", headers: securityHeaders }];
  }
};

export default nextConfig;
