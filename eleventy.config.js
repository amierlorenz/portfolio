// Eleventy builds the site into _site/ (deployed by GitHub Actions).
// Templates (.njk, .md) become pages; everything else the site needs is copied as-is.
export default function (config) {
  // Static files, copied byte for byte. "media" is where Pages CMS uploads images (added in Phase 4).
  ["css", "js", "assets", "data", "media", "resume.pdf", "CNAME"]
    .forEach((path) => config.addPassthroughCopy(path));

  // .gitignore is already ignored (node_modules, _site). Also skip files that aren't pages:
  // root-level docs (CLAUDE.md, MEDIA.md, ...) and the archive submodule.
  config.ignores.add("*.md");
  config.ignores.add("portfolio-archive/**");

  return {
    templateFormats: ["md", "njk"],
    dir: { output: "_site" },
  };
}
