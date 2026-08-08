import mdx from "@astrojs/mdx";
import sitemap from "@astrojs/sitemap";
import tailwind from "@astrojs/tailwind";
import { defineConfig } from "astro/config";
import { execFileSync } from "node:child_process";
import { existsSync, readFileSync, readdirSync } from "node:fs";

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

// Route sections that are rendered from a content collection rather than a page file.
const collectionDirectories = {
  products: "src/content/products",
  projects: "src/content/projects",
  writing: "src/content/blog"
};

const collectionRouteFiles = {
  products: "src/pages/products/[...id].astro",
  projects: "src/pages/projects/[...id].astro",
  writing: "src/pages/writing/[...id].astro"
};

// These sources can materially change the metadata, structured data, or navigational
// links of every HTML page, so they participate in each page's lastmod calculation.
const sharedPageSources = [
  "src/layouts/BaseLayout.astro",
  "src/components/Header.astro",
  "src/components/Footer.astro",
  "src/utils/seo.ts",
  "src/utils/site.ts"
];

function candidateSourceFiles(pathname) {
  const segments = pathname.split("/").filter(Boolean);
  if (segments.length === 0) {
    return [
      "src/pages/index.astro",
      ...Object.values(collectionDirectories),
      ...sharedPageSources
    ];
  }

  const [section, ...rest] = segments;
  const candidates = [...sharedPageSources];
  const collectionDirectory = collectionDirectories[section];

  if (collectionDirectory) {
    if (rest.length === 0) {
      // Collection indexes change when an entry is added, removed, or updated.
      candidates.push(`src/pages/${section}.astro`, collectionDirectory);
    } else {
      const entry = rest.join("/");
      candidates.push(
        `${collectionDirectory}/${entry}.mdx`,
        `${collectionDirectory}/${entry}.md`,
        collectionRouteFiles[section]
      );
      if (section === "writing") candidates.push("src/layouts/BlogLayout.astro");
    }
  }

  const joined = segments.join("/");
  candidates.push(`src/pages/${joined}.astro`, `src/pages/${joined}/index.astro`);
  return [...new Set(candidates)];
}

const lastModifiedCache = new Map();

// Sitemap lastmod is only worth emitting when it is accurate, so it comes from the
// commit that last touched the page's source rather than from the build timestamp.
// Requires full git history: the deploy workflow checks out with fetch-depth: 0.
function lastModifiedFromGit(pathname) {
  if (lastModifiedCache.has(pathname)) return lastModifiedCache.get(pathname);

  let lastModified;
  const candidates = candidateSourceFiles(pathname).filter((candidate) =>
    existsSync(new URL(candidate, import.meta.url))
  );

  if (candidates.length > 0) {
    try {
      // One git query returns the newest commit that touched any source contributing
      // to the rendered URL, including collection entries and shared route layouts.
      const committed = execFileSync("git", ["log", "-1", "--format=%cI", "--", ...candidates], {
        encoding: "utf8",
        stdio: ["ignore", "pipe", "ignore"]
      }).trim();
      if (committed) lastModified = new Date(committed);
    } catch {
      // git unavailable or the sources predate the available history; omit lastmod.
    }
  }

  lastModifiedCache.set(pathname, lastModified);
  return lastModified;
}

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
      // Conversion confirmation pages are noindex; keep them out of the sitemap too.
      filter: (page) =>
        !page.includes("/thanks/") && (hasPublishedBlogPosts || !page.endsWith("/writing/")),
      serialize: (item) => {
        const lastmod = lastModifiedFromGit(new URL(item.url).pathname);
        return lastmod ? { ...item, lastmod } : item;
      }
    })
  ],
  markdown: {
    shikiConfig: {
      theme: "github-dark"
    }
  }
});
