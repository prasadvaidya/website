const fallbackSiteUrl = "https://prasadvaidya.com";

function getPublicEnv(value: unknown) {
  return typeof value === "string" ? value.trim() : "";
}

function normalizeUrl(url: string) {
  return url.replace(/\/+$/, "");
}

export const site = {
  name: "Prasad Vaidya",
  title: "Prasad Vaidya - Software Architecture, AI Systems, and Product Engineering",
  description:
    "A technical architect's digital garden on software architecture, AI workflows, product engineering, and disciplined personal systems.",
  url: normalizeUrl(getPublicEnv(import.meta.env.PUBLIC_SITE_URL) || fallbackSiteUrl),
  author: "Prasad Vaidya",
  socials: {
    github: "https://github.com/prasadvaidya",
    linkedin: "https://www.linkedin.com/in/prasad-vaidya-80a64839",
    // x: "https://x.com/handle",
    // youtube: "https://youtube.com/@handle"
  }
};

export const seo = {
  googleSiteVerification: getPublicEnv(import.meta.env.PUBLIC_GOOGLE_SITE_VERIFICATION)
};

export const analytics = {
  cloudflareWebAnalyticsToken: getPublicEnv(import.meta.env.PUBLIC_CLOUDFLARE_WEB_ANALYTICS_TOKEN),
  gaMeasurementId: getPublicEnv(import.meta.env.PUBLIC_GA_MEASUREMENT_ID)
};

export const navItems = [
  { href: "/", label: "Home" },
  { href: "/work/", label: "Architecture" },
  { href: "/writing/", label: "Writing" },
  { href: "/projects/", label: "Projects" },
  { href: "/life/", label: "Life" },
  { href: "/about/", label: "About" },
  { href: "/contact/", label: "Find me" }
];

export function absoluteUrl(path = "/") {
  return new URL(path, site.url).toString();
}

export function formatDate(date: Date) {
  return new Intl.DateTimeFormat("en", {
    year: "numeric",
    month: "short",
    day: "numeric"
  }).format(date);
}

export function sortByDate<T extends { data: { pubDate: Date } }>(items: T[]) {
  return [...items].sort((a, b) => b.data.pubDate.valueOf() - a.data.pubDate.valueOf());
}
