// ============ Hero floating-illustration followers ============
// The .fl elements drift toward the cursor and grow when it comes close,
// then spring back when the cursor leaves the hero.
export function setupHeroFloat() {
    if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) return;
    const hero = document.getElementById('top');
    if (!hero) return;

    const els = Array.from(hero.querySelectorAll('.fl'));
    if (!els.length) return;

    hero.addEventListener('mousemove', (e) => {
        els.forEach((el) => {
            // Enable the easing transition once
            if (!el.dataset.fl) {
                el.dataset.fl = '1';
                el.style.transition = 'translate .9s cubic-bezier(.22,.8,.2,1), scale .9s cubic-bezier(.22,.8,.2,1)';
            }
            const rect = el.getBoundingClientRect();
            const cx = rect.left + rect.width / 2;
            const cy = rect.top + rect.height / 2;
            const dx = e.clientX - cx;
            const dy = e.clientY - cy;
            const d = Math.hypot(dx, dy);
            const R = Math.max(220, rect.width * 2.2);
            const k = Math.max(0, 1 - d / R);
            el.style.translate = (dx * 0.06 * k) + 'px ' + (dy * 0.06 * k) + 'px';
            el.style.scale = String(1 + 0.1 * k);
        });
    });

    hero.addEventListener('mouseleave', () => {
        els.forEach((el) => {
            el.style.translate = '0px 0px';
            el.style.scale = '1';
        });
    });
}
