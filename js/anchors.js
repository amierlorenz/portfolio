// ============ Smooth anchor scrolling ============
// Delegated, so the phone menu's links get the same offset and About fit-scroll as the nav's.
// The menu closes itself (and unlocks scrolling) in its own click listener on the menu element,
// which runs before this one on `document` (bubbling order), whichever is registered first.
export function setupAnchors() {
    document.addEventListener('click', (e) => {
        const anchor = e.target.closest('a[href^="#"]');
        if (!anchor) return;
        const href = anchor.getAttribute('href');
        if (!href || href.length < 2) return;
        const target = document.querySelector(href);
        if (!target) return;
        e.preventDefault();
        let top = target.offsetTop - 84;
        // About: scroll just far enough that the cards are fully on screen, keeping as much of the intro band as possible.
        // Only when the cards can fit under the nav at all: stacked on phones they're taller than the screen,
        // so there it stops on the intro band ("Hi, I'm Amier") instead of running down to the last card.
        const grid = target.id === 'about' && document.getElementById('pillar-grid');
        if (grid) {
            const r = grid.getBoundingClientRect();
            if (r.height + 84 + 24 <= window.innerHeight) top = Math.max(top, r.bottom + window.scrollY - window.innerHeight + 24);
        }
        window.scrollTo({ top, behavior: 'smooth' });
    });
}
