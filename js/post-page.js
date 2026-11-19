// ============ Post page ============
// Back link, contents tracker, Back to top, and the phone nav that gets out of the way while reading.
export function setupPostPage() {
    if (!document.querySelector('.post-layout')) return;
    setupBack();
    setupContents();
    setupBackToTop();
    setupNavAway();
}

// Opened from the homepage (Writing section or a project's Build log), links carry ?from=<section id>.
// Then "All writing" becomes "Back": it returns to that exact spot with the browser's own back
// (keeps the scroll position), or links to /#<section> when there's no homepage to go back to.
function setupBack() {
    const params = new URLSearchParams(location.search);
    const from = params.get('from');
    if (!from) return;
    // Clean address bar, so a copied link is the plain post URL (same as the canonical)
    history.replaceState(history.state, '', location.pathname + location.hash);
    if (!/^(writing|proj-[a-z0-9-]+)$/.test(from)) return;
    const back = document.querySelector('[data-back]');
    if (!back) return;
    back.href = `/#${from}`;
    back.querySelector('span').textContent = 'Back';
    back.addEventListener('click', (e) => {
        let ref;
        try { ref = new URL(document.referrer); } catch { return; }
        if (ref.origin === location.origin && ref.pathname === '/') { e.preventDefault(); history.back(); }
    });
}

// Contents rail: a yellow line fills down the list as you read. Each entry owns a stretch of the line;
// inside it the fill follows how far you are through that section. Read entries go dark, the current
// one bold, upcoming ones stay grey.
function setupContents() {
    const list = document.querySelector('.toc-list');
    if (!list) return;
    const links = [...list.querySelectorAll('a')];
    const fill = list.querySelector('.toc-fill');
    const heads = links.map((a) => document.getElementById(decodeURIComponent(a.hash.slice(1))));
    const end = document.querySelector('.post-main .prose');
    if (heads.some((h) => !h) || !end) return;

    let queued = false;
    const update = () => {
        queued = false;
        const line = innerHeight * .3; // the "reading line", 30% down the screen
        const tops = heads.map((h) => h.getBoundingClientRect().top);
        const bottom = end.getBoundingClientRect().bottom;
        let filled = 0;
        links.forEach((a, i) => {
            const start = tops[i];
            const stop = i + 1 < tops.length ? tops[i + 1] : bottom;
            const p = Math.min(1, Math.max(0, (line - start) / (stop - start)));
            a.classList.toggle('is-on', p > 0 && p < 1);
            a.classList.toggle('is-read', p >= 1);
            if (p > 0) filled = a.offsetTop + a.offsetHeight * p;
        });
        fill.style.height = `${filled}px`;
    };
    const queue = () => { if (!queued) { queued = true; requestAnimationFrame(update); } };
    addEventListener('scroll', queue, { passive: true });
    addEventListener('resize', queue);
    update();
}

// All the way to the top of the page, not just to the header
function setupBackToTop() {
    document.querySelector('[data-top]')?.addEventListener('click', (e) => {
        e.preventDefault();
        const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
        scrollTo({ top: 0, behavior: reduce ? 'auto' : 'smooth' });
    });
}

// Phones: the nav slides up while you scroll down and comes back the moment you scroll up (like Medium)
function setupNavAway() {
    const header = document.querySelector('.site-header');
    if (!header) return;
    const phone = matchMedia('(max-width: 760px)');
    let lastY = scrollY;
    addEventListener('scroll', () => {
        const y = scrollY;
        const menuOpen = document.getElementById('mobile-menu')?.classList.contains('is-open');
        if (!phone.matches || menuOpen || y < 120) header.classList.remove('nav-away');
        else if (Math.abs(y - lastY) > 6) header.classList.toggle('nav-away', y > lastY);
        lastY = y;
    }, { passive: true });
}
