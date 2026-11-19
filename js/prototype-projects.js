// PROTOTYPE, throwaway. Lives on branch prototype/projects-section only; never merge to main.
// The picks so far, on the real homepage: Featured Projects (case files, click a card to bring it
// forward), a Writing section after it (featured post + list), a "Featured ↗" button on featured
// timeline items, and a Writing link in the nav. The All posts page is blog-prototype/ (card grid).
// Screenshots, clips (simulated by cycling frames) and posts are placeholders.

export const PROJECTS = [
    { name: 'Mieracle Study', kind: 'iPhone + Mac App', status: 'In progress', color: 'ffd55b',
      repo: 'https://github.com/amierlorenz/mieracle-study', stack: ['Swift', 'SwiftUI', 'SM-2', 'On-device AI'],
      blurb: 'Spaced repetition with on-device AI grading and live exam dates from the Canvas LMS API.',
      shots: ['Deck+list', 'Exam+countdown'], clip: ['Flip+card', 'AI+grades+answer', 'Next+review+in+3d'],
      shape: 'phone' },
    { name: 'Not Lang', kind: 'iOS App', status: 'Completed', color: '4cc6ce',
      repo: 'https://github.com/amierlorenz/not-lang', stack: ['Swift', 'Gemini API', 'Supabase', 'SwiftData'],
      blurb: 'Learn French slang in context with a content pipeline built on Gemini, Supabase and SwiftData.',
      shots: ['Word+detail', 'Quiz'], clip: ['Scroll+feed', 'Tap+a+word', 'Hear+it+used'],
      shape: 'phone' },
    { name: 'Galea Digital', kind: 'AI Fitness Platform · Team', status: 'Completed', color: 'ff7e59',
      repo: 'https://github.com/CodePath-Tech-Exchange-CTEx/ise-genai-galea-digital', stack: ['Python', 'Gemini API', 'Streamlit', 'pytest + CI'],
      blurb: 'Gemini-powered fitness app; set up CI/CD gated on pytest and shipped fixes from usability tests.',
      shots: ['Workout+plan', 'CI+run'], clip: ['Ask+for+a+plan', 'Gemini+writes+it', 'Log+a+set'],
      shape: 'window', post: null },
];

// Each post is what one Pages CMS entry would hold: front matter fields (title, description, date,
// type, topic, repo, cover, draft) plus a Markdown body. Reading time (mins) is computed at build.
//   type:    select  [Essay, Build log, Notes]
//   topic:   select  [AI, Swift, Teaching, Career, Open source]
//   repo:    string (GitHub URL), optional. Shows a GitHub link on the post. A featured project's
//            "Build log" button finds its newest Build log post by matching this URL, so nothing
//            on the homepage is ever edited by hand.
//   cover:   image, optional; without one the card is a white typographic card
const ALL_POSTS = [
    { slug: 'skills-for-healthy-ai-use', title: 'Writing Claude Code skills that keep me learning', date: '2026-11-04', type: 'Essay', topic: 'AI', repo: 'https://github.com/amierlorenz/claude-skills', cover: null, mins: 7,
      description: 'Guardrails for using AI on code you still want to understand.' },
    { slug: 'grading-flashcards-on-device', title: 'Grading flashcards with an on-device model', date: '2026-10-21', type: 'Build log', topic: 'Swift', repo: 'https://github.com/amierlorenz/mieracle-study', mins: 5,
      cover: 'https://placehold.co/1200x900/ffffff/222222?text=cover+image+(optional)',
      description: 'What Foundation Models can and can\'t judge, and how SM-2 takes the grade from there.' },
    { slug: 'teaching-swift', title: 'What teaching Swift to kids taught me about Swift', date: '2026-10-09', type: 'Notes', topic: 'Teaching', repo: null, cover: null, mins: 4,
      description: 'Optionals are easier to explain with lunchboxes.' },
    { slug: 'medium', title: 'My Medium post (moving here)', date: '2026-03-12', type: 'Essay', topic: 'Career', repo: null, cover: null, mins: 6,
      description: 'The one post on blog.amierlorenz.com today, re-homed with a canonical link.' },
    { slug: 'a-content-pipeline-for-slang', title: 'A content pipeline for slang that ages fast', date: '2026-02-17', type: 'Build log', topic: 'AI', repo: 'https://github.com/amierlorenz/not-lang', cover: null, mins: 4,
      description: 'Gemini drafts, Supabase stores, SwiftData caches. Why each piece is there.' },
    { slug: 'first-pr', title: 'My first open source PR, start to merge', date: '2025-12-02', type: 'Notes', topic: 'Open source', repo: null, cover: null, mins: 5,
      description: 'Reading CONTRIBUTING.md first saved me a week.' },
];
// Prototype only: ?posts=0|1|2|all simulates how many posts exist (remembered for this tab), to check the
// empty and nearly-empty states. The real site just uses whatever Pages CMS has published.
export const POST_COUNTS = { 0: { name: 'No posts yet' }, 1: { name: '1 post' }, 2: { name: '2 posts' }, all: { name: 'All 6 posts' } };
export const postCount = (() => {
    let k = new URLSearchParams(location.search).get('posts');
    try { if (!POST_COUNTS[k]) k = sessionStorage.getItem('proto-posts'); } catch {}
    return POST_COUNTS[k] ? k : 'all';
})();
export const POSTS = postCount === 'all' ? ALL_POSTS : ALL_POSTS.slice(0, Number(postCount));

