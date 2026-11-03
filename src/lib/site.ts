export const FOOTER_COLUMNS = [
  {
    title: "Services",
    links: [
      { href: "/ai-marketing", label: "AI Marketing" },
      { href: "/website-design", label: "Website Design & Development" },
      { href: "/video-creation", label: "Video Creation" },
    ],
  },
  {
    title: "Expertise",
    links: [
      { href: "/seo", label: "SEO" },
      { href: "/content-marketing", label: "Content Marketing" },
      { href: "/paid-media", label: "Paid Advertising" },
    ],
  },
  { title: "Industries", links: [{ href: "/for-creators", label: "For Creators" }] },
  {
    title: "About Us",
    links: [
      { href: "/why-finloa", label: "Why Finloa?" },
      { href: "/blog", label: "Blog" },
      { href: "/careers", label: "Careers" },
    ],
  },
] as const;

export const HEADER_NAV = [
  { href: "/video-creation", label: "Video Creation" },
  { href: "/services", label: "Services" },
  { href: "/for-creators", label: "For Creators" },
  { href: "/why-finloa", label: "Why Finloa" },
  { href: "/blog", label: "Blog" },
] as const;
