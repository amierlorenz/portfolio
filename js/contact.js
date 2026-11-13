// ============ Copy-email button ============
// The button shows the address; clicking copies it. The copy icon turns into a green check for
// a moment, and #email-status announces it to screen readers.
export function setupEmailPill() {
    const button = document.getElementById('email-button');
    if (!button) return;

    const EMAIL = button.dataset.email || 'amierLdavis@gmail.com';
    const status = document.getElementById('email-status');
    let copiedTimer = null;

    const showCopied = () => {
        button.classList.add('copied');
        if (status) status.textContent = 'Email address copied';
        clearTimeout(copiedTimer);
        copiedTimer = setTimeout(() => {
            button.classList.remove('copied');
            if (status) status.textContent = '';
        }, 1800);
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

    button.addEventListener('click', copyEmail);
}
