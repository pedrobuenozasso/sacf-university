import { defineConfig, env } from "prisma/config";

// Prisma 7 no longer auto-loads .env. Load the local env file (ignored in CI/Vercel,
// where DATABASE_URL is provided as a real environment variable).
try {
  process.loadEnvFile(".env.local");
} catch {
  // .env.local absent (e.g. CI/production) — rely on the ambient environment.
}

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
  },
  datasource: {
    url: env("DATABASE_URL"),
  },
});
