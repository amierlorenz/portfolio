// PROTOTYPE (throwaway, lives on proto/nav-socials only; never merge).
// Settled so far: nav = YouTube / Medium / GitHub circles + Resume; the buttons start in the hero
// and "pop" into the nav when it reaches them (and pop back the same way); LinkedIn, the copy-email
// address button and Book a Chat (with a Google Calendar logo) live in Get In Touch; the phone menu
// ends in side-by-side Email (dark) / Book a Chat (white) pills.
// Nav circles: borderless white, lifted with a shadow on desktop; on phones the bar turns light grey.
// Desktop nav: the links sit centred until the buttons arrive, then slide over to make room.
// Hover (desktop): every button gets a tinted halo; the Resume arrow nods; nav circle icons grow.
// All four buttons dock together (one trigger, a quick cascade).
// Open question (phones), switched with ?malign=left|center and the floating bar (or ← →):
//   whether the hamburger menu's section links are left-aligned or centred
//   (Email / Book a Chat stay at the bottom either way).
// Runs only on localhost or a bare IP, so it can't show up on the deployed site.

const host = location.hostname;
if (host === 'localhost' || /^\d+\.\d+\.\d+\.\d+$/.test(host)) run();

function run() {
    const EMAIL = 'amierLdavis@gmail.com';
    const CALENDAR = 'https://calendar.app.google/cnMKfDF11F9o77mK7';
    const URLS = {
        youtube: 'https://www.youtube.com/@amierlorenz',
        medium: 'https://blog.amierlorenz.com',
        github: 'https://github.com/amierlorenz',
        linkedin: 'https://www.linkedin.com/in/amierlorenz/',
    };
    const ICONS = {
        youtube: '<svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true"><rect x="1" y="4.5" width="22" height="15" rx="4.5" fill="#ff0000"/><path d="M9.75 8.6v6.8l5.9-3.4z" fill="#fff"/></svg>',
        medium: '<svg viewBox="3.5 5 17 14" width="18" height="18" aria-hidden="true"><path fill="currentColor" d="M19.938 5.686L18.651 6.92a.376.376 0 0 0-.143.362v9.067a.376.376 0 0 0 .143.361l1.257 1.234v.271h-6.322v-.27l1.302-1.265c.128-.128.128-.165.128-.36V8.99l-3.62 9.195h-.49L6.69 8.99v6.163a.85.85 0 0 0 .233.707l1.694 2.054v.271H3.815v-.27L5.51 15.86a.82.82 0 0 0 .218-.707V8.027a.624.624 0 0 0-.203-.527L4.019 5.686v-.27h4.674l3.613 7.923 3.176-7.924h4.456v.271z"/></svg>',
        github: '<svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true"><use href="#gh-mark"/></svg>',
        linkedin: '<svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true"><path fill="#0a66c2" d="M20.45 20.45h-3.55v-5.57c0-1.33-.03-3.04-1.85-3.04-1.85 0-2.14 1.45-2.14 2.94v5.67H9.35V9h3.41v1.56h.05c.48-.9 1.64-1.85 3.37-1.85 3.6 0 4.27 2.37 4.27 4.46v6.28zM5.34 7.43a2.06 2.06 0 1 1 0-4.13 2.06 2.06 0 0 1 0 4.13zm1.78 13.02H3.56V9h3.56v11.45z"/></svg>',
        // Google Calendar-style tile: blue / yellow / green / dark corners, red page fold, "31"
        calendar: `<svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true">
            <defs><clipPath id="proto-cal-clip"><rect width="24" height="24" rx="3.5"/></clipPath></defs>
            <g clip-path="url(#proto-cal-clip)">
                <rect width="24" height="24" fill="#4285f4"/>
                <rect x="18" width="6" height="6" fill="#1967d2"/>
                <rect x="18" y="6" width="6" height="12" fill="#fbbc04"/>
                <rect x="6" y="18" width="12" height="6" fill="#34a853"/>
                <rect y="18" width="6" height="6" fill="#188038"/>
                <rect x="18" y="18" width="6" height="6" fill="#f1f3f4"/>
                <path d="M18 18h6l-6 6z" fill="#ea4335"/>
                <rect x="6" y="6" width="12" height="12" fill="#fff"/>
                <text x="12" y="15.4" text-anchor="middle" font-family="Rubik, Arial, sans-serif" font-weight="600" font-size="8.6" fill="#4285f4">31</text>
            </g></svg>`,
        mail: '<svg aria-hidden="true" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="5" width="18" height="14" rx="2.5"/><path d="m4 7 8 6 8-6"/></svg>',
        copy: '<svg aria-hidden="true" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="9" y="9" width="11" height="11" rx="2"/><path d="M5 15V6a2 2 0 0 1 2-2h9"/></svg>',
        check: '<svg aria-hidden="true" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>',
        download: '<svg aria-hidden="true" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 4v12"/><path d="m6 10 6 6 6-6"/><path d="M5 20h14"/></svg>',
    };
    const LABELS = { youtube: 'YouTube', medium: 'Medium', github: 'GitHub', linkedin: 'LinkedIn', resume: 'Resume' };
    const SOCIALS = ['youtube', 'medium', 'github'];
    const ITEMS = [...SOCIALS, 'resume'];

    const MALIGNS = {
        left: 'Menu links left-aligned',
        center: 'Menu links centred',
    };
    const params = new URLSearchParams(location.search);
    const malign = MALIGNS[params.get('malign')] ? params.get('malign') : 'center';
    document.documentElement.classList.add('proto-center-A', `proto-malign-${malign}`);

    // ---- Nav (#25: Get In Touch becomes a link, Resume becomes the button) ----
    document.querySelector('.nav-links').innerHTML = `
        <a href="#about" class="nav-link">About</a>
        <a href="#timeline" class="nav-link">Timeline</a>
        <a href="#projects" class="nav-link">Projects</a>
        <a href="#skills" class="nav-link">Skills</a>
        <a href="#contact" class="nav-link">Get In Touch</a>`;
    const circle = (s) => `<a class="proto-social proto-social--${s}" data-dock="${s}" href="${URLS[s]}" target="_blank" rel="noopener" aria-label="${LABELS[s]}">${ICONS[s]}</a>`;
    document.querySelector('.nav-actions').innerHTML = `
        <div class="proto-socials">
            ${SOCIALS.map(circle).join('')}
            <a href="resume.pdf" download class="proto-social proto-resume-circle" data-dock="resume" aria-label="Download resume">${ICONS.download}</a>
        </div>
        <a href="resume.pdf" download class="nav-cta proto-resume-btn" data-dock="resume">Resume ${ICONS.download}</a>`;

    // ---- Phone menu: section links, then Email / Book a Chat ----
    const sections = [['About', 'about'], ['Timeline', 'timeline'], ['Projects', 'projects'], ['Skills', 'skills'], ['Contact', 'contact']];
    document.getElementById('mobile-menu').innerHTML = `
        <ul class="mobile-menu-list">${sections.map(([l, id], i) => `<li><a href="#${id}" style="--i:${i}">${l}</a></li>`).join('')}</ul>
        <div class="proto-menu-reach">
            <a href="mailto:${EMAIL}" class="proto-reach proto-reach--email">${ICONS.mail}<span>Email me</span></a>
            <a href="${CALENDAR}" target="_blank" rel="noopener" class="proto-reach proto-reach--chat">${ICONS.calendar.replaceAll('proto-cal-clip', 'proto-cal-clip-m')}<span>Book a Chat</span></a>
        </div>`;

    // ---- Get In Touch (#27: GitHub pill goes): copy-email address, LinkedIn, Book a Chat ----
    document.getElementById('github-button')?.remove();
    document.getElementById('email-container')?.remove();   // replaced below; js/contact.js then finds nothing to wire
    const pills = document.querySelector('.contact-pills');
    pills.innerHTML = `
        <button type="button" class="proto-cbtn proto-copy" aria-label="Copy email address ${EMAIL}">
            <span class="proto-copy-icon"><span class="proto-copy-idle">${ICONS.copy}</span><span class="proto-copy-done">${ICONS.check}</span></span>
            <span>${EMAIL}</span>
        </button>
        <a class="proto-cbtn proto-cbtn--linkedin" href="${URLS.linkedin}" target="_blank" rel="noopener">${ICONS.linkedin}<span>LinkedIn</span></a>
        <a class="proto-cbtn proto-cbtn--chat" href="${CALENDAR}" target="_blank" rel="noopener">${ICONS.calendar}<span>Book a Chat</span></a>
        <span class="proto-sr" role="status"></span>`;
    const status = pills.querySelector('[role="status"]');
    pills.querySelector('.proto-copy').addEventListener('click', async (e) => {
        const btn = e.currentTarget;
        try { await navigator.clipboard.writeText(EMAIL); }
        catch {
            const ta = Object.assign(document.createElement('textarea'), { value: EMAIL });
            ta.style.cssText = 'position:fixed;opacity:0';
            document.body.append(ta); ta.select();
            try { document.execCommand('copy'); } catch { /* nothing else to try */ }
            ta.remove();
        }
        btn.classList.add('is-copied');
        status.textContent = 'Email copied';
        clearTimeout(btn._t);
        btn._t = setTimeout(() => { btn.classList.remove('is-copied'); status.textContent = ''; }, 1800);
    });

    // ---- Footer (#28) ----
    document.querySelector('.footer-links').innerHTML =
        [...SOCIALS, 'linkedin'].map((s) => `<a class="foot-link" href="${URLS[s]}" target="_blank" rel="noopener">${LABELS[s]}</a>`).join('') +
        `<a class="foot-link" href="mailto:${EMAIL}">Email</a>
         <a class="foot-link" href="${CALENDAR}" target="_blank" rel="noopener">Calendar</a>`;

    setupDock();

    // ---- Floating switcher ----
    const bar = document.createElement('div');
    bar.className = 'proto-switcher';
    bar.innerHTML = `
        <button type="button" data-step="-1" aria-label="Previous menu alignment">←</button>
        <span><b>${malign}</b> <span class="proto-long">${MALIGNS[malign]}</span></span>
        <button type="button" data-step="1" aria-label="Next menu alignment">→</button>`;
    document.body.append(bar);
    const go = (step) => {
        const keys = Object.keys(MALIGNS);
        params.set('malign', keys[(keys.indexOf(malign) + step + keys.length) % keys.length]);
        location.search = params.toString();
    };
    bar.addEventListener('click', (e) => { const b = e.target.closest('button'); if (b) go(Number(b.dataset.step)); });
    document.addEventListener('keydown', (e) => {
        if (e.target.closest('input, textarea, [contenteditable]')) return;
        if (e.key === 'ArrowLeft') go(-1);
        if (e.key === 'ArrowRight') go(1);
    });

    // ================= Dock (pop) =================
    // Each hero button has a twin in the nav (same data-dock key; Resume is a pill on desktop and a
    // circle on phones). Once the nav is about to cover a hero button, that button shrinks away and its
    // nav twin pops in; scrolling back plays the exact mirror. An IntersectionObserver whose top edge
    // sits just under the nav does the watching, so no script runs while scrolling. The animation
    // itself is CSS transform + opacity on pre-promoted layers (see .proto-pop in the CSS).
    function setupDock() {
        const root = document.documentElement;
        root.classList.add('proto-dock', 'proto-instant');

        const row = document.createElement('div');
        row.className = 'proto-hero-row';
        row.innerHTML = ITEMS.map((k) => {
            const attrs = k === 'resume' ? 'href="resume.pdf" download' : `href="${URLS[k]}" target="_blank" rel="noopener"`;
            // The observer watches the unscaled wrapper; the button inside is what shrinks and pops
            return `<span class="proto-hero-slot" data-for="${k}"><a class="proto-hero-btn proto-hero-btn--${k} proto-pop" data-dock="${k}" ${attrs}>${k === 'resume' ? ICONS.download : ICONS[k]}<span>${LABELS[k]}</span></a></span>`;
        }).join('');
        document.querySelector('#top').append(row);
        document.querySelectorAll('.nav-actions [data-dock]').forEach((el) => el.classList.add('proto-pop', 'is-out'));

        // All four move together: one trigger, a quick left-to-right cascade
        const GAP = 70;
        let docked = null;
        const setDocked = (on) => {
            if (on === docked) return;
            docked = on;
            row.querySelectorAll('.proto-hero-btn').forEach((hero, i) => {
                const twins = document.querySelectorAll(`.nav-actions [data-dock="${hero.dataset.dock}"]`);
                for (const el of [hero, ...twins]) el.style.setProperty('--delay', `${i * GAP}ms`);
                hero.classList.toggle('is-out', on);
                twins.forEach((t) => t.classList.toggle('is-out', !on));
            });
            // Desktop: the nav's button area opens while docked (CSS animates its width)
            root.classList.toggle('proto-has-docked', on);
        };

        // A: the open width of the button area = its natural width, measured with everything showing
        const actions = document.querySelector('.nav-actions');
        const measureActions = () => {
            actions.style.width = 'max-content';
            actions.style.setProperty('--open-w', `${Math.ceil(actions.getBoundingClientRect().width)}px`);
            actions.style.width = '';
        };
        measureActions();
        document.fonts?.ready.then(measureActions);

        let io;
        const observe = () => {
            io?.disconnect();
            const line = Math.round(document.querySelector('.nav-pill').getBoundingClientRect().bottom + 6);
            // Root = from the line under the nav down to far below the screen. Watching the first
            // (top-left) slot: everything docks as soon as any of it pokes above the line.
            io = new IntersectionObserver(([e]) => {
                setDocked(e.intersectionRatio < 1 && e.boundingClientRect.top < line);
                requestAnimationFrame(() => requestAnimationFrame(() => root.classList.remove('proto-instant')));
            }, { rootMargin: `-${line}px 0px 100000px 0px`, threshold: 1 });
            io.observe(row.querySelector('.proto-hero-slot'));
        };
        observe();
        let rt;
        addEventListener('resize', () => { clearTimeout(rt); rt = setTimeout(() => { root.classList.add('proto-instant'); docked = null; measureActions(); observe(); }, 150); });
    }
}

// ?scroll=N jumps to a scroll position after load (for screenshots)
if (new URLSearchParams(location.search).has('scroll')) {
    addEventListener('load', () => setTimeout(() => {
        document.documentElement.style.scrollBehavior = 'auto';
        scrollTo(0, Number(new URLSearchParams(location.search).get('scroll')));
    }, 1500));
}
