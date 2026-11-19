// PROTOTYPE, throwaway (branch prototype/projects-section): the All posts page (/blog/ in the real build).
// Card grid with topic filters. Every field shown comes from a post's Pages CMS front matter.
import { POSTS, TOPIC_COLOR, arrow, postCard } from '../js/prototype-projects.js';
const back = arrow.replace('<svg ', '<svg style="transform:rotate(180deg)" ');
import { setupMobileMenu } from '../js/mobile-menu.js?v=20261112a';

setupMobileMenu();
const root = document.getElementById('bp-root');
const topics = [...new Set(POSTS.map((x) => x.topic))];

root.innerHTML = `<div class="bp">
    <a class="text-link bp-back" href="../#writing">${back} Back</a>
    <h1 class="bp-title">Writing</h1>
    <p class="bp-lede">Build logs from my projects, notes from teaching and learning, and the occasional essay.</p>
    <div class="bp-chips" role="group" aria-label="Filter by topic">
      <button class="is-on" type="button" data-t="">All</button>
      ${topics.map((t) => `<button type="button" data-t="${t}"><i style="background:#${TOPIC_COLOR[t]}"></i>${t}</button>`).join('')}
    </div>
    <div class="bp-grid"></div>
  </div>`;
const grid = root.querySelector('.bp-grid');
let topic = '';
const draw = () => {
    grid.innerHTML = POSTS.map((x) => postCard(x, { href: `post.html?post=${x.slug}` })).join('');
    grid.querySelectorAll('.bp-card').forEach((el) => { el.hidden = !!topic && el.dataset.topic !== topic; });
};
draw();

root.querySelectorAll('.bp-chips button').forEach((b) => b.addEventListener('click', () => {
    root.querySelectorAll('.bp-chips button').forEach((x) => x.classList.toggle('is-on', x === b));
    root.querySelectorAll('.bp-card').forEach((el) => { el.hidden = !!b.dataset.t && el.dataset.topic !== b.dataset.t; });
}));
