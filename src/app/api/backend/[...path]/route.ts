import { proxyToBackend } from "@/lib/api/backend-proxy";

export const runtime = "nodejs";

type RouteContext = { params: Promise<{ path: string[] }> };

async function handle(request: Request, context: RouteContext) {
  const { path } = await context.params;
  console.log(
    JSON.stringify({
      scope: "backend-proxy-route",
      event: "handler.enter",
      method: request.method,
      path: path.join("/"),
    }),
  );
  return proxyToBackend(request, path);
}

export const GET = handle;
export const POST = handle;
export const PUT = handle;
export const PATCH = handle;
export const DELETE = handle;
export const OPTIONS = handle;
