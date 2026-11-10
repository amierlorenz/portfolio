// ============ Timeline graph: overlapping items as git-graph branches (issue #6) ============
// Draws over the timeline that js/timeline.js builds. It watches the scroller for rebuilds (filters)
// and redraws from the dots' rendered boxes, every frame while anything moves, so branches follow the
// sliding cards.
//
//   - Each item with an end date gets a branch: it forks off its dot, runs in a lane above the main
//     line and merges back where it ended. Items still going fan into the "now" ring.
//   - Hidden feature: starts collapsed (a plain line). Clicking the line, a dot or "now" opens it.
//   - Clicking a card pins it (its date gets a chip, everything else dims); clicking an end date pins
//     every item that ended then. Click again or press Esc to clear.
//   - While collapsed, a pinned branch rises on its own once you've scrolled right past its card,
//     and a tag at the timeline's edge names the closest pinned item ("+N" for the rest).
//   - End months show on the date row where branches merge, one spot per date (the gap widens if
//     they don't fit). With a past year selected, branches running past it fade out after the last
//     card; ones ending in a later year say so at the end of their branch ("→ May 2026").
import { ITEMS } from '../data/timeline.js?v=20261110c';

const NS = 'http://www.w3.org/2000/svg';
const BY = Object.fromEntries(ITEMS.map((it) => [it.title, it]));
const MON = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const fmt = (ym) => `${MON[+ym.slice(5) - 1]} ${ym.slice(0, 4)}`;
const monthIdx = (ym) => (+ym.slice(0, 4)) * 12 + (+ym.slice(5)) - 1;
const esc = (s) => s.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;');
const W = 78;       // room for one end label ("Sep 2026" in 13px Fira Code, plus breathing room)
const TAG_H = 26;   // an edge tag's height plus a gap: stacked pinned branches sit this far apart
const EDGE = 28;    // the scroller's faded edge; tags sit just inside it
const EASE = 'cubic-bezier(.22,.8,.2,1)';

