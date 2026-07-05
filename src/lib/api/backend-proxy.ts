const PROXY_TIMEOUT_MS = 55_000;

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

function logProxy(event: string, data: Record<string, unknown>): void {
  console.log(JSON.stringify({ scope: "backend-proxy", event, ...data }));
}

export function getBackendUrl(): string {
  const fromEnv = process.env.BACKEND_URL?.trim();
  if (fromEnv) {
    return fromEnv.replace(/\/$/, "");
  }

  if (process.env.NODE_ENV === "production") {
    throw new Error(
      "[backend-proxy] BACKEND_URL is required in production on Vercel",
    );
  }

  const fallback =
    process.env.NEXT_PUBLIC_API_URL?.trim() || "http://localhost:3000";
  return fallback.replace(/\/$/, "");
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
  logProxy("request.received", { method, path });

  const headers = new Headers();
  for (const name of FORWARD_REQUEST_HEADERS) {
    const value = request.headers.get(name);
    if (value) {
      headers.set(name, value);
    }
  }

  const hasBody = !["GET", "HEAD"].includes(method);
  const body = hasBody ? await request.arrayBuffer() : undefined;

  logProxy("request.forward", {
    method,
    target: target.toString(),
    hasBackendUrlEnv: Boolean(process.env.BACKEND_URL?.trim()),
  });

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), PROXY_TIMEOUT_MS);

  let backendResponse: Response;
  try {
    backendResponse = await fetch(target.toString(), {
      method,
      headers,
      body: body && body.byteLength > 0 ? body : undefined,
      redirect: "manual",
      cache: "no-store",
      signal: controller.signal,
    });
  } catch (error) {
    const reason =
      error instanceof Error && error.name === "AbortError"
        ? "timeout"
        : "network_error";
    logProxy("request.failed", { method, path, reason });
    return new Response(
      JSON.stringify({
        message:
          reason === "timeout"
            ? "Backend request timed out"
            : "Backend unreachable",
      }),
      {
        status: reason === "timeout" ? 504 : 502,
        headers: { "Content-Type": "application/json" },
      },
    );
  } finally {
    clearTimeout(timeout);
  }

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

  logProxy("response.backend", {
    status: backendResponse.status,
    setCookieCount: setCookies.length,
    setCookieNames: setCookies.map((c) => c.split("=")[0]?.trim()),
  });

  for (const cookie of setCookies) {
    responseHeaders.append("Set-Cookie", rewriteSetCookieForProxy(cookie));
  }

  logProxy("response.client", {
    status: backendResponse.status,
    outgoingSetCookieCount: setCookies.length,
  });

  return new Response(backendResponse.body, {
    status: backendResponse.status,
    statusText: backendResponse.statusText,
    headers: responseHeaders,
  });
}
