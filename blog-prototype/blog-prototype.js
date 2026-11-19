// PROTOTYPE, throwaway (branch prototype/projects-section): the All writing page (/blog/ in the real build).
// Card grid with topic filters. Everything shown comes from posts' Pages CMS front matter, so it updates itself.
// Empty states: no posts = a short "first post is on its way" note; chips only for topics that have posts,
// and no chip row at all until there are at least two topics to choose between.
import { POSTS, TOPIC_COLOR, arrow, postCard, ringColor, postCountBar } from '../js/prototype-projects.js';
import { setupMobileMenu } from '../js/mobile-menu.js?v=20261112a';

setupMobileMenu();
const back = arrow.replace('<svg ', '<svg style="transform:rotate(180deg)" ');
const root = document.getElementById('bp-root');
const topics = [...new Set(POSTS.map((x) => x.topic))];
const count = (t) => POSTS.filter((x) => x.topic === t).length;

const chips = topics.length < 2 ? '' : `
    <div class="bp-chips" role="group" aria-label="Filter by topic">
      <button class="is-on" type="button" data-t="">All <span class="bp-n">${POSTS.length}</span></button>
      ${topics.map((t) => `<button type="button" data-t="${t}" style="--tc:${ringColor(t)}"><i style="background:#${TOPIC_COLOR[t]}"></i>${t} <span class="bp-n">${count(t)}</span></button>`).join('')}
    </div>`;
const body = POSTS.length
    ? `${chips}<div class="bp-grid ${topics.length < 2 ? 'bp-grid--nochips' : ''}">${POSTS.map((x) => postCard(x, { href: `post.html?post=${x.slug}` })).join('')}</div>`
    : `<div class="bp-empty"><span class="wr-cover-topic"><i style="background:#ffd55b"></i>Coming soon</span>
         <p class="wr-title">The first post is on its way.</p>
         <p class="wr-dek">Build logs from my projects, notes from teaching and learning, and the occasional essay will live here.</p></div>`;

root.innerHTML = `
  <header class="bp-band"><div class="bp-band-inner">
    <a class="text-link bp-back" href="../${POSTS.length ? '#writing' : ''}">${back} Back</a>
    <h1 class="bp-title">Writing</h1>
    <p class="bp-lede">Build logs from my projects, notes from teaching and learning, and the occasional essay.</p>
  </div></header>
  <div class="bp">${body}</div>`;

root.querySelectorAll('.bp-chips button').forEach((b) => b.addEventListener('click', () => {
    root.querySelectorAll('.bp-chips button').forEach((x) => x.classList.toggle('is-on', x === b));
    root.querySelectorAll('.bp-card').forEach((el) => { el.hidden = !!b.dataset.t && el.dataset.topic !== b.dataset.t; });
}));
postCountBar();
