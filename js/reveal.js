// ============ Reveal animations ============
export function setupReveal() {
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
