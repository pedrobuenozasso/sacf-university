import type { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      role: string | null;
      organizationId: string | null;
      organizationSlug: string | null;
      organizationName: string | null;
      organizationLogoUrl: string | null;
      organizationPrimaryColor: string | null;
      organizationSecondaryColor: string | null;
      groups: string[];
    } & DefaultSession["user"];
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    userId?: string;
    role?: string | null;
    organizationId?: string | null;
    organizationSlug?: string | null;
    organizationName?: string | null;
    organizationLogoUrl?: string | null;
    organizationPrimaryColor?: string | null;
    organizationSecondaryColor?: string | null;
    groups?: string[];
  }
}
