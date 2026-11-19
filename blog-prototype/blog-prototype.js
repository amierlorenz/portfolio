// PROTOTYPE, throwaway (branch prototype/projects-section): the All posts page (/blog/ in the real build).
// Card grid with topic filters. Every field shown comes from a post's Pages CMS front matter.
// ?post=<slug> just says the post page is the next prototype round.
import { POSTS, TOPIC_COLOR, cover, meta, arrow } from '../js/prototype-projects.js';
const back = arrow.replace('<svg ', '<svg style="transform:rotate(180deg)" ');
import { setupMobileMenu } from '../js/mobile-menu.js?v=20261112a';

setupMobileMenu();
const root = document.getElementById('bp-root');
const q = new URLSearchParams(location.search);
const topics = [...new Set(POSTS.map((x) => x.topic))];
const picked = POSTS.find((x) => x.slug === q.get('post'));

root.innerHTML = `<div class="bp">
    <a class="hero-btn hero-btn--sm bp-back" href="../#writing">${back} Writing</a>
    <h1 class="bp-title">Writing</h1>
    <p class="bp-lede">Build logs from my projects, notes from teaching and learning, and the occasional essay.</p>
    <div class="bp-chips" role="group" aria-label="Filter by topic">
      <button class="is-on" type="button" data-t="">All</button>
      ${topics.map((t) => `<button type="button" data-t="${t}"><i style="background:#${TOPIC_COLOR[t]}"></i>${t}</button>`).join('')}
    </div>
    <div class="bp-grid">${POSTS.map((x) => `<a class="bp-card" href="?post=${x.slug}" data-topic="${x.topic}">${cover(x)}
        <span class="wr-meta">${meta(x)} · ${x.mins} min</span>
        <span class="wr-title wr-title--sm">${x.title}</span><span class="wr-dek">${x.description}</span></a>`).join('')}</div>
    ${picked ? `<p class="bp-note">You clicked "${picked.title}". The post page itself is the next prototype round.</p>` : ''}
  </div>`;

root.querySelectorAll('.bp-chips button').forEach((b) => b.addEventListener('click', () => {
    root.querySelectorAll('.bp-chips button').forEach((x) => x.classList.toggle('is-on', x === b));
    root.querySelectorAll('.bp-card').forEach((el) => { el.hidden = !!b.dataset.t && el.dataset.topic !== b.dataset.t; });
}));
