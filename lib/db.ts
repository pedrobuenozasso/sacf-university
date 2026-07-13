import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { parse } from "pg-connection-string";

// Prisma 7 connects through a driver adapter. Next.js loads `.env.local` into
// process.env, so DATABASE_URL is available at runtime (proxy must be up locally).
const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };

// Cloud SQL requires TLS when reached over its public IP. We pass the CA
// certificate as an env var (DATABASE_CA_CERT, raw PEM content) instead of a
// sslrootcert=<path> query param — serverless bundlers don't know to include
// a file that's only referenced inside a connection string, so a file path
// silently fails to resolve at runtime on Vercel.
//
// DB_PASSWORD is also its own env var (not embedded in DATABASE_URL) — the
// password contains a literal "@", which is ambiguous inside a connection
// string URL. Keeping it as a separate field sidesteps that entirely.
function buildPoolConfig() {
  const dbPassword = process.env.DB_PASSWORD;
  const caCert = process.env.DATABASE_CA_CERT;

  if (dbPassword) {
    return {
      host: process.env.DB_HOST,
      port: process.env.DB_PORT ? Number(process.env.DB_PORT) : undefined,
      database: process.env.DB_NAME,
      user: process.env.DB_USER,
      password: dbPassword,
      ssl: caCert
        ? {
            ca: caCert,
            rejectUnauthorized: true,
            // The Cloud SQL server cert is issued for the instance's
            // Google-managed DNS name, not its IP — without this, Node's TLS
            // hostname check runs against the wrong target and every
            // connection fails.
            servername: process.env.DATABASE_CA_SERVERNAME
          }
        : undefined
    };
  }

  const url = process.env.DATABASE_URL;
  if (!url) return {};
  if (!caCert) return { connectionString: url };

  const parsed = parse(url);
  return {
    host: parsed.host ?? undefined,
    port: parsed.port ? Number(parsed.port) : undefined,
    database: parsed.database ?? undefined,
    user: parsed.user ?? undefined,
    password: parsed.password ?? undefined,
    ssl: {
      ca: caCert,
      rejectUnauthorized: true,
      servername: process.env.DATABASE_CA_SERVERNAME
    }
  };
}

function createPrismaClient() {
  const adapter = new PrismaPg(buildPoolConfig());
  return new PrismaClient({ adapter });
}

export const prisma = globalForPrisma.prisma ?? createPrismaClient();

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}
