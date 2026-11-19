// ============ Featured Projects: case files ============
// - Discovery: each project's cards start stacked in the front card's spot and deal out as it scrolls
//   into view; the text rises just after. The same motion for every project.
// - Click a back card to swap it with the front one (each card's place comes from its data-role).
// - Touch screens can't hover, so the back cards spread apart once as each project scrolls in.
// - Clips play only while on screen, and never with reduced motion (the poster shows instead).
export function setupProjects() {
    const section = document.getElementById('projects');
    if (!section) return;
    const cases = [...section.querySelectorAll('.case')];
    const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;

    // Arm the intro only for projects still below the screen, so a reload halfway down doesn't hide anything
    section.classList.add('is-armed');
    const intro = new IntersectionObserver((entries) => entries.forEach((e) => {
        if (!e.isIntersecting) return;
        e.target.classList.add('is-in');
        intro.unobserve(e.target);
        setTimeout(() => e.target.classList.add('is-settled'), 1400); // drop the stagger so clicks feel instant
    }), { threshold: .35 });
    cases.forEach((c) => {
        if (reduceMotion || c.getBoundingClientRect().top < innerHeight * .65) c.classList.add('is-in', 'is-settled');
        else intro.observe(c);
    });

    section.addEventListener('click', (e) => {
        const card = e.target.closest('button.case-card');
        if (!card || card.dataset.role === 'front') return;
        const front = card.parentElement.querySelector('[data-role="front"]');
        front.dataset.role = card.dataset.role;
        card.dataset.role = 'front';
    });

    if (matchMedia('(hover: none)').matches) {
        const fan = new IntersectionObserver((entries) => entries.forEach((e) => {
            if (!e.isIntersecting) return;
            e.target.classList.add('is-fanned');
            fan.unobserve(e.target);
        }), { threshold: .5 });
        section.querySelectorAll('.case-screens').forEach((s) => fan.observe(s));
    }

    if (reduceMotion) return;
    const clips = new IntersectionObserver((entries) => entries.forEach((e) => {
        if (e.isIntersecting) e.target.play().catch(() => {}); // autoplay can be refused; the poster stays
        else e.target.pause();
    }), { threshold: .25 });
    section.querySelectorAll('video').forEach((v) => clips.observe(v));
}
