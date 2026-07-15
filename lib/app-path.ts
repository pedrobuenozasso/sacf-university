const configuredBasePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

export const appBasePath = configuredBasePath && configuredBasePath !== "/"
  ? `/${configuredBasePath.replace(/^\/+|\/+$/g, "")}`
  : "";

export function appPath(path: string) {
  return `${appBasePath}${path.startsWith("/") ? path : `/${path}`}`;
}
