const HOP_BY_HOP = new Set([
  "connection",
  "keep-alive",
  "proxy-authenticate",
  "proxy-authorization",
  "te",
  "trailer",
  "transfer-encoding",
  "upgrade",
  "host",
  "content-length",
  // fetch() decompresses gzip/br bodies; forwarding Content-Encoding breaks the browser.
  "content-encoding",
]);

const FORWARD_REQUEST_HEADERS = [
  "cookie",
  "authorization",
  "content-type",
  "accept",
  "accept-language",
  "x-agency-id",
] as const;

export function getBackendUrl(): string {
  const url =
    process.env.BACKEND_URL?.trim() ||
    process.env.NEXT_PUBLIC_API_URL?.trim() ||
    "http://localhost:3000";
  return url.replace(/\/$/, "");
}

/** Strip Domain= so the browser binds cookies to the frontend host (vercel.app). */
export function rewriteSetCookieForProxy(setCookie: string): string {
  return setCookie
    .replace(/;\s*Domain=[^;]*/gi, "")
    .replace(/;\s*domain=[^;]*/gi, "")
    .trim();
}

export async function proxyToBackend(
  request: Request,
  pathSegments: string[],
): Promise<Response> {
  const backendBase = getBackendUrl();
  const path = pathSegments.join("/");
  const incoming = new URL(request.url);
  const target = new URL(`${backendBase}/${path}`);
  target.search = incoming.search;

  const method = request.method.toUpperCase();
  console.log("[backend-proxy] received", method, path);

  const headers = new Headers();
  for (const name of FORWARD_REQUEST_HEADERS) {
    const value = request.headers.get(name);
    if (value) {
      headers.set(name, value);
    }
  }

  const hasBody = !["GET", "HEAD"].includes(method);
  const body = hasBody ? await request.arrayBuffer() : undefined;

  console.log("[backend-proxy] forwarding to", target.toString(), {
    backendBase,
    hasBackendUrlEnv: Boolean(process.env.BACKEND_URL?.trim()),
  });

  const backendResponse = await fetch(target.toString(), {
    method,
    headers,
    body: body && body.byteLength > 0 ? body : undefined,
    redirect: "manual",
    cache: "no-store",
  });

  const responseHeaders = new Headers();
  backendResponse.headers.forEach((value, key) => {
    const lower = key.toLowerCase();
    if (HOP_BY_HOP.has(lower) || lower === "set-cookie") {
      return;
    }
    responseHeaders.set(key, value);
  });

  if (typeof backendResponse.headers.getSetCookie !== "function") {
    throw new Error(
      "[backend-proxy] headers.getSetCookie() unavailable in this runtime — refusing to relay cookies via unsafe fallback",
    );
  }

  // Do NOT fall back to headers.get('set-cookie') — it merges multiple Set-Cookie headers
  // into one invalid string and silently corrupts auth cookies. Fail loudly instead.
  const setCookies = backendResponse.headers.getSetCookie();

  console.log("[backend-proxy] backend response", {
    status: backendResponse.status,
    setCookieCountFromBackend: setCookies.length,
    setCookieNames: setCookies.map((c) => c.split("=")[0]?.trim()),
  });

  for (const cookie of setCookies) {
    responseHeaders.append("Set-Cookie", rewriteSetCookieForProxy(cookie));
  }

  const outgoingSetCookieCount = setCookies.length;
  console.log("[backend-proxy] returning to browser", {
    status: backendResponse.status,
    outgoingSetCookieCount,
  });

  return new Response(backendResponse.body, {
    status: backendResponse.status,
    statusText: backendResponse.statusText,
    headers: responseHeaders,
  });
}
