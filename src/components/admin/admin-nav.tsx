"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { logout } from "@/app/admin/actions";

type Item = { href: string; label: string };
type Group = Item & { icon: keyof typeof ICONS; items?: Item[] };

const MENU: Group[] = [
  { href: "/admin", label: "Dashboard", icon: "dashboard" },
  {
    href: "/admin/posts",
    label: "Blog posts",
    icon: "posts",
    items: [
      { href: "/admin/posts", label: "All posts" },
      { href: "/admin/posts/new", label: "Add new" },
    ],
  },
  { href: "/admin/videos", label: "YouTube videos", icon: "videos" },
  { href: "/admin/leads", label: "Leads", icon: "leads" },
  { href: "/admin/subscribers", label: "Subscribers", icon: "subscribers" },
];

const ICONS = {
  dashboard: "M3 13h8V3H3zm10 8h8V11h-8zM3 21h8v-6H3zm10-18v6h8V3z",
  posts: "M4 4h16v4H4zm0 6h10v2H4zm0 4h16v2H4zm0 4h10v2H4z",
  videos: "M2.5 6.5a3 3 0 0 1 3-3h13a3 3 0 0 1 3 3v11a3 3 0 0 1-3 3h-13a3 3 0 0 1-3-3zM10 9l5 3-5 3z",
  leads: "M12 12a4.5 4.5 0 1 0 0-9 4.5 4.5 0 0 0 0 9m-8 9c0-4.4 3.6-7 8-7s8 2.6 8 7z",
  subscribers: "M3 5h18v14H3zm0 1 9 7 9-7",
};

const matches = (path: string, href: string) =>
  href === "/admin" ? path === "/admin" : path === href || path.startsWith(href + "/");

/** The most specific menu link for this path, so "Add new" wins over "All posts". */
function currentHref(path: string) {
  let best = "";
  for (const g of MENU)
    for (const l of [g, ...(g.items ?? [])]) if (matches(path, l.href) && l.href.length > best.length) best = l.href;
  return best;
}

export function AdminNav() {
  const path = usePathname();
  const current = currentHref(path);
  const isOpen = (g: Group) => current === g.href || !!g.items?.some((i) => i.href === current);

  return (
    <aside className="ad-side">
      <Link href="/admin" className="ad-side__logo">
        FINLOA <small>ADMIN</small>
      </Link>
      <nav className="ad-side__nav" aria-label="Admin">
        {MENU.map((g) => (
          <div key={g.href} className={`ad-grp${isOpen(g) ? " is-open" : ""}`}>
            <Link href={g.href} className="ad-nav" aria-current={isOpen(g) && !g.items ? "page" : undefined}>
              <svg viewBox="0 0 24 24" aria-hidden="true" className="ad-nav__icon">
                <path d={ICONS[g.icon]} />
              </svg>
              {g.label}
            </Link>
            {g.items && (
              <div className="ad-sub">
                {g.items.map((i) => (
                  <Link key={i.href} href={i.href} className="ad-sub__link" aria-current={i.href === current ? "page" : undefined}>
                    {i.label}
                  </Link>
                ))}
              </div>
            )}
          </div>
        ))}
      </nav>
      <div className="ad-side__foot">
        <a href="/" target="_blank" rel="noreferrer">
          View site ↗
        </a>
        <form action={logout}>
          <button type="submit">Sign out</button>
        </form>
      </div>
    </aside>
  );
}
