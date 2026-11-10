// ============ Copy-email pill ============
export function setupEmailPill() {
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
