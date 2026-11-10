// ============ Featured projects rail ============
export function setupWorkRail() {
    const rail = document.getElementById('rail-work');
    if (!rail) return;

    const fill = document.getElementById('work-progress-fill');

    const maxScroll = () => Math.max(0, rail.scrollWidth - rail.clientWidth);

    const update = () => {
        const max = maxScroll();
        const pct = max > 0 ? Math.min(1, rail.scrollLeft / max) : 0;
        if (fill) fill.style.width = (10 + pct * 90) + '%';
    };

    rail.addEventListener('scroll', update, { passive: true });
    window.addEventListener('resize', update);
    update();

    // Temporarily disable CSS snap while scrolling, re-enable on idle so it snaps to the nearest card
    let snapTimer = null;
    const disableSnap = () => { rail.style.scrollSnapType = 'none'; clearTimeout(snapTimer); };
    const enableSnap = () => {
        clearTimeout(snapTimer);
        snapTimer = setTimeout(() => { rail.style.scrollSnapType = 'x mandatory'; }, 160);
    };

    // Vertical mouse wheel over the rail scrolls it horizontally
    rail.addEventListener('wheel', (e) => {
        if (Math.abs(e.deltaX) >= Math.abs(e.deltaY)) return; // natural horizontal input
        const max = maxScroll();
        if (max <= 1) return;
        const before = rail.scrollLeft;
        if ((e.deltaY > 0 && before < max) || (e.deltaY < 0 && before > 0)) {
            e.preventDefault();
            disableSnap();
            rail.scrollLeft = Math.max(0, Math.min(max, before + e.deltaY));
            enableSnap();
        }
    }, { passive: false });
}
