import { defineCollection } from "astro:content";
import { glob } from "astro/loaders";
import { z } from "astro/zod";

const blog = defineCollection({
  loader: glob({ base: "./src/content/blog", pattern: "**/*.{md,mdx}" }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    pubDate: z.coerce.date(),
    updatedDate: z.coerce.date().optional(),
    category: z.string(),
    tags: z.array(z.string()).default([]),
    readingTime: z.string(),
    audience: z.string().optional(),
    problem: z.string().optional(),
    relatedProject: z.string().optional(),
    validationStage: z.enum(["idea", "problem", "prototype", "waitlist", "live"]).optional(),
    ctaLabel: z.string().optional(),
    ctaHref: z.string().optional(),
    ogImage: z.string().optional(),
    ogImageAlt: z.string().optional(),
    articleImages: z.array(z.string()).length(3).optional(),
    draft: z.boolean().default(false),
    featured: z.boolean().default(false)
  })
});

const projects = defineCollection({
  loader: glob({ base: "./src/content/projects", pattern: "**/*.{md,mdx}" }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    status: z.string(),
    stack: z.array(z.string()),
    problem: z.string(),
    whyItMatters: z.string(),
    featured: z.boolean().default(false)
  })
});

const products = defineCollection({
  loader: glob({ base: "./src/content/products", pattern: "**/*.{md,mdx}" }),
  schema: z
    .object({
      title: z.string(),
      seoTitle: z.string(),
      description: z.string(),
      headline: z.string(),
      summary: z.string(),
      mode: z.enum(["waitlist", "live"]),
      category: z.string(),
      audience: z.string(),
      problem: z.string(),
      outcome: z.string(),
      keywords: z.array(z.string()).min(3),
      parentProduct: z.string().optional(),
      listingAudience: z.string().optional(),
      listingTitle: z.string().optional(),
      listingDescription: z.string().optional(),
      badge: z.string().optional(),
      benefitsTitle: z.string().optional(),
      finalCtaHeadline: z.string().optional(),
      finalCtaCopy: z.string().optional(),
      ogImage: z.string().optional(),
      ogImageAlt: z.string().optional(),
      updatedDate: z.coerce.date().optional(),
      featured: z.boolean().default(false),
      draft: z.boolean().default(true),
      highlights: z
        .array(
          z.object({
            title: z.string(),
            description: z.string()
          })
        )
        .min(3),
      proof: z
        .array(
          z.object({
            value: z.string(),
            label: z.string()
          })
        )
        .default([]),
      example: z
        .object({
          title: z.string(),
          intro: z.string().optional(),
          lines: z
            .array(
              z.object({
                label: z.string(),
                value: z.string()
              })
            )
            .min(3)
        })
        .optional(),
      faqs: z
        .array(
          z.object({
            question: z.string(),
            answer: z.string()
          })
        )
        .min(2),
      primaryCta: z
        .object({
          label: z.string(),
          href: z.string().url(),
          note: z.string().optional()
        })
        .optional(),
      waitlist: z
        .object({
          formAction: z.string().url(),
          buttonLabel: z.string().default("Join the waitlist"),
          incentive: z.string(),
          redirectUrl: z.string().url().optional()
        })
        .optional()
    })
    .superRefine((product, ctx) => {
      if (product.mode === "waitlist" && !product.waitlist) {
        ctx.addIssue({
          code: "custom",
          message: "Waitlist pages require a waitlist configuration.",
          path: ["waitlist"]
        });
      }

      if (product.mode === "live" && !product.primaryCta) {
        ctx.addIssue({
          code: "custom",
          message: "Live product pages require a primary CTA.",
          path: ["primaryCta"]
        });
      }

      if (
        product.parentProduct &&
        (!product.listingAudience || !product.listingTitle || !product.listingDescription)
      ) {
        ctx.addIssue({
          code: "custom",
          message: "Use-case pages require a listing audience, title, and description.",
          path: ["listingTitle"]
        });
      }
    })
});

export const collections = { blog, projects, products };
