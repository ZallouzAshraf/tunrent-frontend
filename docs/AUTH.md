# TunRent Authentication Architecture

## Part 1 — Strategy: Same-origin proxy (A)

**Chosen approach:** All browser API traffic goes through `https://<frontend>/api/backend/*`, which relays server-side to the NestJS backend on Render.

**Why not B (Bearer-only in localStorage)?** A 7-day refresh token in `localStorage` is one XSS away from full account takeover. HttpOnly cookies keep refresh tokens out of JavaScript reach.

**Why not C (custom domain)?** No shared registrable domain is configured yet (`tunrent.tn`). When DNS is available, migrate to `Domain=.tunrent.tn` cookies and optionally drop the proxy.

**Failure modes closed vs the previous attempt:**

| Failure | Mitigation |
|---------|------------|
| Cookies scoped to `onrender.com` | Proxy makes browser see `vercel.app` as origin |
| `Set-Cookie` merged into one header | `getSetCookie()` + `append`; throws if unavailable |
| `Content-Encoding: gzip` on decompressed body | Strip `content-encoding` before responding |
| Wrong refresh cookie path | `COOKIE_PATH_PREFIX=/api/backend` (required in prod) |
| `BACKEND_URL` missing on Vercel | Proxy throws in production |
| Dev/prod URL mismatch | Always `/api/backend` unless `NEXT_PUBLIC_USE_DIRECT_API=true` |
| Parallel refresh race | Shared in-flight promise in `session.ts` |
| Silent network failures | Axios timeout + user-visible French error messages |

---

## Token model

| Asset | Storage | Lifetime | Purpose |
|-------|---------|----------|---------|
| Access JWT | **Memory only** (`auth-context` / `session.ts`) | ~15 min | `Authorization: Bearer` on API calls |
| `tunrent_rt` | **HttpOnly cookie** | ~7 days | Refresh; sent only to `/api/backend/auth/*` |
| `tunrent_logged_in` | Cookie (JS-readable) | ~7 days | Middleware + bootstrap gate (`=1`) |
| `tunrent_home` | Cookie (JS-readable) | ~7 days | Post-login redirect hint |

**Nothing** is stored in `localStorage` or `sessionStorage` for auth.

---

## Request flow

```
Browser → POST /api/backend/auth/login (Vercel route handler, Node runtime)
       → fetch https://tunrent-backend.onrender.com/auth/login
       ← Set-Cookie: tunrent_rt, tunrent_logged_in, tunrent_home
       ← relay cookies (strip Domain=) to browser
Browser stores cookies on tunrent.vercel.app
Client holds access_token in memory from JSON body
```

---

## SSR vs client

| Layer | Reads | When |
|-------|-------|------|
| **Middleware** | `tunrent_logged_in`, `tunrent_home` | Every page request (edge) |
| **Session bootstrap** | Same flag → `/auth/refresh` | After hydration |
| **Layouts** | In-memory `accessToken` + `/auth/me` | After bootstrap |
| **API client** | Memory Bearer + httpOnly refresh cookie | Every XHR |

**Brief desync window:** Middleware may admit a user with a stale `tunrent_logged_in` while refresh fails → bootstrap clears token → layout redirects to login. This is acceptable.

---

## Part 4 — Local dev parity

| Service | URL | Notes |
|---------|-----|-------|
| Frontend | `http://localhost:3001` | `npm run dev` |
| Backend | `http://localhost:3000` | `npm run start:dev` |
| Browser API | `http://localhost:3001/api/backend/*` | **Same proxy path as production** |

### Frontend `.env.local`

```env
BACKEND_URL=http://localhost:3000
NEXT_PUBLIC_APP_URL=http://localhost:3001
# Do NOT set NEXT_PUBLIC_API_URL unless debugging with:
# NEXT_PUBLIC_USE_DIRECT_API=true
```

### Backend `.env`

```env
NODE_ENV=development
FRONTEND_URL=http://localhost:3001
COOKIE_PATH_PREFIX=/api/backend
```

### Deliberate dev/prod difference

- **Development:** `secure: false` on cookies (HTTP localhost)
- **Production:** `secure: true` (HTTPS only)

Both environments use the **same cookie paths** and **same proxy URL shape**.

---

## Production env vars

### Vercel (frontend)

| Variable | Value | Required |
|----------|-------|----------|
| `BACKEND_URL` | `https://tunrent-backend.onrender.com` | **Yes** |
| `NEXT_PUBLIC_APP_URL` | `https://tunrent.vercel.app` | Yes |
| `NEXT_PUBLIC_API_URL` | — | **Must be unset** |
| `NEXT_PUBLIC_USE_DIRECT_API` | — | **Must be unset** |

### Render (backend)

| Variable | Value | Required |
|----------|-------|----------|
| `NODE_ENV` | `production` | **Yes** |
| `FRONTEND_URL` | `https://tunrent.vercel.app` | **Yes** |
| `COOKIE_PATH_PREFIX` | `/api/backend` | **Yes** |
| `JWT_SECRET` | strong random | Yes |
| `JWT_REFRESH_SECRET` | strong random | Yes |

After changing `NEXT_PUBLIC_*` on Vercel → **redeploy**. `BACKEND_URL` is runtime-only (no rebuild needed).

---

## Key source files

| Area | File |
|------|------|
| Session (client) | `src/lib/auth/session.ts` |
| Axios client | `src/lib/api/client.ts` |
| Proxy | `src/lib/api/backend-proxy.ts` |
| Proxy route | `src/app/api/backend/[...path]/route.ts` |
| Middleware | `src/middleware.ts` |
| Cookie service (backend) | `src/modules/auth/auth-cookie.service.ts` |
| Auth config (backend) | `src/config/auth.config.ts` |

---

## Observability

Structured JSON logs on Render (`AuthService`, `AuthCookieService`):

- `auth.login.success` / `auth.login.failure`
- `auth.refresh.success` / `auth.refresh.failure` / `auth.refresh.reuse_detected`
- `auth.logout.success` / `auth.logout_all.success`
- `auth.cookies.set` / `auth.cookies.clear`

Vercel function logs (`backend-proxy`):

- `request.received`, `request.forward`, `response.backend`, `response.client`

---

## Future migration (Strategy C)

When `tunrent.tn` DNS is ready:

1. Point `www.tunrent.tn` → Vercel, `api.tunrent.tn` → Render
2. Set cookie `Domain=.tunrent.tn`
3. Optionally remove proxy and call API directly with `credentials: true`
