# Prototype decisions: Featured Projects, Writing, blog pages

Throwaway prototype on branch `prototype/projects-section` (never merged). This file is the answer it
settled; the real build (handoff's `feat/blog-pages-cms`) rewrites these properly in Eleventy + Pages CMS.

Run it: `python3 -m http.server 8137`, then `/` (homepage), `/blog-prototype/` (All writing),
`/blog-prototype/post.html` (a post).

## Homepage

- **Featured Projects = case files.** One row per featured project (alternating sides): kicker
  (kind · status), serif name, blurb, stack tags, then buttons **Build log →** (dark, only when the project
  has a post) and **GitHub**.
- **Screens:** three white cards per project: a looping clip in front, two stills behind. Phone apps use
  phone-shaped cards; web/terminal projects use window-shaped cards (never mixed). Hover spreads the back
  cards apart; on touch they spread once on scroll-in. **Click a back card to bring it to the front.**
- **Status words:** "In progress" / "Completed" (not "Shipped").
- **Buttons** reuse the hero button look (`.hero-btn`); small size for the timeline.
- **No hover pop-ups** anywhere (no floating previews).
- **Writing section** right after Projects, titled **Writing**: a featured post (card art, meta, title,
  summary) + a list of the next four (title, meta). Link: **All writing →** as a muted text link.
- **Nav** gets a **Writing** link (desktop and phone menu).
- **Timeline:** featured projects get a small **Featured ↗** hero-style button that scrolls to that case
  file. The card's own click (pin + branch graph) is unchanged.
- **Phone menu:** links centred between the nav and the Email / Book a Chat buttons (`css/nav.css`,
  already changed on this branch; carry it over).

## All writing page (`/blog/`)

- Muted **← Back** text link (to `/#writing`), big serif **Writing**, one-line lede, topic filter chips
  (white pills, dark when selected), then a **3-column card grid** (2 on tablets, 1 on phones).

## Post card (homepage, All writing, More writing)

- Art on top: the post's **cover image** if it has one, otherwise a white card with the topic dot + title.
- Below: `Mon YYYY · Type · Project · N min`, the title, the summary.
- Hover ring takes the **topic colour** (Swift coral, AI teal, Teaching yellow, Career dark, Open source grey).

## Post page (`/blog/<slug>/`)

- **Header:** full-width yellow band starting below the nav: muted **← All writing**, `Type · Project`
  kicker, serif title (lines fill, no balancing), summary, `date · N min read · topic`.
- **Body:** ~840px text column; code, images and tables stay inside it. Styles for everything Markdown makes:
  h2 (serif), h3, lists, links, inline code, dark code blocks (scroll sideways on phones), quotes with a
  yellow bar, images, dividers, full-width tables.
- **Side rail** (desktop only, hidden ≤960px): **Contents** from the post's H2s with an animated tracker
  (yellow line fills as you read each section, dot at its end; read = dark, current = bold), a
  "Build log for <Project> →" link for build logs, and **Back to top ↑** (scrolls to the very top).
- **End matter:** build logs get a white "This is a build log for" card (See the project / GitHub);
  every post ends with **More writing** (3 cards) and **All writing →**.

## Pages CMS fields (one Markdown file per post)

| Field | Type | Notes |
|---|---|---|
| `title` | string, required | |
| `description` | text, maxlength ~160 | card summary + meta description |
| `date` | date | |
| `type` | select: Essay, Build log, Notes | |
| `topic` | select: AI, Swift, Teaching, Career, Open source | colour + filter |
| `project` | select: featured project names, optional | links build logs to their case file |
| `cover` | image, optional | |
| `draft` | boolean, default true | |
| `body` | rich-text, format markdown | |

Reading time is computed at build. Still to confirm in the real editor: which formatting the rich-text
toolbar offers (tables especially).

## Media

Capture rules for screenshots and clips: see `MEDIA.md`.