export const TOPIC_COLOR = { AI: '4cc6ce', Swift: 'ff7e59', Teaching: 'ffd55b', Career: '222222', 'Open source': 'BBBBBB' };

export const slug = (s) => s.toLowerCase().replace(/[^a-z0-9]+/g, '-');
const shotImg = (label, w, h) => `https://placehold.co/${w}x${h}/ffffff/222222?text=${label}`;
const gh = '<svg width="20" height="20" aria-hidden="true"><use href="#gh-mark"/></svg>';
export const arrow = '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M4 12h15M13 6l6 6-6 6"/></svg>';
const diag = '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M7 17 17 7M9 7h8v8"/></svg>';
// Newest Build log whose repo matches the project's (POSTS is newest first)
const postFor = (p) => POSTS.find((x) => x.type === 'Build log' && x.repo === p.repo);
export const fmtDate = (d) => new Date(d + 'T12:00').toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
export const meta = (x) => `${fmtDate(x.date)} · ${x.type}`;

// Card art: the cover image when the post has one, otherwise a white typographic card
export const cover = (x, big) => x.cover
    ? `<div class="wr-cover wr-cover--img ${big ? 'is-big' : ''}"><img src="${x.cover}" alt=""></div>`
    : `<div class="wr-cover ${big ? 'is-big' : ''}">
        <span class="wr-cover-topic"><i style="background:#${TOPIC_COLOR[x.topic]}"></i>${x.topic}</span><span class="wr-cover-title">${x.title}</span></div>`;

// ---------- Post card (picked: title on the art, then meta, title and summary below) ----------
// The art stands in for a real cover image; a post with `cover` set shows that image instead.
// The hover ring takes the topic's colour (--tc).
// Hover text: a deeper shade of each topic colour so it stays readable on white and grey
export const TOPIC_TEXT = { AI: '#1f98a1', Swift: '#e0603a', Teaching: '#b98900', Career: '#222222', 'Open source': '#7a7a7a' };
export const ringColor = (topic) => hexA(TOPIC_COLOR[topic], .35);
const hexA = (hex, a) => `rgba(${[0, 2, 4].map((i) => parseInt(hex.slice(i, i + 2), 16)).join(',')},${a})`;
export function postCard(x, { href, big = false, mins = true, cls = 'bp-card' } = {}) {
    return `<a class="${cls}" href="${href}" data-topic="${x.topic}" style="--tc:${hexA(TOPIC_COLOR[x.topic], .35)};--tt:${TOPIC_TEXT[x.topic]}">${cover(x, big)}
      <span class="wr-meta">${meta(x)}${mins ? ` · ${x.mins} min` : ''}</span>
      <span class="wr-title ${big ? '' : 'wr-title--sm'}">${x.title}</span>
      <span class="wr-dek">${x.description}</span></a>`;
}

