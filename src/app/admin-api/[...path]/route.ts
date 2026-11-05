import { revalidateTag } from "next/cache";
import { cookies } from "next/headers";
import { ADMIN_COOKIE } from "@/lib/admin-session";
import { SERVER_API_URL } from "@/lib/data";

/**
 * Forwards /admin-api/* from the admin UI to finloa-be's /api/*, adding the session token from the httpOnly cookie.
 * (Not under /api: in production Caddy sends /api/* straight to the backend.)
 */
const ALLOWED = new Set(["auth", "stats", "posts", "videos", "leads", "subscribers"]);

async function forward(req: Request, ctx: RouteContext<"/admin-api/[...path]">) {
  const token = (await cookies()).get(ADMIN_COOKIE)?.value;
  if (!token) return Response.json({ error: "Unauthorized" }, { status: 401 });
  const { path } = await ctx.params;
  if (!ALLOWED.has(path[0])) return Response.json({ error: "Not found" }, { status: 404 });

  const url = `${SERVER_API_URL}/api/${path.map(encodeURIComponent).join("/")}${new URL(req.url).search}`;
  const headers = new Headers({ Authorization: `Bearer ${token}` });
  const type = req.headers.get("content-type");
  if (type) headers.set("content-type", type);
  const mutating = req.method !== "GET" && req.method !== "HEAD";

  const res = await fetch(url, {
    method: req.method,
    headers,
    body: mutating ? await req.text() : undefined,
    cache: "no-store",
  }).catch(() => null);
  if (!res) return Response.json({ error: "Cannot reach the API. Is finloa-be running?" }, { status: 502 });

  // Show the change on the public site right away
  if (mutating && res.ok && (path[0] === "posts" || path[0] === "videos")) revalidateTag(path[0], { expire: 0 });

  const out = new Headers();
  const ct = res.headers.get("content-type");
  if (ct) out.set("content-type", ct);
  return new Response(res.status === 204 ? null : res.body, { status: res.status, headers: out });
}

export { forward as GET, forward as POST, forward as PATCH, forward as DELETE };
