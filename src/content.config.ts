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

export const collections = { blog, projects };
