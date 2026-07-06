const fallbackSiteUrl = "https://prasadvaidya.com";

function getPublicEnv(value: unknown) {
  return typeof value === "string" ? value.trim() : "";
}

function normalizeUrl(url: string) {
  return url.replace(/\/+$/, "");
}

export const site = {
  name: "Prasad Vaidya",
  title: "Prasad Vaidya - Technical Architect & Builder",
  description:
    "The working notebook of Prasad Vaidya: software architecture, AI systems, independent products, and the personal systems behind steady work.",
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
  { href: "/projects/", label: "Projects" },
  { href: "/writing/", label: "Writing" },
  { href: "/now/", label: "Now" },
  { href: "/about/", label: "About" }
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

const statusOrder = ["live", "mvp", "beta", "research", "concept"];

function statusRank(status: string) {
  const normalized = status.toLowerCase();
  const rank = statusOrder.findIndex((entry) => normalized.includes(entry));
  return rank === -1 ? statusOrder.length : rank;
}

export function sortProjectsByMaturity<T extends { data: { status: string } }>(items: T[]) {
  return [...items].sort((a, b) => statusRank(a.data.status) - statusRank(b.data.status));
}
