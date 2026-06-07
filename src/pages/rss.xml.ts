import rss from "@astrojs/rss";
import { getCollection } from "astro:content";
import type { APIContext } from "astro";
import { site, sortByDate } from "../utils/site";

export async function GET(context: APIContext) {
  const posts = sortByDate((await getCollection("blog")).filter((post) => !post.data.draft));

  return rss({
    title: `${site.name} - Writing`,
    description: "Technical notes on software architecture, AI engineering, SaaS building, leadership, and personal systems.",
    site: context.site ?? site.url,
    items: posts.map((post) => ({
      title: post.data.title,
      description: post.data.description,
      pubDate: post.data.pubDate,
      categories: post.data.tags,
      link: `/writing/${post.id}/`
    }))
  });
}
