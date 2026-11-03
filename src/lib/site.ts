export const SERVICES = [
  { href: "/", label: "Video Creation" },
  { href: "/ai-marketing", label: "AI Marketing" },
  { href: "/website-design", label: "Website Design & Development" },
] as const;

export const EXPERTISE = [
  { href: "/seo", label: "SEO" },
  { href: "/content-marketing", label: "Content Marketing" },
  { href: "/paid-media", label: "Paid Advertising" },
] as const;

export const FOOTER_COLUMNS = [
  { title: "Services", links: SERVICES },
  { title: "Expertise", links: EXPERTISE },
  {
    title: "Industries",
    links: [
      { href: "/", label: "For Businesses" },
      { href: "/for-creators", label: "For Creators" },
    ],
  },
  {
    title: "About Us",
    links: [
      { href: "/why-finloa", label: "Why Finloa?" },
      { href: "/services", label: "All services" },
      { href: "/blog", label: "Blog" },
      { href: "/careers", label: "Careers" },
    ],
  },
] as const;

export const HEADER_NAV = [
  { href: "/", label: "Video Creation" },
  { href: "/services", label: "Services" },
  { href: "/for-creators", label: "For Creators" },
  { href: "/why-finloa", label: "Why Finloa" },
  { href: "/blog", label: "Blog" },
] as const;