// ---- Prototype switcher (not part of the design): Posts count; changing it reloads the page ----
export function postCountBar() {
    const bar = document.createElement('div');
    bar.className = 'proto-bar proto-bar--solo';
    bar.innerHTML = '<button aria-label="Fewer posts">←</button><span></span><button aria-label="More posts">→</button>';
    document.body.append(bar);
    const keys = Object.keys(POST_COUNTS);
    bar.children[1].textContent = `Posts · ${POST_COUNTS[postCount].name}`;
    const step = (d) => {
        const k = keys[(keys.indexOf(postCount) + d + keys.length) % keys.length];
        try { sessionStorage.setItem('proto-posts', k); } catch {}
        const url = new URL(location.href); url.searchParams.set('posts', k); location.replace(url);
    };
    bar.children[0].onclick = () => step(-1);
    bar.children[2].onclick = () => step(1);
    addEventListener('keydown', (e) => {
        if (e.target.closest('input, textarea, [contenteditable]')) return;
        if (e.key === 'ArrowLeft') step(-1);
        if (e.key === 'ArrowRight') step(1);
    });
}

// A fake clip: frames that cycle. In the real build this is <video autoplay muted loop playsinline> (see MEDIA.md).
const clip = (p, w, h) => `
    <div class="gif">
      ${p.clip.map((f, i) => `<img class="${i ? '' : 'is-on'}" src="${shotImg(`${i + 1}/${p.clip.length}+·+${f}`, w, h)}" alt="${i ? '' : p.name + ' in motion'}">`).join('')}
      <span class="gif-badge">GIF</span>
    </div>`;

// ---------- Featured Projects ----------
// Three cards per project. Clicking a back card swaps it with the front one.
function projects() {
    const file = (p, i) => {
        const post = postFor(p);
        const [w, h] = p.shape === 'phone' ? [720, 1280] : [1280, 800];
        const cards = [
            { role: 'front', label: 'clip', html: clip(p, w, h) },
            { role: 'left', label: p.shots[0].replace(/\+/g, ' '), html: `<img src="${shotImg(p.shots[0], w, h)}" alt="${p.name}: ${p.shots[0].replace(/\+/g, ' ')}">` },
            { role: 'right', label: p.shots[1].replace(/\+/g, ' '), html: `<img src="${shotImg(p.shots[1], w, h)}" alt="${p.name}: ${p.shots[1].replace(/\+/g, ' ')}">` },
        ];
        return `
        <article class="pD-file ${i % 2 ? 'is-flip' : ''}" id="proj-${slug(p.name)}">
          <div class="pD-collage pD-collage--${p.shape}">
            ${cards.map((c) => `<button class="pD-card" type="button" data-role="${c.role}" aria-label="Bring ${c.label} to the front">${c.html}</button>`).join('')}
          </div>
          <div class="pD-text">
            <div class="pD-kicker"><span class="pD-dot" style="background:#${p.color}"></span>${p.kind} · ${p.status}</div>
            <h3 class="pD-name">${p.name}</h3>
            <p class="pD-blurb">${p.blurb}</p>
            <div class="work-tags">${p.stack.map((t) => `<span>${t}</span>`).join('')}</div>
            <div class="pD-links">
              ${post ? `<a class="hero-btn hero-btn--resume" href="blog-prototype/post.html?post=${post.slug}&from=proj-${slug(p.name)}">Build log ${arrow}</a>` : ''}
              <a class="hero-btn" href="${p.repo}" target="_blank" rel="noopener">${gh}<span>GitHub</span></a>
            </div>
          </div>
        </article>`;
    };
    return `
      <div class="pD">
        <div class="work-header"><h2 class="section-title">Featured Projects</h2></div>
        ${PROJECTS.map(file).join('')}
      </div>`;
}
function wireProjects(root) {
    // Discovery: each project's cards start stacked behind the front card and deal out to their
    // places as the project scrolls into view; the text rises in just after. Same motion for every project.
    const intro = new IntersectionObserver((es) => es.forEach((e) => {
        if (!e.isIntersecting) return;
        e.target.classList.add('is-in');
        intro.unobserve(e.target);
        setTimeout(() => e.target.classList.add('is-settled'), 1400); // drop the stagger delays so clicks feel instant
    }), { threshold: .35 });
    root.querySelectorAll('.pD-file').forEach((f) => intro.observe(f));

    root.querySelectorAll('.pD-collage').forEach((col) => col.addEventListener('click', (e) => {
        const card = e.target.closest('.pD-card');
        if (!card || card.dataset.role === 'front') return;
        const front = col.querySelector('[data-role="front"]');
        front.dataset.role = card.dataset.role;
        card.dataset.role = 'front';
    }));
    // Touch screens can't hover, so the back cards spread apart once as each project scrolls into view
    if (!matchMedia('(hover: none)').matches) return;
    const io = new IntersectionObserver((es) => es.forEach((e) => { if (e.isIntersecting) { e.target.classList.add('is-fanned'); io.unobserve(e.target); } }), { threshold: .5 });
    root.querySelectorAll('.pD-collage').forEach((c) => io.observe(c));
}

