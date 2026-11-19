# Writing a post

Posts are Markdown files in `blog/`, written in **Pages CMS** (app.pagescms.org). Every save is a commit to
`main`; GitHub Actions rebuilds the site and deploys it (about 1 to 2 minutes). Publishing needs no code:
the homepage Writing section, All writing (`/blog/`), the post page, More writing, project Build log buttons,
the feed (`/feed.xml`) and the sitemap all update themselves.

## The flow

1. **Draft.** Pages CMS → portfolio → **Blog** → **Add an entry**. Draft is on by default. Save as often as you
   like: each save is a commit, but a draft never appears on the site, in lists, in the feed or in the sitemap.
   - The file name (and so the URL, `/blog/<name>/`) comes from the title when you first save. It can't change
     later without breaking links, so get the title roughly right first.
   - Use **Heading 2** for sections: they become the contents rail. The title is already the page's Heading 1.
2. **Preview (optional).** `git pull`, then `npm start`, then open `http://localhost:8080/blog/<name>/`.
   Drafts show here with a "Draft" badge.
3. **Publish.** Turn **Draft** off and save. Watch the run in the repo's **Actions** tab.
4. **Check it live** on your phone and desktop: the post, its card on `/blog/` and on the homepage.
5. **Ask Google to index it.** Search Console → **URL Inspection** → paste the post URL → **Request indexing**.
6. **Wait** until URL Inspection says **"URL is on Google"** (usually 2 to 7 days; there's no official rule).
   Medium importing early is fine too: the canonical link (step 8) tells Google the original is yours.
7. **Import to Medium.** Medium → **Write** menu → **Import a story** (or go to medium.com/p/import), paste the
   post URL, fix any formatting, publish.
8. **Check Medium's canonical.** Open the Medium post, View Source, search for `canonical`. It must be your
   amierlorenz.com URL. If it isn't: story settings → **Advanced settings** → **Customize canonical link**.

## Fields

| Field | Notes |
|---|---|
| Title | Required. Also sets the file name / URL on first save |
| Summary | Card text and the search-engine description. Aim for about 160 characters |
| Date | Shown as e.g. "Nov 2026" on cards. Posts are sorted newest first by this |
| Type | Story, Reflection, Dev log, Build log, Notes, Blog. **Build log** is special (see below) |
| Topic | AI, Swift, Teaching, Career, Open source. Colours the dot, the hover ring and the filter chip |
| GitHub repo | Optional repo URL: adds a GitHub link and a "The code" card |
| Cover image | Optional. Without one the card shows the topic and title on white |
| Draft | On = saved but not public |
| Body | Rich text, saved as Markdown. Tables, code blocks, images and underline all work |

**Build logs:** a published post with type **Build log** and the same GitHub repo as a featured project becomes
that project's **Build log →** button on the homepage (the newest one wins).

## Changes that do need code

| To… | Edit |
|---|---|
| Add a type | `values` under `type` in `.pages.yml` |
| Add a topic | `values` under `topic` in `.pages.yml`, and one line with its colours in `_data/topics.js` (grey until then) |
| Add or change a featured project | `_data/projects.js`; for a timeline **Featured ↗** button, `featured: '<id>'` on its item in `data/timeline.js` |
| Add project screens and clips | Files in `media/projects/<repo name>/`, following `MEDIA.md` |
| Change CSS or JS | Bump the `?v=` version everywhere (see `js/main.js`) so phones fetch the new files |

## Good to know

- **Drafts are public on GitHub** (the repo is public), just never on the site. A private repo with Pages needs
  GitHub Pro, which is free with the GitHub Student Developer Pack.
- **Old Medium links** on blog.amierlorenz.com redirect here via the `amierlorenz/blog-redirect` repo. Only posts
  that first lived on Medium need an entry there.
- **Local commands:** `npm start` (preview with drafts, live reload), `npm run build` (exactly what deploys, into `_site/`).
