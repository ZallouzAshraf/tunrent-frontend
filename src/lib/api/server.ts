const API_URL =
  process.env.BACKEND_URL?.trim()?.replace(/\/$/, "") ||
  process.env.NEXT_PUBLIC_API_URL?.trim()?.replace(/\/$/, "") ||
  "http://localhost:3000";

export async function serverFetch<T>(
  path: string,
  init?: RequestInit & { next?: { revalidate?: number } },
): Promise<T | null> {
  try {
    const res = await fetch(`${API_URL}${path}`, {
      ...init,
      headers: {
        "Content-Type": "application/json",
        ...init?.headers,
      },
    });
    if (!res.ok) return null;
    return (await res.json()) as T;
  } catch {
    return null;
  }
}
