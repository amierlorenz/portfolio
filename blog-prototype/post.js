// PROTOTYPE, throwaway (branch prototype/projects-section): one post page (/blog/<slug>/ in the real build).
// Picked: the yellow band header + a side rail with an animated contents tracker.   ?post=<slug>
// The body below is the HTML Eleventy's Markdown renderer makes from a Pages CMS rich-text field
// (saved as Markdown), so every element styled here is one the editor can produce.
// The table only matters if the Pages CMS editor offers tables (not confirmed yet).
import { POSTS, PROJECTS, TOPIC_COLOR, fmtDate, arrow, slug, postCard } from '../js/prototype-projects.js';
import { setupMobileMenu } from '../js/mobile-menu.js?v=20261112a';

setupMobileMenu();
const q = new URLSearchParams(location.search);
const post = POSTS.find((x) => x.slug === q.get('post')) || POSTS[1];
const project = PROJECTS.find((p) => p.name === post.project);
const back = arrow.replace('<svg ', '<svg style="transform:rotate(180deg)" ');
const gh = '<svg width="20" height="20" aria-hidden="true"><use href="#gh-mark"/></svg>';

const BODY = `
<p>Placeholder body. Mieracle Study grades free-text flashcard answers on the device, then hands that grade to
SM-2 to schedule the next review. This post walks through what the model is good at judging, where it isn't,
and the guardrails that keep a wrong grade from wrecking a schedule.</p>
<h2 id="the-problem">The problem</h2>
<p>Spaced repetition only works if the grade is honest. Self-grading is fast but generous; <strong>exact matching</strong>
is strict but brittle. I wanted something in between that never leaves the phone, which ruled out a server call.</p>
<ul>
  <li>Answers are short: a word, a phrase, sometimes a sentence.</li>
  <li>Grades map to SM-2's 0 to 5 scale.</li>
  <li>It has to run offline, inside a study session, in under a second.</li>
</ul>
<h2 id="what-the-model-sees">What the model sees</h2>
<p>The prompt gives the card's front, the expected answer and the student's answer, and asks for a grade with a one-line
reason. The reason matters more than I expected: showing it lets the student <em>disagree</em>, which keeps them in charge.</p>
<pre><code class="language-swift">let session = LanguageModelSession(instructions: graderInstructions)
let result = try await session.respond(
    to: prompt(front: card.front, expected: card.back, answer: answer),
    generating: Grade.self
)
scheduler.review(card, quality: result.content.score)</code></pre>
<blockquote><p>The model doesn't decide when you see a card again. It only suggests how well you knew it.</p></blockquote>
<h3 id="where-it-goes-wrong">Where it goes wrong</h3>
<ol>
  <li>Synonyms in a second language: it's too strict.</li>
  <li>Numbers and dates: it's too lenient, so those skip the model and use <code>exact match</code>.</li>
  <li>Very long answers: it drifts, so answers over 200 characters fall back to self-grading.</li>
</ol>
<p><img src="https://placehold.co/1600x1000/ffffff/222222?text=Screenshot+in+the+post+body" alt="The review screen showing a grade and its one-line reason"></p>
<table>
  <thead><tr><th>Answer type</th><th>Grader</th><th>Agreement with me</th></tr></thead>
  <tbody>
    <tr><td>Single word</td><td>Model</td><td>94%</td></tr>
    <tr><td>Phrase</td><td>Model</td><td>88%</td></tr>
    <tr><td>Number or date</td><td>Exact match</td><td>100%</td></tr>
  </tbody>
</table>
<hr>
<h2 id="what-i-would-change">What I'd change</h2>
<p>Next I want the grade reason to link back to the part of the answer it's about. The code is on
<a href="https://github.com/amierlorenz/mieracle-study">GitHub</a> if you want to read along.</p>`;

const toc = () => [...BODY.matchAll(/<h2 id="([^"]+)">([^<]+)<\/h2>/g)].map(([, id, t]) => `<a href="#${id}">${t}</a>`).join('');
const metaRow = `<span>${fmtDate(post.date)}</span><span>${post.mins} min read</span><span><i style="background:#${TOPIC_COLOR[post.topic]}"></i>${post.topic}</span>`;
const kicker = `<span class="ps-kicker">${post.type}${project ? ` · <a href="../#proj-${slug(project.name)}">${project.name}</a>` : ''}</span>`;

