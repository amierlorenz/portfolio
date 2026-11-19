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
- **Discovery:** every project plays the same intro as it scrolls into view: its cards start stacked in
  the front card's spot, low and faded, then deal out (front, left, right); the text rises in just after.
- **Status words:** "In progress" / "Completed" (not "Shipped").
- **Buttons** reuse the hero button look (`.hero-btn`); small size for the timeline.
- **No hover pop-ups** anywhere (no floating previews).
- **Writing section** right after Projects, titled **Writing**, on a **white** band: a featured post (card
  art, meta, title, summary) + a list of the next four (title, meta). Link: **All writing →** as a muted
  text link. A redesign for more delight is tracked in #32.
- **Nav** gets a **Writing** link (desktop and phone menu).
- **Timeline:** featured projects get a small **Featured ↗** hero-style button that scrolls to that case
  file. The card's own click (pin + branch graph) is unchanged.
- **Phone menu:** links centred between the nav and the Email / Book a Chat buttons (`css/nav.css`,
  already changed on this branch; carry it over).

## All writing page (`/blog/`)

- **White header band** (below the nav) with a muted **← Back** text link (to `/#writing`, landing with the
  Writing heading below the nav), big serif **Writing** and a one-line lede. Below it, topic filter chips
  (white pills, dark when selected, hover ring in the topic's colour, post count on each), then a **3-column card grid** (2 on tablets, 1 on phones).

## Post card (homepage, All writing, More writing)

- Art on top: the post's **cover image** if it has one, otherwise a white card with the topic dot + title.
- Below: `Mon YYYY · Type · N min`, the title, the summary.
- Hover ring takes the **topic colour** (Swift coral, AI teal, Teaching yellow, Career dark, Open source grey),
  and the card's text turns a deeper shade of it (readable on white). List rows on the homepage do the same.

## Post page (`/blog/<slug>/`)

- **Header:** full-width yellow band starting below the nav: muted back link. Opened from the homepage
  (Build log, or the Writing section) it says **← Back** and returns to that exact spot (browser back,
  falling back to `/#proj-<slug>` or `/#writing`); otherwise it says **← All writing**. Then the `Type · Project`
  kicker (`Type · GitHub ↗` when the post has a repo), serif title (lines fill, no balancing), summary, `date · N min read · topic`.
- **Body:** ~840px text column; code, images and tables stay inside it. Styles for everything Markdown makes:
  h2 (serif), h3, lists, links, inline code, dark code blocks (scroll sideways on phones), quotes with a
  yellow bar, images, dividers, full-width tables.
- **Phones:** the nav slides away while scrolling down and comes back on any scroll up (like Medium).
- **Side rail** (desktop only, hidden ≤960px): **Contents** from the post's H2s with an animated tracker
  (yellow line fills as you read each section, dot at its end; read = dark, current = bold), a
  and **Back to top ↑** (scrolls to the very top).
- **End matter:** posts with a repo get a white "The code" card (repo name + View on GitHub); every post
  ends with **More writing** (up to 3 cards, left out when there are no other posts) and **All writing →**.

## Every page

- Blog pages use the homepage nav in its docked state (buttons showing), so the links sit where they do
  on the homepage once you've scrolled.
- Jumps to `#writing` / `#proj-<slug>` land below the fixed nav (`scroll-margin-top`).

## Zero maintenance: what updates itself

Publishing a post in Pages CMS starts the GitHub Action, which rebuilds the homepage Writing section, the
All writing grid and its topic chips, the post page and its contents rail, More writing, featured projects'
Build log buttons, the sitemap and the RSS feed. **Handoff change:** the homepage must become an Eleventy
template (only the Writing section is generated; everything else stays byte-for-byte the same), instead of
copying `index.html` through untouched. Code only changes for a brand-new topic (one line + a colour; it
shows grey until then) or a new featured project (case files stay hand-edited on purpose).

## Few or no posts

- **0 posts:** no homepage Writing section and no Writing nav link; All writing shows a "The first post is
  on its way" card; Back goes to the top of the homepage.
- **1 post:** homepage shows the featured post alone; no topic chips; the post has no More writing.
- **Chips:** only topics that have posts, each with its count; no chip row until there are two topics.

## Pages CMS fields (one Markdown file per post)

| Field | Type | Notes |
|---|---|---|
| `title` | string, required | |
| `description` | text, maxlength ~160 | card summary + meta description |
| `date` | date | |
| `type` | select: Essay, Build log, Notes | |
| `topic` | select: AI, Swift, Teaching, Career, Open source | colour + filter |
| `repo` | string (GitHub URL), optional | GitHub link on the post; a featured project's **Build log** button finds its newest Build log with the same repo |
| `cover` | image, optional | |
| `draft` | boolean, default true | |
| `body` | rich-text, format markdown | |

Reading time is computed at build. Still to confirm in the real editor: which formatting the rich-text
toolbar offers (tables especially).

## Media

Capture rules for screenshots and clips: see `MEDIA.md`.
