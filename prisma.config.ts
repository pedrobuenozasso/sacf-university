import { defineConfig } from "prisma/config";

// The application runtime (Next.js) and CI inject their own environment. Avoid
// `process.loadEnvFile()` here: Vercel evaluates Prisma config in serverless
// functions too, where that API treats a missing local file as a fatal error.

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
  },
  datasource: {
    url: process.env.DATABASE_URL ?? "postgresql://placeholder:placeholder@localhost:5432/placeholder",
  },
});
