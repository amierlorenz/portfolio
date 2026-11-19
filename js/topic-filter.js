// ============ All writing: topic chips ============
// The chips ship hidden (without JS every post simply shows). Picking one shows only that topic's
// cards; "All" shows everything again.
export function setupTopicFilter() {
    const chips = document.querySelector('.topic-chips');
    if (!chips) return;
    const buttons = [...chips.querySelectorAll('button')];
    const cards = [...document.querySelectorAll('.post-grid .post-card')];
    chips.hidden = false;
    chips.addEventListener('click', (e) => {
        const picked = e.target.closest('button');
        if (!picked) return;
        const topic = picked.dataset.topic;
        buttons.forEach((b) => b.setAttribute('aria-pressed', String(b === picked)));
        cards.forEach((card) => { card.hidden = !!topic && card.dataset.topic !== topic; });
    });
}