export function setupTimelineGraph() {
    const scroller = document.querySelector('#timeline .tl-scroller');
    if (!scroller) return;
    const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;

    const state = { open: false, pins: new Set(), hover: [] };
    // Animated values ease toward their targets each frame (they snap with reduced motion):
    // open = 0..1 collapsed → expanded, pad = the band above the line, rise = per pinned branch
    const anim = { open: 0, pad: null, rise: new Map(), last: 0 };
    const ease = (cur, target, dt, eps) => {
        if (reduceMotion) return target;
        const v = cur + (target - cur) * (1 - Math.exp(-dt / 110));
        return Math.abs(target - v) < eps ? target : v;
    };
    let geo = null; // the last drawn geometry, for the edge tags between frames

    const layer = (tl, sel, make, first) => {
        let el = tl.querySelector(sel);
        if (!el) { el = make(); first ? tl.prepend(el) : tl.appendChild(el); }
        return el;
    };
    const svgEl = (cls) => { const s = document.createElementNS(NS, 'svg'); s.setAttribute('class', cls); s.setAttribute('aria-hidden', 'true'); return s; };

    function draw(t = performance.now()) {
        const tl = scroller.querySelector('.tl');
        if (!tl) return true;
        const dt = anim.last ? Math.min(64, Math.max(1, t - anim.last)) : 16;
        anim.last = t;
        let settled = true;

        // Layers: branches under the dots; a click strip over the line band (the hidden toggle);
        // end labels and pin rings on top. The tags are added by placeTags().
        const lines = layer(tl, 'svg.tlg-lines', () => svgEl('tlg-lines'), true);
        const hit = layer(tl, '.tlg-hit', () => {
            const d = document.createElement('div');
            d.className = 'tlg-hit';
            d.setAttribute('role', 'button');
            d.tabIndex = 0;
            d.setAttribute('aria-label', 'Show overlapping items as branches');
            return d;
        });
        const top = layer(tl, 'svg.tlg-top', () => svgEl('tlg-top'));

        const phone = innerWidth < 640;
        const G = phone ? 7 : 9;   // lane spacing
        const F = phone ? 22 : 30; // fork/merge curve width
        const base = tl.getBoundingClientRect();
        const rel = (r) => ({ l: r.left - base.left, r: r.right - base.left, cx: r.left + r.width / 2 - base.left });
        const its = [...tl.querySelectorAll('.tl-it')].map((el) => {
            const it = BY[el.dataset.key], dot = el.querySelector('.tl-dot');
            return { el, it, key: el.dataset.key, color: dot.style.background, x: rel(dot.getBoundingClientRect()).cx, m: monthIdx(it.start) };
        });
        if (!its.length) return true;
        const whenBox = (o) => rel(o.el.querySelector('.tl-when').getBoundingClientRect());
        const ringEl = tl.querySelector('.tl-ring');
        const nowEl = tl.querySelector('.tl-now');
        const ring = ringEl && { x: rel(ringEl.getBoundingClientRect()).cx };
        const last = its[its.length - 1];
        // No "now" ring means a past year is selected; its heading is the only one
        const viewYear = ring ? null : +[...tl.querySelectorAll('.tl-grp > h3')].pop().textContent;
        const runsOn = (it) => !ring && it.end && (it.end === 'now' || +it.end.slice(0, 4) > viewYear);
        const drawn = (key) => Math.max(anim.open, anim.rise.get(key) || 0) > .01; // as of last frame

        // ---- past-year view: branches running past the year end in slots after the last card ----
        const tail = new Map(); // key -> x
        const endOrder = (o) => (o.it.end === 'now' ? Infinity : monthIdx(o.it.end));
        const runOn = its.filter((o) => runsOn(o.it)).sort((a, b) => endOrder(a) - endOrder(b));
        const tailStart = whenBox(last).r + 12;
        const tailMonths = [...new Set(runOn.map((o) => o.it.end))];
        runOn.forEach((o) => tail.set(o.key, tailStart + W / 2 + tailMonths.indexOf(o.it.end) * W));
        const tailEnd = ring ? 0 : Math.max(last.x + 60, tailStart + tailMonths.length * W + 30);

        // ---- end dates between two cards: one spot per distinct month, side by side ----
        const slot = new Map(); // key -> merge x
        const gaps = new Map(); // prev card's key -> { prev, next, months: month -> keys }
        its.filter((o) => o.it.end && o.it.end !== 'now' && !runsOn(o.it)).forEach((o) => {
            const m = monthIdx(o.it.end);
            if (its.some((p) => p !== o && p.m === m)) return; // an item starts that month: merge onto its dot
            const prev = [...its].reverse().find((p) => p.m <= m) || o;
            const next = its.find((p) => p.m > m);
            const g = gaps.get(prev.key) || { prev, next, months: new Map() };
            gaps.set(prev.key, g);
            if (!g.months.has(m)) g.months.set(m, []);
            g.months.get(m).push(o.key);
        });
        // A gap whose labels don't fit between the two cards' dates widens: the next card slides
        // right just enough, and only while those labels are showing.
        const margins = new Map();
        gaps.forEach((g) => {
            const nextEl = g.next ? g.next.el : nowEl;
            const a = whenBox(g.prev).r + 8;
            const b = g.next ? whenBox(g.next).l - 8 : (ring ? ring.x - 24 : a + 200);
            const ms = [...g.months.keys()].sort((x, y) => x - y);
            const shown = ms.filter((m) => g.months.get(m).some(drawn)).length;
            if (nextEl) {
                const cur = parseFloat(getComputedStyle(nextEl).marginLeft) || 0;
                margins.set(nextEl, Math.max(0, shown * W - (b - a - cur)));
            }
            const fits = ms.length * W <= b - a;
            ms.forEach((m, i) => {
                const x = fits ? (a + b - ms.length * W) / 2 + W / 2 + i * W
                    : ms.length === 1 ? (a + b) / 2 : a + W / 2 + i * (b - a - W) / (ms.length - 1);
                g.months.get(m).forEach((k) => slot.set(k, x));
            });
        });
        [...its.map((o) => o.el), nowEl].filter(Boolean).forEach((el) => {
            const target = Math.round(margins.get(el) || 0);
            if (+(el.dataset.tlgM || 0) !== target) {
                el.dataset.tlgM = target;
                el.style.marginLeft = target ? target + 'px' : '';
                until = Math.max(until, performance.now() + 750); // keep redrawing while it slides
            }
        });

        const endX = (o) => {
            if (tail.has(o.key)) return tail.get(o.key);
            if (o.it.end === 'now') return ring.x;
            if (slot.has(o.key)) return slot.get(o.key);
            const at = [...its].reverse().find((p) => p !== o && p.m === monthIdx(o.it.end));
            return at ? at.x : o.x + 2 * F + 20;
        };

        // ---- lanes: greedy, lowest free lane first (lane 0 is nearest the main line) ----
        const branches = [], laneEnd = [];
        its.filter((o) => o.it.end).forEach((o) => {
            const x1 = endX(o);
            let lane = laneEnd.findIndex((e) => e + 16 < o.x);
            if (lane < 0) lane = laneEnd.length;
            laneEnd[lane] = x1;
            const runs = tail.has(o.key), ongoing = o.it.end === 'now' && !runs;
            // Still going past a past year: no label, the card already says "→ now"
            const label = runs ? (o.it.end === 'now' ? null : `→ ${fmt(o.it.end)}`)
                : !ongoing && !its.some((p) => p.x === x1) ? fmt(o.it.end) : null;
            branches.push({ key: o.key, color: o.color, xs: o.x, x1, lane, ongoing, runs, label });
        });

        // ---- how far each branch is raised: opening raises all; a pin raises its own ----
        const pinned = its.filter((o) => state.pins.has(o.key));
        const solo = !state.open && pinnedOff() === 'left'; // you've scrolled right past the pinned cards
        const openT = state.open ? 1 : 0;
        anim.open = ease(anim.open, openT, dt, .002);
        if (anim.open !== openT) settled = false;
        const pinnedBranches = branches.filter((b) => state.pins.has(b.key)).sort((a, b) => a.lane - b.lane);
        branches.forEach((b) => {
            const target = solo && state.pins.has(b.key) ? 1 : 0;
            const rise = ease(anim.rise.has(b.key) ? anim.rise.get(b.key) : target, target, dt, .002);
            if (rise !== target) settled = false;
            anim.rise.set(b.key, rise);
            b.r = Math.max(anim.open, rise);
            const full = G * (1 + b.lane);
            const rank = pinnedBranches.indexOf(b);
            const alone = rank < 0 ? G : G * 3.5 + rank * TAG_H; // a lone pinned branch rides higher
            b.h = (alone + (full - alone) * anim.open) * b.r;  // height above the main line
            b.op = Math.min(1, b.r * 1.6);
        });
        const need = Math.max(0, ...branches.map((b) => b.h));
        const mx = Math.max(0, ...branches.map((b) => b.r));
        const padT = need ? need + 12 * mx : 0;
        anim.pad = anim.pad == null ? padT : ease(anim.pad, padT, dt, .3);
        if (anim.pad !== padT) settled = false;
        scroller.style.setProperty('--tlg-pad', anim.pad + 'px');
        const fit = need ? Math.min(1, Math.max(0, anim.pad - 12 * mx) / need) : 1; // keep lanes inside the band while it eases

        // room after the last card for the faded tail (past-year views)
        tl.style.paddingRight = ring ? '' : Math.max(0, tailEnd + 16 - rel(last.el.getBoundingClientRect()).r) + 'px';

        // ---- the main line's y: layout only (the row's top, its padding, half a dot) ----
        const row = tl.querySelector('.tl-row');
        const y0 = row.getBoundingClientRect().top - base.top + parseFloat(getComputedStyle(row).paddingTop) + 8.5;
        const line = tl.querySelector('.tl-line');
        if (line) line.style.top = (y0 - .5) + 'px';

        const path = (b) => {
            const yl = y0 - b.h * fit, h = y0 - yl;
            const d = `M${b.xs},${y0} C${b.xs + F / 2},${y0} ${b.xs + F / 2},${yl} ${b.xs + F},${yl}`;
            if (b.runs) return d + ` L${b.x1},${yl}`;
            if (b.ongoing) { // fan into the ring; taller lanes start curving earlier, so they never cross
                const w = 34 + h * 1.9, xc = ring.x - w;
                return d + ` L${xc},${yl} C${xc + w * .55},${yl} ${ring.x - w * .18},${y0 - h * .12} ${ring.x},${y0}`;
            }
            return d + ` L${b.x1 - F},${yl} C${b.x1 - F / 2},${yl} ${b.x1 - F / 2},${y0} ${b.x1},${y0}`;
        };
        // offsetWidth, not scrollWidth: these layers count toward scrollWidth and would keep the timeline wide
        const width = tl.offsetWidth, height = tl.offsetHeight;
        const shownB = branches.filter((b) => b.r > .01);
        const fade = (id, x1, color) => `<linearGradient id="${id}" gradientUnits="userSpaceOnUse" x1="${x1 - 70}" y1="0" x2="${x1}" y2="0"><stop offset="0" stop-color="${color}" /><stop offset="1" stop-color="${color}" stop-opacity="0" /></linearGradient>`;
        lines.setAttribute('width', width);
        lines.setAttribute('height', height);
        lines.innerHTML = '<defs>' + shownB.map((b, i) => (b.runs ? fade(`tlgf${i}`, b.x1, b.color) : '')).join('') + (ring ? '' : fade('tlgfm', tailEnd, '#222')) + '</defs>' +
            (ring ? '' : `<path class="tlg-main-tail" d="M${last.x},${y0} L${tailEnd},${y0}" stroke="url(#tlgfm)" />`) +
            shownB.map((b, i) => `<g class="tlg-br" data-k="${esc(b.key)}" style="opacity:${b.op}"><path d="${path(b)}" stroke="${b.runs ? `url(#tlgf${i})` : b.color}" /></g>`).join('');

        hit.style.top = (y0 - anim.pad - 8) + 'px';
        hit.style.height = (anim.pad + 20) + 'px';
        hit.style.width = width + 'px';
        hit.setAttribute('aria-expanded', String(state.open));

        // ---- pins: anything pinned or hovered dims the rest, even an item with no branch ----
        tl.classList.toggle('tlg-has-pin', pinned.length > 0);
        its.forEach((o) => o.el.classList.toggle('tlg-pinned', state.pins.has(o.key)));
        const hot = new Set([...state.hover, ...state.pins]);
        lines.querySelectorAll('.tlg-br').forEach((g) => g.classList.toggle('hot', hot.has(g.dataset.k)));
        lines.classList.toggle('dim', hot.size > 0);

        drawLabels(top, { branches: shownB, y0, fit, base, tl, hot, width, height });
        // Pin rings live in the top layer, not as a box-shadow on the dot: that pokes out of the
        // card, and the card's opacity fade left a stale arc behind when the pin moved.
        top.querySelector('g.rings').innerHTML = pinned.map((o) => `<circle cx="${o.x}" cy="${y0}" r="13" fill="#fff" stroke="#222" stroke-width="1.5" /><circle cx="${o.x}" cy="${y0}" r="8.5" fill="${o.color}" />`).join('');

        geo = { tl, y0, fit, pinned, branches };
        placeTags();
        return settled;
    }

    // End labels are clickable, so their elements are kept and updated in place (keyed by date and
    // items): rebuilding them every frame swapped the element out between mousedown and mouseup.
    function drawLabels(top, { branches, y0, fit, base, tl, hot, width, height }) {
        top.setAttribute('width', width);
        top.setAttribute('height', height);
        let labG = top.querySelector('g.labels');
        if (!labG) { top.innerHTML = '<g class="labels"></g><g class="rings"></g>'; labG = top.firstChild; }
        const when = tl.querySelector('.tl-when'), wr = when && when.getBoundingClientRect();
        const ly = wr ? wr.top - base.top + wr.height / 2 : y0 + 36; // the cards' date row
        const ends = new Map(); // one label per spot; branches ending the same month share it
        branches.filter((b) => b.label).forEach((b) => {
            const k = `${Math.round(b.x1)}|${b.label}`;
            const e = ends.get(k) || { x: b.x1, label: b.label, op: 0, keys: [], color: b.color, merge: !b.runs, yl: y0 - b.h * fit };
            e.keys.push(b.key);
            e.op = Math.max(e.op, b.op);
            ends.set(k, e);
        });
        const rowEnd = [], keep = new Set();
        [...ends.values()].sort((a, b) => a.x - b.x).forEach((e) => {
            let y = e.yl; // run-on labels ride at their branch's height, where the line fades out
            if (e.merge) { // merge dates sit on the date row, stacking into rows if they'd overlap
                let r = rowEnd.findIndex((end) => end < e.x - W / 2 + 4);
                if (r < 0) r = rowEnd.length;
                rowEnd[r] = e.x + W / 2 - 4;
                y = ly + r * 18;
            }
            const id = `${e.label}|${e.keys.join('|')}`;
            keep.add(id);
            let g = [...labG.children].find((c) => c.dataset.id === id);
            if (!g) {
                g = document.createElementNS(NS, 'g');
                g.dataset.id = id;
                g.dataset.keys = e.keys.join('|');
                g.innerHTML = `<circle r="3.5" fill="#fff" stroke-width="1.5" /><rect class="tlg-end-hit" rx="6" /><text class="tlg-end-text">${esc(e.label)}</text>`;
                labG.appendChild(g);
            }
            const [mark, box, text] = g.children;
            mark.style.display = e.merge ? '' : 'none';
            mark.setAttribute('cx', e.x); mark.setAttribute('cy', y0); mark.setAttribute('stroke', e.color);
            if (e.merge) {
                box.setAttribute('x', e.x - W / 2); box.setAttribute('y', y - 14); box.setAttribute('width', W); box.setAttribute('height', 28);
                text.setAttribute('x', e.x); text.setAttribute('y', y);
            } else { // starts where the branch fades, so the fading line reads as the arrow
                box.setAttribute('x', e.x - 2); box.setAttribute('y', y - 11); box.setAttribute('width', e.label.length * 7.4 + 14); box.setAttribute('height', 22);
                text.setAttribute('x', e.x + 5); text.setAttribute('y', y);
            }
            text.classList.toggle('tlg-run', !e.merge);
            g.setAttribute('class', 'tlg-end' + (e.keys.some((k) => state.pins.has(k)) ? ' on' : ''));
            g.style.opacity = e.op * (hot.size && !e.keys.some((k) => hot.has(k)) ? .3 : 1);
        });
        [...labG.children].forEach((c) => { if (!keep.has(c.dataset.id)) c.remove(); });
    }

    // Are the pinned cards (mostly) scrolled out of view, and past which edge? false if any is in view.
    function pinnedOff() {
        const tl = scroller.querySelector('.tl');
        if (!tl || !state.pins.size) return false;
        const els = [...tl.querySelectorAll('.tl-it')].filter((e) => state.pins.has(e.dataset.key));
        if (!els.length) return false;
        const sr = scroller.getBoundingClientRect();
        const sides = els.map((el) => {
            const cr = el.getBoundingClientRect();
            const shown = Math.max(0, Math.min(cr.right, sr.right - EDGE) - Math.max(cr.left, sr.left + EDGE));
            return shown > cr.width * .5 ? 'in' : cr.left + cr.width / 2 < sr.left + sr.width / 2 ? 'left' : 'right';
        });
        return sides.every((s) => s === 'left') ? 'left' : sides.every((s) => s === 'right') ? 'right' : false;
    }

    // ---- edge tag: names the pinned item closest to the view ("+N" for the rest) while the pinned
    // cards are out of view; it rides on that item's branch when the branch passes the edge ----
    function placeTags() {
        if (!geo) return;
        const { tl, y0, fit, pinned, branches } = geo;
        const off = pinned.length && pinnedOff();
        let tag = tl.querySelector('.tlg-tag');
        if (!off) { if (tag) hideTag(tag); return; }
        if (!tag) { tag = document.createElement('button'); tag.type = 'button'; tag.className = 'tlg-tag'; tag.hidden = true; tl.appendChild(tag); }
        const base = tl.getBoundingClientRect(), sr = scroller.getBoundingClientRect();
        const leftOf = off === 'left';
        const edge = leftOf ? sr.left - base.left + EDGE : sr.right - base.left - EDGE;
        const near = [...pinned].sort((a, b) => (leftOf ? b.x - a.x : a.x - b.x)); // closest first
        const o = near[0];
        const br = branches.find((b) => b.key === o.key);
        const onBranch = br && br.r > .5 && br.xs < edge && edge < br.x1;
        const name = o.key + (near.length > 1 ? ` +${near.length - 1}` : '');
        if (tag.hidden || tag.dataset.out) { // enter: slide in from the edge it points to
            if (tag.exit) tag.exit.cancel();
            delete tag.dataset.out;
            tag.hidden = false;
            if (!reduceMotion) tag.animate([{ opacity: 0, transform: `translateX(${leftOf ? -12 : 12}px)` }, { opacity: 1, transform: 'none' }], { duration: 280, easing: EASE, fill: 'backwards' });
        }
        tag.dataset.key = o.key;
        tag.textContent = leftOf ? `← ${name}` : `${name} →`;
        tag.style.setProperty('--c', o.color);
        tag.style.top = ((onBranch ? y0 - br.h * fit : y0) - 11) + 'px';
        tag.style.left = leftOf ? edge + 'px' : '';
        tag.style.right = leftOf ? '' : (tl.offsetWidth - edge) + 'px';
        tag.setAttribute('aria-label', `Scroll back to ${o.key}`);
    }
    // exit: fade out, then hide (marked, so scrolling straight back cancels it)
    function hideTag(tag) {
        if (tag.hidden || tag.dataset.out) return;
        if (reduceMotion) { tag.hidden = true; return; }
        tag.dataset.out = '1';
        tag.exit = tag.animate([{ opacity: 1 }, { opacity: 0 }], { duration: 180, easing: 'ease-in', fill: 'forwards' });
        tag.exit.onfinish = () => {
            if (tag.dataset.out) { tag.hidden = true; delete tag.dataset.out; }
            tag.exit.cancel();
            tag.exit = null;
        };
    }
    let wasOff = false;
    scroller.addEventListener('scroll', () => {
        const off = pinnedOff();
        if (off !== wasOff) { wasOff = off; kick(); } else placeTags();
    }, { passive: true });

    if (matchMedia('(hover: hover)').matches) {
        scroller.addEventListener('pointerover', (e) => {
            const end = e.target.closest('.tlg-end'), it = e.target.closest('.tl-it');
            state.hover = end ? end.dataset.keys.split('|') : it ? [it.dataset.key] : [];
            draw();
        });
        scroller.addEventListener('pointerleave', () => { state.hover = []; draw(); });
    }

    // ---- clicks ----
    const pin = (keys) => { state.pins = new Set(keys); kick(); };
    const toggleOpen = () => { state.open = !state.open; kick(); };
    scroller.addEventListener('click', (e) => {
        const tag = e.target.closest('.tlg-tag');
        if (tag) {
            const o = geo && geo.pinned.find((p) => p.key === tag.dataset.key);
            if (o) {
                const sr = scroller.getBoundingClientRect(), r = o.el.getBoundingClientRect();
                scroller.scrollBy({ left: r.left + r.width / 2 - (sr.left + sr.width / 2), behavior: reduceMotion ? 'auto' : 'smooth' });
            }
            return;
        }
        const end = e.target.closest('.tlg-end');
        if (end) { // pin every item that ended then; clicking again clears
            const keys = end.dataset.keys.split('|');
            const same = state.pins.size === keys.length && keys.every((k) => state.pins.has(k));
            return pin(same ? [] : keys);
        }
        if (e.target.closest('.tlg-hit, .tl-now')) return toggleOpen();
        const it = e.target.closest('.tl-it');
        if (it && !String(getSelection())) pin(state.pins.size === 1 && state.pins.has(it.dataset.key) ? [] : [it.dataset.key]);
    });
    scroller.addEventListener('keydown', (e) => {
        if (e.target.closest('.tlg-hit') && (e.key === 'Enter' || e.key === ' ')) { e.preventDefault(); toggleOpen(); }
    });
    addEventListener('keydown', (e) => { if (e.key === 'Escape' && state.pins.size) pin([]); });

    // ---- redraw every frame while anything moves (filter slides, opening, rising, widening gaps) ----
    let until = 0, raf = 0;
    function kick() {
        if (reduceMotion) return draw();
        until = Math.max(until, performance.now() + 900);
        if (!raf) raf = requestAnimationFrame(function tick(t) { const done = draw(t); raf = (!done || performance.now() < until) ? requestAnimationFrame(tick) : 0; });
    }
    new MutationObserver(kick).observe(scroller, { childList: true }); // timeline.js rebuilt it (a filter)
    addEventListener('resize', kick);
    if (document.fonts) document.fonts.ready.then(kick);
    draw();
}
