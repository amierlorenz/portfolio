// Eleventy builds the site into _site/ (deployed by GitHub Actions).
// Templates (.njk, .md) become pages; everything else the site needs is copied as-is.
import fs from "node:fs";
import { feedPlugin } from "@11ty/eleventy-plugin-rss";
import site from "./_data/site.js";
import topics, { fallback as topicFallback } from "./_data/topics.js";

// Drafts are visible while previewing locally (`npm start`) and never in a real build (`npm run build`).
export const showDrafts = process.env.ELEVENTY_RUN_MODE === "serve";

export default function (config) {
  // Static files, copied byte for byte. "media" is where Pages CMS uploads images.
  ["css", "js", "assets", "data", "media", "resume.pdf", "CNAME", "robots.txt"]
    .forEach((path) => config.addPassthroughCopy(path));

  // .gitignore is already ignored (node_modules, _site). Also skip files that aren't pages:
  // root-level docs (CLAUDE.md, MEDIA.md, ...) and the archive submodule.
  config.ignores.add("*.md");
  config.ignores.add("portfolio-archive/**");

  // A line holding only a {% tag %} leaves nothing behind, so partials don't add blank lines.
  config.setNunjucksEnvironmentOptions({ trimBlocks: true, lstripBlocks: true });

  // ---------- Posts ----------
  // Every Markdown file in blog/, newest first, without drafts. Everything that lists posts reads this:
  // the homepage Writing section, /blog/, More writing, the nav's Writing link.
  config.addCollection("posts", (api) =>
    api.getFilteredByGlob("blog/*.md")
      .filter((post) => showDrafts || !post.data.draft)
      .sort((a, b) => b.date - a.date));


  // ---------- Feed (/feed.xml) ----------
  // Atom feed of the newest 20 published posts, built from the same "posts" collection (so no drafts).
  config.addPlugin(feedPlugin, {
    type: "atom",
    outputPath: "/feed.xml",
    collection: { name: "posts", limit: 20, sort: "descending" },
    metadata: {
      language: "en",
      title: `Writing · ${site.name}`,
      subtitle: "Build logs from my projects, notes from teaching and learning, and the occasional essay.",
      base: `${site.url}/`,
      author: { name: site.name },
    },
  });

  // ---------- Filters (used as {{ value | name }} in templates) ----------
  // Dates: front matter dates are midnight UTC, so format in UTC or they slip a day in the Americas.
  const fmt = (date, opts) => new Date(date).toLocaleDateString("en-US", { timeZone: "UTC", ...opts });
  config.addFilter("monthYear", (date) => fmt(date, { month: "short", year: "numeric" }));     // Nov 2026
  config.addFilter("longDate", (date) => fmt(date, { month: "long", day: "numeric", year: "numeric" })); // November 4, 2026
  config.addFilter("isoDate", (date) => new Date(date).toISOString().slice(0, 10));            // 2026-11-04

  // Minutes to read a post, at ~230 words a minute: {{ post.inputPath | readingTime }}.
  // Counted from the source file, so any page can show it without waiting for that post to render.
  const minutes = new Map();
  config.addFilter("readingTime", (inputPath) => {
    if (!minutes.has(inputPath)) {
      const body = fs.readFileSync(inputPath, "utf8").replace(/^---[\s\S]*?\n---/, "");
      const words = body.replace(/<[^>]+>|[#*_`>\[\]()!-]/g, " ").split(/\s+/).filter(Boolean).length;
      minutes.set(inputPath, Math.max(1, Math.round(words / 230)));
    }
    return minutes.get(inputPath);
  });
  config.on("eleventy.before", () => minutes.clear()); // re-count after edits in `npm start`

  // Absolute URL for Open Graph tags: "/media/blog/x.png" -> "https://amierlorenz.com/media/blog/x.png"
  config.addFilter("fullUrl", (path, base) => new URL(path, base).href);

  // { color, ring, text } for a topic; unknown topics are grey until they're added to _data/topics.js
  config.addFilter("topic", (name) => topics[name] || topicFallback);

  // Topics that have posts, in the order they first appear, with their counts (All writing chips)
  config.addFilter("topicCounts", (posts) => {
    const counts = new Map();
    for (const post of posts) counts.set(post.data.topic, (counts.get(post.data.topic) || 0) + 1);
    return [...counts].filter(([name]) => name).map(([name, count]) => ({ name, count }));
  });

  // Other posts for "More writing", and the first n of a list
  config.addFilter("except", (posts, url) => posts.filter((post) => post.url !== url));
  config.addFilter("head", (list, n) => list.slice(0, n));

  // A featured project's newest Build log: the first (posts are newest first) published post with
  // type "Build log" and the same repo. Compared loosely, so "…/Repo/" matches "…/repo".
  const sameRepo = (a, b) => !!a && !!b && a.trim().toLowerCase().replace(/\/+$/, "") === b.trim().toLowerCase().replace(/\/+$/, "");
  config.addFilter("buildLogFor", (posts, repo) =>
    posts.find((post) => post.data.type === "Build log" && !post.data.draft && sameRepo(post.data.repo, repo)));

  // "https://github.com/amierlorenz/mieracle-study" -> "amierlorenz/mieracle-study"
  config.addFilter("repoName", (url) => {
    try { return new URL(url).pathname.replace(/^\/|\/$/g, ""); } catch { return url; }
  });

  // Give every <h2>/<h3> in a post an id, so the contents rail can link to it. Works on the HTML
  // whether the body was written as Markdown or saved as HTML by the editor.
  const slugify = (text) => text.toLowerCase().replace(/<[^>]+>/g, "").replace(/&[a-z#0-9]+;/g, "")
    .replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "") || "section";
  config.addFilter("headingIds", (html = "") => {
    const used = new Set();
    return String(html).replace(/<(h[23])(\s[^>]*)?>([\s\S]*?)<\/\1>/g, (match, tag, attrs = "", inner) => {
      if (/\sid=/.test(attrs)) return match;
      let id = slugify(inner), n = 2;
      while (used.has(id)) id = `${slugify(inner)}-${n++}`;
      used.add(id);
      return `<${tag} id="${id}"${attrs}>${inner}</${tag}>`;
    });
  });
  // The post's sections for the contents rail: [{ id, text }] from its <h2>s (run after headingIds)
  config.addFilter("toc", (html = "") =>
    [...String(html).matchAll(/<h2[^>]*\sid="([^"]+)"[^>]*>([\s\S]*?)<\/h2>/g)]
      .map(([, id, inner]) => ({ id, text: inner.replace(/<[^>]+>/g, "").trim() })));

  return {
    templateFormats: ["md", "njk"],
    // Markdown files may contain {{ }} by accident (code samples); don't run them through Nunjucks
    markdownTemplateEngine: false,
    dir: { output: "_site" },
  };
}
