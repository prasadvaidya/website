import { absoluteUrl, site } from "./site";

export type StructuredDataObject = Record<string, unknown>;
export type StructuredData = StructuredDataObject | StructuredDataObject[];

const personId = absoluteUrl("/#person");
const websiteId = absoluteUrl("/#website");

export function createBaseStructuredData({
  title,
  description,
  url
}: {
  title: string;
  description: string;
  url: string;
}) {
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Person",
        "@id": personId,
        name: site.author,
        jobTitle: "Principal Technical Architect",
        description: site.description,
        url: site.url,
        sameAs: Object.values(site.socials)
      },
      {
        "@type": "WebSite",
        "@id": websiteId,
        url: site.url,
        name: site.name,
        description: site.description,
        inLanguage: "en",
        publisher: { "@id": personId }
      },
      {
        "@type": "WebPage",
        "@id": `${url}#webpage`,
        url,
        name: title,
        description,
        isPartOf: { "@id": websiteId },
        about: { "@id": personId },
        author: { "@id": personId },
        inLanguage: "en"
      }
    ]
  };
}

export function serializeJsonLd(data: unknown) {
  return JSON.stringify(data).replace(/</g, "\\u003c");
}

export function personReference() {
  return { "@id": personId };
}
