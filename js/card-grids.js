// ============ Expanding card grids (About pillars, Skills quotes) ============
// The hovered, focused or clicked card widens to 2.2fr; at ≤760px the cards stack instead.

// ---- Pillar cards (About) ----
export function setupPillars() {
    const grid = document.getElementById('pillar-grid');
    if (!grid) return;
    const cards = Array.from(grid.querySelectorAll('.pillar-card'));
    if (!cards.length) return;

    const canAnimate = () => window.innerWidth >= 760;
    let idx = 0;

    const apply = () => {
        cards.forEach((card, j) => card.classList.toggle('is-active', j === idx && canAnimate()));
        grid.style.gridTemplateColumns = canAnimate()
            ? cards.map((_, j) => (j === idx ? '2.2fr' : '1fr')).join(' ')
            : '1fr 1fr 1fr';
    };

    // While a card is hovered the others fade toward the white background;
    // on leave the last hovered card stays expanded and colors come back.
    // Only on devices that can hover: a tap fires mouseenter but no mouseleave, so the dim would stick.
    const canHover = window.matchMedia('(hover: hover)');
    const setHovering = (on) => grid.classList.toggle('is-hovering', on && canAnimate() && canHover.matches);

    cards.forEach((card, i) => {
        card.addEventListener('mouseenter', () => { idx = i; setHovering(true); apply(); });
        card.addEventListener('focus', () => { idx = i; apply(); });
        card.addEventListener('click', () => { idx = i; apply(); });
    });

    grid.addEventListener('mouseleave', () => setHovering(false));
    window.addEventListener('resize', apply);
    apply();
}

// ---- Quote cards (Skills) ----
export function setupQuotes() {
    const grid = document.getElementById('quote-grid');
    if (!grid) return;
    const cards = Array.from(grid.querySelectorAll('.quote-card'));
    if (!cards.length) return;

    const canAnimate = () => window.innerWidth >= 760;
    let idx = 0;

    const apply = () => {
        cards.forEach((card, j) => card.classList.toggle('is-active', j === idx && canAnimate()));
        grid.style.gridTemplateColumns = canAnimate()
            ? cards.map((_, j) => (j === idx ? '2.2fr' : '1fr')).join(' ')
            : '1fr 1fr 1fr';
    };

    cards.forEach((card, i) => {
        card.addEventListener('mouseenter', () => { idx = i; apply(); });
        card.addEventListener('focus', () => { idx = i; apply(); });
        card.addEventListener('click', () => { idx = i; apply(); });
    });

    // No reset on mouseleave: the last hovered card stays expanded until another is hovered.
    window.addEventListener('resize', apply);
    apply();
}
