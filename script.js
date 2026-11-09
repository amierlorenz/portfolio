// ============ Smooth anchor scrolling ============
document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener('click', (e) => {
        const href = anchor.getAttribute('href');
        if (!href || href.length < 2) return;
        const target = document.querySelector(href);
        if (!target) return;
        e.preventDefault();
        let top = target.offsetTop - 84;
        // About: scroll just far enough that the cards are fully on screen, keeping as much of the intro band as possible
        const fit = target.id === 'about' && document.getElementById('pillar-grid');
        if (fit) top = Math.max(top, fit.getBoundingClientRect().bottom + window.scrollY - window.innerHeight + 24);
        window.scrollTo({ top, behavior: 'smooth' });
    });
});

// ============ Reveal animations ============
function setupReveal() {
    const els = Array.from(document.querySelectorAll('[data-reveal]')).filter((el) => {
        // Elements already fully visible in the first viewport shouldn't be hidden
        const rect = el.getBoundingClientRect();
        return rect.top > window.innerHeight * 0.9;
    });
    if (!els.length) return;

    els.forEach((el) => el.classList.add('reveal-hidden'));

    const io = new IntersectionObserver((entries) => {
        entries.filter((entry) => entry.isIntersecting).forEach((entry, i) => {
            io.unobserve(entry.target);
            setTimeout(() => entry.target.classList.add('reveal-shown'), i * 110);
        });
    }, { rootMargin: '0px 0px -4% 0px' });

    els.forEach((el) => io.observe(el));
}

// ============ Pillar cards (About) ============
function setupPillars() {
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
    const setHovering = (on) => grid.classList.toggle('is-hovering', on && canAnimate());

    cards.forEach((card, i) => {
        card.addEventListener('mouseenter', () => { idx = i; setHovering(true); apply(); });
        card.addEventListener('focus', () => { idx = i; apply(); });
        card.addEventListener('click', () => { idx = i; apply(); });
    });

    grid.addEventListener('mouseleave', () => setHovering(false));
    window.addEventListener('resize', apply);
    apply();
}

// ============ Quote cards (Skills) ============
function setupQuotes() {
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

// ============ Copy-email pill ============
function setupEmailPill() {
    const pill = document.getElementById('email-button');
    if (!pill) return;

    const EMAIL = pill.dataset.email || 'amierLdavis@gmail.com';
    let copiedTimer = null;

    const showCopied = () => {
        pill.classList.add('copied');
        clearTimeout(copiedTimer);
        copiedTimer = setTimeout(() => pill.classList.remove('copied'), 1800);
    };

    const copyEmail = async () => {
        try {
            await navigator.clipboard.writeText(EMAIL);
        } catch (err) {
            // Fallback where the Clipboard API is unavailable (e.g. file://)
            const ta = document.createElement('textarea');
            ta.value = EMAIL;
            ta.setAttribute('readonly', '');
            ta.style.position = 'fixed';
            ta.style.opacity = '0';
            document.body.appendChild(ta);
            ta.select();
            try { document.execCommand('copy'); } catch (e) { /* give up silently */ }
            document.body.removeChild(ta);
        }
        showCopied();
    };

    // Clicking anywhere in the pill copies the email
    pill.addEventListener('click', copyEmail);
}

// ============ Featured projects rail ============
function setupWorkRail() {
    const rail = document.getElementById('rail-work');
    if (!rail) return;

    const cards = Array.from(rail.querySelectorAll('.work-card'));
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

// ============ Hero floating-illustration followers ============
// The .fl elements drift toward the cursor and grow when it comes close,
// then spring back when the cursor leaves the hero.
function setupHeroFloat() {
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

// ============ Init ============
document.addEventListener('DOMContentLoaded', () => {
    setupReveal();
    setupPillars();
    setupQuotes();
    setupEmailPill();
    setupWorkRail();
    setupHeroFloat();
});
