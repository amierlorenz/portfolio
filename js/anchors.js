// ============ Smooth anchor scrolling ============
// Delegated, so the phone menu's links get the same offset as the nav's.
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
        const top = target.offsetTop - 84;
        window.scrollTo({ top, behavior: 'smooth' });
    });
}
