// ============ Phone menu (≤760px) ============
// #menu-button opens the full-screen #mobile-menu: focus moves to its first link, Tab stays inside
// (button + menu), Esc or picking a link closes it and focus returns to the button, and the page
// behind can't scroll while it's open.
export function setupMobileMenu() {
    const btn = document.getElementById('menu-button');
    const menu = document.getElementById('mobile-menu');
    if (!btn || !menu) return;
    let open = false;

    function setOpen(next) {
        if (open === next) return;
        open = next;
        btn.setAttribute('aria-expanded', String(open));
        menu.classList.toggle('is-open', open);
        menu.inert = !open;
        document.documentElement.style.overflow = open ? 'hidden' : '';
        if (open) requestAnimationFrame(() => menu.querySelector('a').focus({ preventScroll: true }));
        else btn.focus({ preventScroll: true });
    }

    menu.inert = true;
    btn.addEventListener('click', () => setOpen(!open));
    menu.addEventListener('click', (e) => { if (e.target.closest('a')) setOpen(false); });
    document.addEventListener('keydown', (e) => {
        if (!open) return;
        if (e.key === 'Escape') { e.preventDefault(); setOpen(false); return; }
        if (e.key !== 'Tab') return;
        const items = [btn, ...menu.querySelectorAll('a')];
        const first = items[0], last = items[items.length - 1];
        if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
        else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    });
    // Widening past the breakpoint hides the menu, so close it (and release the scroll lock)
    window.matchMedia('(max-width: 760px)').addEventListener('change', (e) => { if (!e.matches) setOpen(false); });
}
