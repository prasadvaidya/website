import mdx from "@astrojs/mdx";
import sitemap from "@astrojs/sitemap";
import tailwind from "@astrojs/tailwind";
import { defineConfig } from "astro/config";
import { readFileSync, readdirSync } from "node:fs";

const site = process.env.PUBLIC_SITE_URL ?? "https://prasadvaidya.com";
const blogContentDir = new URL("./src/content/blog/", import.meta.url);

function isPublishedMarkdownFile(file) {
  const content = readFileSync(file, "utf8");
  const frontmatter = content.match(/^---\n([\s\S]*?)\n---/);
  return !frontmatter?.[1].match(/^draft:\s*true\s*$/m);
}

function hasPublishedMarkdownFiles(directory) {
  try {
    return readdirSync(directory, { withFileTypes: true }).some((entry) => {
      const entryUrl = new URL(entry.name, directory);
      if (entry.isDirectory()) return hasPublishedMarkdownFiles(new URL(`${entry.name}/`, directory));
      return /\.(md|mdx)$/.test(entry.name) && isPublishedMarkdownFile(entryUrl);
    });
  } catch {
    return false;
  }
}

const hasPublishedBlogPosts = hasPublishedMarkdownFiles(blogContentDir);

export default defineConfig({
  site,
  output: "static",
  redirects: {
    "/work": "/about/",
    "/life": "/now/",
    "/contact": "/about/"
  },
  integrations: [
    mdx(),
    tailwind({
      applyBaseStyles: false
    }),
    sitemap({
      filter: (page) => hasPublishedBlogPosts || !page.endsWith("/writing/")
    })
  ],
  markdown: {
    shikiConfig: {
      theme: "github-dark"
    }
  }
});
