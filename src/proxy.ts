import { NextResponse, type NextRequest } from "next/server";
import { ADMIN_COOKIE } from "@/lib/admin-session";
import { hostFor, isLocale, type Locale } from "@/i18n/config";

/** Host the visitor typed (behind the reverse proxy the original host is in x-forwarded-host). */
function requestHost(req: NextRequest) {
  return (req.headers.get("x-forwarded-host") ?? req.headers.get("host") ?? req.nextUrl.host).split(",")[0].trim();
}

/** nl.finloa.com → Dutch, everything else → English. */
const localeForHost = (host: string): Locale => (host.startsWith("nl.") ? "nl" : "en");

/** Sends visitors without a session cookie to the admin login. finloa-be verifies the token on every call. */
function adminGuard(req: NextRequest) {
  if (req.nextUrl.pathname === "/admin/login") return NextResponse.next();
  if (!req.cookies.get(ADMIN_COOKIE)?.value) {
    const url = new URL("/admin/login", req.url);
    url.searchParams.set("next", req.nextUrl.pathname);
    return NextResponse.redirect(url);
  }
  return NextResponse.next();
}

export function proxy(req: NextRequest) {
  const { pathname, search } = req.nextUrl;
  if (pathname === "/admin" || pathname.startsWith("/admin/")) return adminGuard(req);

  const host = requestHost(req);

  // /en/... or /nl/... typed directly: send to the clean URL on the matching subdomain
  const first = pathname.split("/")[1];
  if (isLocale(first)) {
    const rest = pathname.slice(first.length + 1) || "/";
    const proto = req.headers.get("x-forwarded-proto") ?? req.nextUrl.protocol.replace(":", "");
    return NextResponse.redirect(`${proto}://${hostFor(first, host)}${rest}${search}`);
  }

  // Public pages live under app/[lang]; the subdomain picks the language
  const url = req.nextUrl.clone();
  url.pathname = `/${localeForHost(host)}${pathname === "/" ? "" : pathname}`;
  return NextResponse.rewrite(url);
}

export const config = {
  matcher: [
    "/admin",
    "/admin/:path*",
    // Every page except API routes, Next internals, metadata files and static files (anything with a dot)
    "/((?!admin|admin-api|_next|sitemap\\.xml|robots\\.txt|.*\\..*).*)",
  ],
};
