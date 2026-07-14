import bcrypt from "bcryptjs";
import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { prisma } from "@/lib/db";

export const { handlers, auth, signIn, signOut } = NextAuth({
  session: { strategy: "jwt" },
  pages: { signIn: "/login" },
  trustHost: true,
  providers: [
    Credentials({
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Senha", type: "password" }
      },
      async authorize(credentials) {
        const email = String(credentials?.email ?? "")
          .trim()
          .toLowerCase();
        const password = String(credentials?.password ?? "");
        if (!email || !password) return null;

        const user = await prisma.user.findUnique({ where: { email } });
        if (!user || !user.passwordHash || !user.emailVerified) return null;

        const valid = await bcrypt.compare(password, user.passwordHash);
        if (!valid) return null;

        return { id: user.id, email: user.email, name: user.name };
      }
    }),
    // Temporary demo shortcut so we can click through role screens during
    // review. Only wired up when DEMO_LOGIN_ENABLED=true (never set in
    // production) — never touches passwords, just looks up a fixed seeded
    // demo account by role. Remove this provider + the buttons once the
    // product review is done.
    Credentials({
      id: "demo",
      name: "Demo",
      credentials: { role: { label: "Role", type: "text" } },
      async authorize(credentials) {
        if (process.env.NODE_ENV === "production" || process.env.DEMO_LOGIN_ENABLED !== "true") return null;

        const demoEmails: Record<string, string> = {
          sacf_admin: "admin@sacf.io",
          org_admin: "ana@zasso.com",
          student: "carlos@zasso.com"
        };
        const email = demoEmails[String(credentials?.role ?? "")];
        if (!email) return null;

        const user = await prisma.user.findUnique({ where: { email } });
        if (!user) return null;

        return { id: user.id, email: user.email, name: user.name };
      }
    })
  ],
  callbacks: {
    async jwt({ token, user, trigger, session }) {
      if (user?.id) {
        const [membership, groupMemberships] = await Promise.all([
          prisma.organizationMember.findFirst({
            where: { userId: user.id },
            include: { organization: true }
          }),
          prisma.groupMember.findMany({
            where: { userId: user.id },
            include: { group: true }
          })
        ]);

        token.userId = user.id;
        token.role = membership?.role ?? "student";
        token.organizationId = membership?.organizationId ?? null;
        token.organizationSlug = membership?.organization.slug ?? null;
        token.organizationName = membership?.organization.name ?? null;
        token.groups = groupMemberships.map((membershipRow) => membershipRow.group.slug);
      }

      if (trigger === "update" && session) {
        if (typeof session.name === "string") token.name = session.name;
        // Profile images must never be stored in the JWT. A base64 image would
        // inflate the session cookie past proxy header limits and make the app
        // unreachable before a request even reaches Next.js.
        delete token.picture;
      }

      return token;
    },
    async session({ session, token }) {
      session.user.id = (token.userId as string | undefined) ?? "";
      session.user.role = (token.role as string | null | undefined) ?? null;
      session.user.organizationId = (token.organizationId as string | null | undefined) ?? null;
      session.user.organizationSlug =
        (token.organizationSlug as string | null | undefined) ?? null;
      session.user.organizationName =
        (token.organizationName as string | null | undefined) ?? null;
      session.user.groups = (token.groups as string[] | undefined) ?? [];
      session.user.image = null;
      return session;
    }
  }
});
