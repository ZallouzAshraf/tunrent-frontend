/** Locale prefix for redirects (next-intl `localePrefix: as-needed`). */
export function localePrefixFromPath(pathname: string): string {
  if (pathname === "/ar" || pathname.startsWith("/ar/")) {
    return "/ar";
  }
  return "";
}

export function withLocalePrefix(path: string, localePrefix: string): string {
  const normalized = path.startsWith("/") ? path : `/${path}`;
  if (!localePrefix) return normalized;
  if (normalized === localePrefix || normalized.startsWith(`${localePrefix}/`)) {
    return normalized;
  }
  return `${localePrefix}${normalized}`;
}