// End matter: a build log points back at its project; every post offers more writing
const projectCard = project ? `
  <aside class="ps-project">
    <span class="ps-kicker">This is a build log for</span>
    <div class="ps-project-row">
      <div><h3>${project.name}</h3><p>${project.blurb}</p></div>
      <div class="ps-project-links">
        <a class="hero-btn hero-btn--resume" href="../#proj-${slug(project.name)}">See the project ${arrow}</a>
        <a class="hero-btn" href="${project.repo}" target="_blank" rel="noopener">${gh}<span>GitHub</span></a>
      </div>
    </div>
  </aside>` : '';
const more = () => {
    const others = POSTS.filter((x) => x.slug !== post.slug).slice(0, 3);
    return `
  <section class="ps-more">
    <div class="wr-head"><h2 class="ps-more-title">More writing</h2><a class="text-link" href="./">All writing ${arrow}</a></div>
    <div class="bp-grid">${others.map((x) => postCard(x, { href: `?post=${x.slug}` })).join('')}</div>
  </section>`;
};
const backBtn = `<a class="text-link ps-back" href="./">${back} All writing</a>`;

const head = () => `${backBtn}${kicker}<h1 class="ps-title">${post.title}</h1>
        <p class="ps-dek">${post.description}</p><div class="ps-meta">${metaRow}</div>`;
// Side rail: contents that highlight the section you're in, plus a way back to the top
const rail = () => `
  <aside class="ps-rail">
    <nav class="ps-toc" aria-label="Contents"><span class="ps-kicker">Contents</span>
      <div class="ps-toc-list"><span class="ps-toc-fill" aria-hidden="true"></span>${toc()}</div></nav>
    ${project ? `<a class="ps-rail-proj" href="../#proj-${slug(project.name)}"><span class="ps-kicker">Build log for</span>${project.name} ${arrow}</a>` : ''}
    <a class="ps-top" href="#">Back to top ↑</a>
  </aside>`;
const page = () => `
  <header class="ps-band ps-band--wide"><div class="ps-band-inner">${head()}</div></header>
  <article class="ps ps--d"><div class="ps-d-grid">${rail()}<div><div class="prose">${BODY}</div>${projectCard}</div></div></article>
  ${more()}`;

// Contents tracker: a yellow line fills down the rail as you read. Each entry owns a stretch of the
// line; inside it, the fill follows how far you are through that section. Read entries go dark,
// the current one goes bold, upcoming ones stay grey.
let onScroll;
function watchSections() {
    if (onScroll) removeEventListener('scroll', onScroll);
    const toc = root.querySelector('.ps-toc-list');
    if (!toc) return;
    const links = [...toc.querySelectorAll('a')];
    const fill = toc.querySelector('.ps-toc-fill');
    const heads = links.map((a) => document.getElementById(a.getAttribute('href').slice(1)));
    const end = root.querySelector('.ps--d .prose');
    let queued = false;
    const update = () => {
        queued = false;
        const line = innerHeight * .3; // the "reading line", 30% down the screen
        const tops = heads.map((h) => h.getBoundingClientRect().top);
        const bottom = end.getBoundingClientRect().bottom;
        let filled = 0;
        links.forEach((a, i) => {
            const start = tops[i], stop = i + 1 < tops.length ? tops[i + 1] : bottom;
            const p = Math.min(1, Math.max(0, (line - start) / (stop - start)));
            const on = p > 0 && p < 1;
            a.classList.toggle('is-on', on);
            a.classList.toggle('is-read', p >= 1);
            if (p > 0) filled = a.offsetTop + a.offsetHeight * p;
        });
        fill.style.height = filled + 'px';
    };
    onScroll = () => { if (!queued) { queued = true; requestAnimationFrame(update); } };
    addEventListener('scroll', onScroll, { passive: true });
    update();
}

const root = document.getElementById('bp-root');
document.title = `${post.title} · Amier Lorenz Davis`;
root.innerHTML = page();
watchSections();
// Back to top: all the way up, not just to the header
root.querySelector('.ps-top').addEventListener('click', (e) => { e.preventDefault(); scrollTo({ top: 0, behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth' }); });
