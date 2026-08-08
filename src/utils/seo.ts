import { absoluteUrl, site } from "./site";

export type StructuredDataObject = Record<string, unknown>;
export type StructuredData = StructuredDataObject | StructuredDataObject[];

const personId = absoluteUrl("/#person");
const websiteId = absoluteUrl("/#website");

export interface BreadcrumbEntry {
  name: string;
  item: string;
}

export function createBaseStructuredData({
  title,
  description,
  url,
  keywords = [],
  breadcrumb = [],
  datePublished,
  dateModified,
  includeAuthor = true
}: {
  title: string;
  description: string;
  url: string;
  keywords?: string[];
  breadcrumb?: BreadcrumbEntry[];
  datePublished?: string;
  dateModified?: string;
  includeAuthor?: boolean;
}) {
  const breadcrumbId = `${url}#breadcrumb`;

  return {
    "@context": "https://schema.org",
    "@graph": [
      ...(includeAuthor
        ? [
            {
              "@type": "Person",
              "@id": personId,
              name: site.author,
              jobTitle: "Principal Technical Architect",
              description: site.description,
              url: site.url,
              knowsAbout: [
                "Software architecture",
                "Backend systems",
                "SaaS platforms",
                "AI systems",
                "Product engineering"
              ],
              sameAs: Object.values(site.socials)
            }
          ]
        : []),
      {
        "@type": "WebSite",
        "@id": websiteId,
        url: site.url,
        name: site.name,
        description: site.description,
        inLanguage: "en",
        ...(includeAuthor ? { publisher: { "@id": personId } } : {})
      },
      {
        "@type": "WebPage",
        "@id": `${url}#webpage`,
        url,
        name: title,
        description,
        isPartOf: { "@id": websiteId },
        ...(includeAuthor
          ? { about: { "@id": personId }, author: { "@id": personId } }
          : {}),
        inLanguage: "en",
        ...(datePublished ? { datePublished } : {}),
        ...(dateModified ? { dateModified } : {}),
        ...(keywords.length > 0 ? { keywords: keywords.join(", ") } : {}),
        ...(breadcrumb.length > 0 ? { breadcrumb: { "@id": breadcrumbId } } : {})
      },
      ...(breadcrumb.length > 0
        ? [
            {
              "@type": "BreadcrumbList",
              "@id": breadcrumbId,
              itemListElement: breadcrumb.map((entry, index) => ({
                "@type": "ListItem",
                position: index + 1,
                name: entry.name,
                item: entry.item
              }))
            }
          ]
        : [])
    ]
  };
}

export function serializeJsonLd(data: unknown) {
  return JSON.stringify(data).replace(/</g, "\\u003c");
}

export function personReference() {
  return { "@id": personId };
}
