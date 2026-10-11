import type { NextConfig } from "next";

const isGithubPages = process.env.GITHUB_PAGES?.trim() === "true";
const isStaticExport =
  isGithubPages ||
  process.env.STATIC_EXPORT?.trim() === "true" ||
  process.env.AWS_EXPORT?.trim() === "true" ||
  process.env.AWS_BRANCH !== undefined ||
  process.env.AWS_APP_ID !== undefined;

const nextConfig: NextConfig = {
  output: isStaticExport ? "export" : undefined,
  basePath: isGithubPages ? "/ecogrid-ai" : "",
  images: {
    unoptimized: true,
  },
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
