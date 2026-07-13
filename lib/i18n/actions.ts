"use server";

import { cookies } from "next/headers";
import { isLocale, localeCookieName } from "./locales";

export async function setLocale(next: string) {
  if (!isLocale(next)) return;
  const store = await cookies();
  store.set(localeCookieName, next, {
    path: "/",
    maxAge: 60 * 60 * 24 * 365,
    sameSite: "lax"
  });
}
