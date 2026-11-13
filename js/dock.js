// ============ Hero links ↔ nav ============
// The YouTube / Medium / GitHub / Resume links under the hero title each have a twin in the nav
// (same data-dock key). Once the nav is about to cover the hero row, all four hero links shrink away
// and their twins pop in, left to right; scrolling back up plays the exact mirror.
//
// An IntersectionObserver watches the first hero slot against a root that starts just under the nav,
// so nothing runs on scroll. The motion is CSS (.dock-pop in css/buttons.css); this only flips
// classes. Whichever copy is hidden is made inert, so keyboard and screen-reader users only reach
// the visible one.
export function setupDock() {
    const root = document.documentElement;
    const pill = document.querySelector('.nav-pill');
    const actions = document.querySelector('.nav-actions');
    const firstSlot = document.querySelector('.hero-slot');
    const heroLinks = [...document.querySelectorAll('.hero-btn[data-dock]')];
    if (!pill || !actions || !firstSlot || !heroLinks.length) return;

    const GAP = 70;   // ms between buttons in the cascade
    let docked = null;
    root.classList.add('dock-instant');   // the first state is applied without animation

    function setDocked(on) {
        if (on === docked) return;
        docked = on;
        heroLinks.forEach((hero, i) => {
            const twins = actions.querySelectorAll(`[data-dock="${hero.dataset.dock}"]`);
            for (const el of [hero, ...twins]) el.style.setProperty('--delay', `${i * GAP}ms`);
            hero.classList.toggle('is-out', on);
            hero.inert = on;
            twins.forEach((t) => { t.classList.toggle('is-out', !on); t.inert = !on; });
        });
        // Desktop: the nav's button column opens while docked (css/nav.css animates its width)
        root.classList.toggle('nav-docked', on);
    }

    // The open width of the button column = its natural width with everything laid out
    function measureActions() {
        actions.style.width = 'max-content';
        actions.style.setProperty('--open-w', `${Math.ceil(actions.getBoundingClientRect().width)}px`);
        actions.style.width = '';
    }

    let io;
    function observe() {
        io?.disconnect();
        const line = Math.round(pill.getBoundingClientRect().bottom + 6);
        // Root = from just under the nav to far below the screen: the row docks as soon as any of the
        // first slot pokes above the line. The slot never scales, so its box is always the real one.
        io = new IntersectionObserver(([e]) => {
            setDocked(e.intersectionRatio < 1 && e.boundingClientRect.top < line);
            requestAnimationFrame(() => requestAnimationFrame(() => root.classList.remove('dock-instant')));
        }, { rootMargin: `-${line}px 0px 100000px 0px`, threshold: 1 });
        io.observe(firstSlot);
    }

    measureActions();
    document.fonts?.ready.then(measureActions);
    observe();

    let resizeTimer;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(() => {
            root.classList.add('dock-instant');
            docked = null;
            measureActions();
            observe();
        }, 150);
    });
}
