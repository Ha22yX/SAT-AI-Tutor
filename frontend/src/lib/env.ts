// Prefer current host; if running dev on port 3000, map to backend 5080 on same host.
function resolveDefaultApiBase(): string {
  // Safe default for server-side rendering or unset environment variables.
  if (typeof window === "undefined") {
    return "http://127.0.0.1:5080";
  }

  const { protocol, hostname, port } = window.location;

  // Local frontend dev ports map to the Flask backend on 5080.
  if (port === "3000" || port === "3001") {
    return `${protocol}//${hostname}:5080`;
  }

  // Same-origin deployments can call the current origin directly.
  return window.location.origin;
}

const DEFAULT_API_BASE = resolveDefaultApiBase();

export const env = {
  appName: process.env.NEXT_PUBLIC_APP_NAME || "SAT AI Tutor",
  apiBaseUrl: process.env.NEXT_PUBLIC_API_BASE || DEFAULT_API_BASE,
  gamificationCopy:
    process.env.NEXT_PUBLIC_GAMIFICATION_COPY ||
    "Complete a block to keep your streak alive!",
};

export function buildApiUrl(path: string): string {
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  const fallbackOrigin =
    typeof window === "undefined" ? "http://127.0.0.1:5080" : window.location.origin;
  const configuredBase = (env.apiBaseUrl || "").replace(/\/$/, "");

  let baseUrl: URL;
  try {
    baseUrl = new URL(configuredBase || fallbackOrigin);
  } catch {
    const relativeBase = configuredBase.startsWith("/")
      ? configuredBase
      : `/${configuredBase}`;
    baseUrl = new URL(relativeBase, fallbackOrigin);
  }

  const basePath = baseUrl.pathname.replace(/\/$/, "");
  const pathWithoutDuplicateApi =
    basePath.endsWith("/api") && normalizedPath.startsWith("/api/")
      ? normalizedPath.slice("/api".length)
      : normalizedPath;

  return `${baseUrl.origin}${basePath}${pathWithoutDuplicateApi}`;
}