// ---------- Writing (featured post + list) ----------
const href = (x) => `blog-prototype/post.html?post=${x.slug}&from=writing`;
function writing() {
    // 1 post: the featured post on its own; 2+: featured + up to four more in the list
    const [lead, ...rest] = POSTS;
    return `
  <div class="wr">
    <div class="wr-head"><h2 class="section-title">Writing</h2><a class="text-link" href="blog-prototype/">All writing ${arrow}</a></div>
    <div class="w2 ${rest.length ? '' : 'w2--solo'}">
      ${postCard(lead, { href: href(lead), big: true, cls: 'w2-lead' })}
      ${rest.length ? `<div class="w2-list">${rest.slice(0, 4).map((x) => `<a class="w2-row" href="${href(x)}" style="--tt:${TOPIC_TEXT[x.topic]}">
          <span class="wr-title wr-title--sm">${x.title}</span><span class="wr-meta">${meta(x)}</span></a>`).join('')}</div>` : ''}
    </div>
  </div>`;
}

// ---------- Timeline: "Featured ↗" on featured items ----------
// The timeline rebuilds its items on every filter change, so a MutationObserver re-adds the buttons.
// The button's click stops there; the card's own click (pin + branch graph) works everywhere else.
function decorateTimeline(scroller) {
    PROJECTS.forEach((p) => {
        const it = scroller.querySelector(`.tl-it[data-key="${p.name}"]`);
        if (!it || it.querySelector('.tlm')) return;
        it.insertAdjacentHTML('beforeend', `<a class="hero-btn hero-btn--sm tlm" href="#proj-${slug(p.name)}">Featured ${diag}</a>`);
        it.querySelector('.tlm').addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation(); // don't pin the card
            document.getElementById(`proj-${slug(p.name)}`).scrollIntoView({ behavior: 'smooth' });
        });
    });
}

// ---------- Clip frames + nav link ----------
export function wireGifs() {
    setInterval(() => document.querySelectorAll('.gif').forEach((g) => {
        const imgs = [...g.querySelectorAll('img')];
        const i = imgs.findIndex((x) => x.classList.contains('is-on'));
        imgs[i]?.classList.remove('is-on');
        imgs[(i + 1) % imgs.length].classList.add('is-on');
    }), 1100);
}
function addNavLink() {
    document.querySelector('.nav-links a[href="#projects"]')?.insertAdjacentHTML('afterend', '<a href="#writing" class="nav-link">Writing</a>');
    document.querySelector('.mobile-menu-list a[href="#projects"]')?.parentElement.insertAdjacentHTML('afterend', '<li><a href="#writing" style="--i:3">Writing</a></li>');
}

export function setupPrototypeProjects() {
    if (location.hostname === 'amierlorenz.com') return; // never on the live site
    const section = document.getElementById('projects');
    if (!section) return;
    section.innerHTML = projects();
    section.classList.add('is-proto');
    wireProjects(section);

    // No posts yet: no Writing section and no Writing nav link (they appear with the first post)
    if (POSTS.length) {
        const w = document.createElement('section');
        w.id = 'writing';
        w.className = 'writing';
        w.innerHTML = writing();
        section.after(w);
    }
    postCountBar();

    const scroller = document.querySelector('.tl-scroller');
    if (scroller) {
        let queued = false;
        new MutationObserver(() => {
            if (queued) return;
            queued = true;
            requestAnimationFrame(() => { queued = false; decorateTimeline(scroller); });
        }).observe(scroller, { childList: true, subtree: true });
        decorateTimeline(scroller);
    }
    if (POSTS.length) addNavLink();
    wireGifs();
    // These sections didn't exist when the browser handled the URL's #hash, so jump again
    if (location.hash) document.getElementById(location.hash.slice(1))?.scrollIntoView();
}
