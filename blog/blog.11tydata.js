// Directory data: applies to every file in blog/ (each post). Pages CMS writes the posts; this file
// decides how Eleventy builds them.
import { showDrafts } from "../eleventy.config.js";

// The URL part from the file name, always lowercase and hyphenated: "TestDraft" -> "test-draft"
const urlSlug = (name) => name
  .replace(/([a-z0-9])([A-Z])/g, "$1-$2")
  .toLowerCase()
  .replace(/[^a-z0-9]+/g, "-")
  .replace(/^-|-$/g, "");

export default {
  layout: "layouts/post.njk",
  eleventyComputed: {
    // The feed's <summary> for each post is its SEO summary
    summary: (data) => data.description,
    // A published post lives at /blog/<file name>/. A draft gets no page at all (permalink false),
    // except in local preview. The "posts" collection (eleventy.config.js) leaves drafts out of every list.
    permalink: (data) => (data.draft && !showDrafts ? false : `/blog/${urlSlug(data.page.fileSlug)}/`),
  },
};
