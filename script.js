// ============ Smooth anchor scrolling ============
// Delegated, so the phone menu's links get the same offset and About fit-scroll as the nav's.
// The menu closes itself (and unlocks scrolling) in its own click listener, which runs before this one.
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

// ============ Phone menu (≤760px) ============
// #menu-button opens the full-screen #mobile-menu: focus moves to its first link, Tab stays inside
// (button + menu), Esc or picking a link closes it and focus returns to the button, and the page
// behind can't scroll while it's open.
function setupMobileMenu() {
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

// ============ Timeline ("What I've done") ============
// Title reads "What I've <type> <year>". Both words are slot-machine reels: the type word rolls
// once when the section first comes into view and lands on "done"; clicking it steps
// built → learned → taught → (Where I've) worked → done, and clicking the grey year steps
// so far → in 2026 → … → so far. Each step filters the timeline, with items sliding into place.
// Sources: resume (AmierDavis_Resume_103026.pdf) and public GitHub repos (repo-only items use the
// repo's creation month). tbd:true = month unknown; shown as the year only.
function setupTimeline() {
    const section = document.getElementById('timeline');
    if (!section) return;
    const title = section.querySelector('.tl-title');
    const scroller = section.querySelector('.tl-scroller');

    const ITEMS = [
        { start: '2024-08', end: 'now', type: 'learning', title: 'Hampton University', org: 'B.S. Computer Science (AI/ML)', text: "Class of '28 · 3.9 GPA · Dean's List · full-ride scholarship." },
        { start: '2025-05', end: '2025-08', type: 'work', title: 'Google', org: 'Associate Software Developer Intern', text: 'Two AI-powered user journeys for Android XR glasses photography, in Kotlin/Compose and Java.' },
        { start: '2025-10', end: '2026-05', type: 'learning', title: 'Amazon Guides', org: 'Mentee', text: 'Career mentorship program.' },
        { start: '2025-11', type: 'learning', title: '100 Days of SwiftUI', org: 'Hacking with Swift', text: "Working through Paul Hudson's SwiftUI course." },
        { start: '2026-01', end: '2026-04', type: 'learning', title: 'CodePath Tech Exchange', org: 'Selective program', text: 'DSA and system design with GenAI, intro to software engineering with GenAI.' },
        { start: '2026-01', end: '2026-04', type: 'project', title: 'Galea Digital', org: 'AI fitness platform · team', text: 'Gemini-powered fitness app; set up CI/CD gated on pytest and shipped fixes from usability tests.' },
        { start: '2026-01', type: 'project', title: 'Not Lang', org: 'iOS app', text: 'AI language lessons with Gemini, Supabase and SwiftData.' },
        { start: '2026-01', type: 'project', title: 'Hackathon, 1st place', org: 'ADMI AI Conference', text: 'First place at the ADMI AI Conference 2026 hackathon.', tbd: true },
        { start: '2026-02', end: 'now', type: 'project', title: 'Archive Buddy', org: 'iOS app', text: 'On-device handwriting OCR and RAG over your paper journals.' },
        { start: '2026-09', end: 'now', type: 'work', title: 'Google REACH: SafeGenAI', org: 'Research Assistant', text: 'GenAI security research and teaching non-technical audiences to use AI safely.' },
        { start: '2026-09', end: 'now', type: 'learning', title: 'CodePath AI301', org: 'Open source with AI', text: 'Building Claude Code skills for a real open-source contribution.' },
        { start: '2026-09', end: 'now', type: 'project', title: 'Mieracle Study', org: 'iPhone + Mac app', text: 'Spaced repetition with on-device AI grading and Canvas exam dates.' },
        { start: '2026-10', end: 'now', type: 'teaching', title: 'HU Swift Academy', org: 'Swift Outreach Scholar', text: 'Teaching Swift to K-12 students, teachers and community groups.' },
        { start: '2026-10', end: 'now', type: 'project', title: 'Claude Code plugins & skills', org: 'Open source', text: 'A plugin marketplace incl. own-it, git-workflow and training-wheels.' },
        { start: '2026-10', type: 'project', title: 'Master To-Do', org: 'iPhone + Mac app', text: 'Your tasks and open Canvas assignments in one iCloud list.' },
    ];
    const TYPES = {
        project: { color: '#ffd55b', verb: 'built' },
        learning: { color: '#4cc6ce', verb: 'learned' },
        teaching: { color: '#a28ff0', verb: 'taught' },
        work: { color: '#ff7e59', verb: 'worked', lead: 'Where' }, // paid roles only
    };
    const STEP = ['project', 'learning', 'teaching', 'work']; // click order; matches the hero
    const NOW_YEAR = 2026;
    const GREY = '#b4b4b4';
    const EASE = 'cubic-bezier(.22,.8,.2,1)';
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const MON = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const fmt = (ym) => (ym === 'now' ? 'now' : `${MON[+ym.slice(5) - 1]} ${ym.slice(0, 4)}`);
    // tbd: month unknown, so show just the year (the month only places it within the year)
    const when = (it) => (it.tbd ? it.start.slice(0, 4) : it.end ? `${fmt(it.start)} → ${fmt(it.end)}` : fmt(it.start));
    const monthIdx = (ym) => (+ym.slice(0, 4)) * 12 + (+ym.slice(5)) - 1;
    const startYear = (it) => +it.start.slice(0, 4);
    const endYear = (it) => (it.end ? (it.end === 'now' ? NOW_YEAR : +it.end.slice(0, 4)) : startYear(it));
    const inYear = (it, y) => !y || (startYear(it) <= y && endYear(it) >= y); // ongoing items count every year they ran
    const YEARS = [...new Set(ITEMS.flatMap((it) => Array.from({ length: endYear(it) - startYear(it) + 1 }, (_, i) => startYear(it) + i)))].sort((a, b) => b - a);

    let type = null;   // null = everything
    let year = null;   // null = all years
    let introDone = false;
    let rollingType = false, rollingYear = false;

    const hasItems = (t, y) => ITEMS.some((it) => (!t || it.type === t) && inYear(it, y));
    const visible = () => ITEMS.filter((it) => (!type || it.type === type) && inYear(it, year)).sort((a, b) => monthIdx(a.start) - monthIdx(b.start));
    const verbOf = (t) => (t ? TYPES[t].verb : 'done');
    const leadOf = (t) => (t && TYPES[t].lead) || 'What';
    const yearPhrase = (y) => (y ? `in ${y}` : 'so far');
    const colorOf = (w) => {
        if (w === 'so far' || /^in \d{4}$/.test(w)) return GREY;
        const t = STEP.find((k) => TYPES[k].verb === w);
        return t ? TYPES[t].color : '#222';
    };

    // ---- title ----
    const staticSlot = (w, underline) => `<span class="tl-slot"><span class="tl-reel"><span class="tl-sw" style="color:${colorOf(w)}">${w}${underline ? `<span class="tl-ul" style="background:${colorOf(w)}"></span>` : ''}</span></span></span>`;
    const reelSlot = (words) => `<span class="tl-slot"><span class="tl-reel">${words.map((w) => `<span class="tl-sw" style="color:${colorOf(w)}">${w}</span>`).join('')}</span></span>`;
    const INTRO = ['built', 'learned', 'taught', 'built', 'learned', 'taught', 'built', 'learned', 'taught', 'done'];

    // Until the intro has run, the verb is the reel and the year phrase waits out of the layout
    // (it's revealed once the reel lands, so it never has to hop lines while the reel resizes).
    const introPending = () => !introDone && !reduceMotion;
    const titleHTML = (t, y, intro) =>
        `<span class="tl-word" data-lead>${staticSlot(leadOf(t), false)}</span> I've ` +
        `<span class="tl-word" data-type role="button" tabindex="0" aria-label="Filter by type">${intro ? reelSlot(INTRO) : staticSlot(verbOf(t), true)}</span> ` +
        `<span class="tl-word${intro ? ' tl-wait' : ''}" data-year role="button" tabindex="0" aria-label="Filter by year">${staticSlot(yearPhrase(y), true)}</span>`;

    function renderTitle() {
        title.innerHTML = titleHTML(type, year, introPending());
        title.querySelectorAll('.tl-word').forEach(align);
        holdIntroHeight();
    }

    // How tall the title is once it settles on type `t` and year `y`, measured on a hidden copy
    // so the live title (maybe mid-roll) isn't touched.
    function settledHeight(t, y) {
        const c = title.cloneNode(false);
        c.removeAttribute('aria-live');
        c.setAttribute('aria-hidden', 'true');
        c.style.cssText = `position:absolute;visibility:hidden;pointer-events:none;width:${title.clientWidth}px`;
        c.innerHTML = titleHTML(t, y, false);
        title.after(c);
        c.querySelectorAll('.tl-word').forEach(align);
        const h = c.offsetHeight;
        c.remove();
        return h;
    }
    // On phones the title's line count can change with the words (two lines while "so far"
    // wraps, one when it fits). Hold or glide its height so the timeline below never jumps.
    function holdIntroHeight() {
        if (introPending()) title.style.height = settledHeight(type, year) + 'px';
    }
    let heightTimer;
    function glideHeight({ duration, easing }) {
        const from = title.offsetHeight, to = settledHeight(type, year);
        clearTimeout(heightTimer);
        if (from !== to) {
            title.style.transition = 'none';
            title.style.height = from + 'px';
            void title.offsetHeight;
            title.style.transition = `height ${duration}ms ${easing}`;
            title.style.height = to + 'px';
        }
        heightTimer = setTimeout(() => { title.style.transition = ''; title.style.height = ''; }, duration + 40);
    }

    // Line the slot's baseline up with the title's by measuring: a zero-size inline-block sits
    // exactly on its line's baseline, so compare one inside the slot with one beside it.
    // The reference probe goes inside the word (in front of the slot), not before it in the title:
    // when the word wraps to the next line (phones), a probe before it stays on the previous line
    // and the line gap would be added to the offset, throwing the word up and out of the title.
    function align(host) {
        const slot = host && host.querySelector('.tl-slot');
        if (!slot) return;
        const probe = () => { const p = document.createElement('span'); p.style.cssText = 'display:inline-block;width:0;height:0;overflow:hidden'; return p; };
        slot.style.verticalAlign = '0px';
        for (let pass = 0; pass < 2; pass++) {
            const outer = probe(), inner = probe();
            host.insertBefore(outer, host.firstChild);
            slot.querySelector('.tl-sw').appendChild(inner);
            const d = inner.getBoundingClientRect().top - outer.getBoundingClientRect().top;
            outer.remove(); inner.remove();
            slot.style.verticalAlign = (parseFloat(slot.style.verticalAlign) + d) + 'px';
        }
        const bar = slot.querySelector('.tl-ul');
        if (bar) {
            const sw = bar.parentElement, p = probe();
            sw.insertBefore(p, bar);
            bar.style.top = (p.offsetTop + parseFloat(getComputedStyle(sw).fontSize) * .07) + 'px';
            p.remove();
        }
    }

    // A step roll changes a slot's width, and on phones that can move a word onto another line
    // ("so far" hops between line 2 and the end of line 1). A line change can't transition, so
    // cross-fade it: a ResizeObserver runs after layout and before paint, and any word whose line
    // changed leaves a fading copy where it was last drawn while it fades in at its new spot.
    const wraps = new Map(); // word -> { top: layout offsetTop, rect: last drawn rect, anim }
    function followWraps(recordOnly) {
        const jump = parseFloat(getComputedStyle(title).fontSize) * .4; // well under a line, well over align()'s nudges
        title.querySelectorAll('.tl-word').forEach((w) => {
            if (!w.offsetParent) return; // waiting out of the layout
            const s = wraps.get(w);
            if (s && recordOnly !== true && Math.abs(w.offsetTop - s.top) > jump) {
                const box = title.getBoundingClientRect();
                const ghost = w.cloneNode(true);
                ghost.className = 'tl-ghost';
                ['role', 'tabindex', 'aria-label'].forEach((a) => ghost.removeAttribute(a));
                ghost.setAttribute('aria-hidden', 'true');
                ghost.style.left = (s.rect.left - box.left) + 'px';
                ghost.style.top = (s.rect.top - box.top) + 'px';
                title.appendChild(ghost);
                ghost.animate([{ opacity: 1 }, { opacity: 0 }], { duration: 220, easing: 'ease-out', fill: 'forwards' }).onfinish = () => ghost.remove();
                if (s.anim) s.anim.cancel();
                s.anim = w.animate([{ opacity: 0 }, { opacity: 1 }], { duration: 320, delay: 120, easing: 'ease-in', fill: 'backwards' });
            }
            wraps.set(w, { top: w.offsetTop, rect: w.getBoundingClientRect(), anim: s && s.anim });
        });
    }
    const wrapWatch = new ResizeObserver(followWraps);

    // Spin `host`'s reel through `words`, land on the last one and draw its underline in.
    function roll(host, words, { duration, easing, glide }, done) {
        const underline = !host.hasAttribute('data-lead');
        const last = words[words.length - 1];
        if (reduceMotion) { host.innerHTML = staticSlot(last, underline); align(host); done && done(); return; }
        followWraps(true); // record where every word sits before the slot changes
        host.innerHTML = reelSlot(words);
        align(host);
        const slot = host.querySelector('.tl-slot'), reel = slot.querySelector('.tl-reel');
        wrapWatch.observe(slot);
        const items = [...reel.children], lastEl = items[items.length - 1];
        // Exact (fractional) sizes, not offsetWidth/offsetHeight: those round to whole pixels, and
        // a row that's really 62.4px tall times nine rows left the reel landing ~3.5px low, so the
        // word snapped up when the static word replaced the reel at the end.
        const box = (el) => el.getBoundingClientRect();
        const lastW = box(lastEl).width;
        if (glide) {
            // width glides from the old word to the new one, so the words after it slide smoothly
            slot.style.transition = `width ${duration}ms ${easing}`;
            slot.style.width = box(items[0]).width + 'px';
            void slot.offsetWidth;
            slot.style.width = lastW + 'px';
        } else {
            slot.style.width = Math.max(...items.map((el) => box(el).width)) + 'px';
            setTimeout(() => { slot.style.width = lastW + 'px'; }, duration * .6);
        }
        const travel = box(lastEl).top - box(items[0]).top;
        reel.animate([{ transform: 'translateY(0)' }, { transform: `translateY(${-travel}px)` }], { duration, easing, fill: 'forwards' });
        setTimeout(() => {
            wrapWatch.unobserve(slot);
            host.innerHTML = staticSlot(last, underline);
            align(host);
            const bar = host.querySelector('.tl-ul');
            if (bar) bar.animate([{ transform: 'scaleX(0)' }, { transform: 'scaleX(1)' }], { duration: 550, easing: EASE, fill: 'backwards' });
            done && done();
        }, duration + 20);
    }
    const STEP_ROLL = { duration: 480, easing: 'cubic-bezier(.65,0,.25,1)', glide: true };

    function stepType() {
        if (!introDone || rollingType) return;
        const fromVerb = verbOf(type), fromLead = leadOf(type);
        let i = type ? STEP.indexOf(type) : -1;
        do { i = i + 1 >= STEP.length ? -1 : i + 1; } while (i >= 0 && !hasItems(STEP[i], year)); // skip empty combinations
        type = i < 0 ? null : STEP[i];
        rollingType = true;
        roll(title.querySelector('[data-type]'), [fromVerb, verbOf(type)], STEP_ROLL, () => { rollingType = false; });
        if (leadOf(type) !== fromLead) roll(title.querySelector('[data-lead]'), [fromLead, leadOf(type)], STEP_ROLL);
        glideHeight(STEP_ROLL);
        update();
    }
    function stepYear() {
        if (rollingYear) return;
        const from = yearPhrase(year);
        let i = year ? YEARS.indexOf(year) : -1;
        do { i = i + 1 >= YEARS.length ? -1 : i + 1; } while (i >= 0 && !hasItems(type, YEARS[i]));
        year = i < 0 ? null : YEARS[i];
        rollingYear = true;
        roll(title.querySelector('[data-year]'), [from, yearPhrase(year)], STEP_ROLL, () => { rollingYear = false; });
        glideHeight(STEP_ROLL);
        update();
    }
    const activate = (e) => {
        const w = e.target.closest('.tl-word');
        if (!w) return;
        if (e.type === 'keydown') { if (e.key !== 'Enter' && e.key !== ' ') return; e.preventDefault(); }
        if (w.hasAttribute('data-type')) stepType();
        if (w.hasAttribute('data-year')) stepYear();
    };
    title.addEventListener('click', activate);
    title.addEventListener('keydown', activate);

    // ---- timeline ----
    const showsNow = () => !year || year === NOW_YEAR;
    function timelineHTML(list) {
        const groups = [];
        list.forEach((it) => {
            const key = year ? String(year) : it.start.slice(0, 4);
            let g = groups[groups.length - 1];
            if (!g || g.key !== key) groups.push(g = { key, items: [] });
            g.items.push(it);
        });
        return `<div class="tl"><div class="tl-line"></div>${groups.map((g, gi) => `
            <div class="tl-grp"><h3>${g.key}</h3><div class="tl-row">${g.items.map((it) => `
              <div class="tl-it" data-key="${it.title}">
                <span class="tl-dot" style="background:${TYPES[it.type].color}"></span>
                <span class="tl-when">${when(it)}</span>
                <h4>${it.title}</h4>
                <span class="tl-org">${it.org}</span>
                <p>${it.text}</p>
              </div>`).join('')}${gi === groups.length - 1 && showsNow() ? '<div class="tl-now"><span class="tl-ring"></span><span class="tl-now-label">now</span></div>' : ''}</div></div>`).join('')}</div>`;
    }
    // The line runs from the first dot's center to the last dot's (or the "now" ring's).
    function positionLine() {
        const tl = scroller.querySelector('.tl');
        if (!tl) return;
        const line = tl.querySelector('.tl-line');
        const dots = [...tl.querySelectorAll('.tl-dot, .tl-ring')];
        if (dots.length < 2) { line.style.width = '0px'; return; }
        const base = tl.getBoundingClientRect();
        const center = (el) => { const r = el.getBoundingClientRect(); return { x: r.left + r.width / 2 - base.left, y: r.top + r.height / 2 - base.top }; };
        const a = center(dots[0]), b = center(dots[dots.length - 1]);
        line.style.left = a.x + 'px';
        line.style.top = (a.y - .5) + 'px';
        line.style.width = (b.x - a.x) + 'px';
    }
    const toEnd = () => { positionLine(); scroller.scrollLeft = scroller.scrollWidth; }; // open on the most recent
    const build = () => { scroller.innerHTML = timelineHTML(visible()); toEnd(); };

    // Filter changes: leaving items fade out, staying ones slide to their new spot (FLIP),
    // new ones fade up in a quick stagger, the line stretches to its new span.
    function update() {
        if (reduceMotion) return build();
        const before = new Map([...scroller.querySelectorAll('.tl-it')].map((el) => [el.dataset.key, el.getBoundingClientRect()]));
        const oldHeads = new Set([...scroller.querySelectorAll('.tl-grp > h3')].map((h) => h.textContent));
        const oldLine = scroller.querySelector('.tl-line');
        const keep = new Set(visible().map((it) => it.title));
        const leaving = [...scroller.querySelectorAll('.tl-it')].filter((el) => !keep.has(el.dataset.key));
        const enter = () => {
            const ol = oldLine && oldLine.getBoundingClientRect();
            build();
            const line = scroller.querySelector('.tl-line'), nl = line.getBoundingClientRect();
            if (ol && ol.width && nl.width) line.animate([{ transform: `translateX(${ol.left - nl.left}px) scaleX(${ol.width / nl.width})` }, { transform: 'none' }], { duration: 600, easing: EASE });
            let n = 0;
            scroller.querySelectorAll('.tl-it').forEach((el) => {
                const b = before.get(el.dataset.key), a = el.getBoundingClientRect();
                if (b) el.animate([{ transform: `translate(${b.left - a.left}px, ${b.top - a.top}px)` }, { transform: 'none' }], { duration: 600, easing: EASE });
                else if (a.right > 0 && a.left < innerWidth) el.animate([{ opacity: 0, transform: 'translateY(16px)' }, { opacity: 1, transform: 'none' }], { duration: 480, delay: 140 + (n++) * 55, easing: EASE, fill: 'backwards' });
            });
            scroller.querySelectorAll('.tl-grp > h3').forEach((h) => {
                if (!oldHeads.has(h.textContent)) h.animate([{ opacity: 0, transform: 'translateY(10px)' }, { opacity: 1, transform: 'none' }], { duration: 480, delay: 100, easing: EASE, fill: 'backwards' });
            });
        };
        if (!leaving.length) return enter();
        leaving.forEach((el) => el.animate([{ opacity: 1 }, { opacity: 0, transform: 'translateY(-10px)' }], { duration: 200, easing: 'ease-in', fill: 'forwards' }));
        setTimeout(enter, 200);
    }

    // ---- intro: roll once when the title first comes into view (after the font loads) ----
    const fontsReady = document.fonts ? document.fonts.ready : Promise.resolve();
    renderTitle();
    build();
    fontsReady.then(() => {
        toEnd();
        title.querySelectorAll('.tl-word').forEach((w) => { if (!(w.hasAttribute('data-type') && rollingType)) align(w); });
        holdIntroHeight();
    });
    window.addEventListener('resize', () => {
        positionLine();
        // re-measure the title words (font size and metrics change with the window)
        title.querySelectorAll('.tl-word').forEach((w) => { if (!rollingType && !rollingYear) align(w); });
        holdIntroHeight();
    });
    if (reduceMotion) { introDone = true; return; }
    const io = new IntersectionObserver((entries) => {
        if (!entries.some((e) => e.isIntersecting) || introDone || rollingType) return;
        io.disconnect();
        rollingType = true;
        fontsReady.then(() => roll(title.querySelector('[data-type]'), INTRO, { duration: 1500, easing: 'cubic-bezier(.3,.65,.35,1)' }, () => {
            introDone = true;
            rollingType = false;
            // the reel has landed: bring the year phrase in at its final spot, then draw its underline
            const yr = title.querySelector('[data-year]');
            yr.classList.remove('tl-wait');
            title.querySelectorAll('.tl-word').forEach(align);
            title.style.height = '';
            yr.animate([{ opacity: 0, transform: 'translateY(.15em)' }, { opacity: 1, transform: 'none' }], { duration: 500, delay: 200, easing: EASE, fill: 'backwards' });
            const bar = yr.querySelector('.tl-ul');
            if (bar) bar.animate([{ transform: 'scaleX(0)' }, { transform: 'scaleX(1)' }], { duration: 550, delay: 400, easing: EASE, fill: 'backwards' });
        }));
    }, { threshold: 0.6 });
    io.observe(title);
}

// ============ Init ============
document.addEventListener('DOMContentLoaded', () => {
    setupMobileMenu();
    setupReveal();
    setupPillars();
    setupQuotes();
    setupEmailPill();
    setupWorkRail();
    setupHeroFloat();
    setupTimeline();
});
