import { notifyDeckSubmission } from './deck-notification.js';

// Samma ordning och felhantering i båda Arkitekterna: spara först, avisera därefter.
export function normalizeContactEmail(value = '') {
    const email = value.trim();
    if (!email) return '';
    return email.length <= 254 && /^[^\s@<>]+@[^\s@<>]+\.[^\s@<>]+$/.test(email) ? email : null;
}

export function createDeckSubmissionHandler({ getDeck, saveDeck, kind, button, contactInput }) {
    let submitting = false;
    return async () => {
        if (submitting) return;
        const deck = getDeck();
        if (!deck?.dares?.length) {
            alert('Lägg till minst ett kort först.');
            return;
        }
        const contactEmail = normalizeContactEmail(contactInput?.value || '');
        if (contactInput && contactEmail !== null) contactInput.value = contactEmail;
        if (contactEmail === null || (contactInput && !contactInput.reportValidity())) {
            alert('Kontrollera mejladressen, eller lämna fältet tomt.');
            contactInput?.focus();
            return;
        }
        if (!confirm('Skicka upp denna kortlek till spelskaparen?')) return;

        submitting = true;
        const originalLabel = button?.textContent;
        if (button) {
            button.disabled = true;
            button.textContent = 'SKICKAR…';
        }
        try {
            const submittedAt = Date.now();
            const submission = await saveDeck(deck, submittedAt, contactEmail);
            // Inskickaren behöver inte vänta på mejltjänsten för att få sin bekräftelse.
            void notifyDeckSubmission({
                submissionId: submission.id,
                kind,
                cardCount: deck.dares.length,
                submittedAt
            }).catch(error => console.warn('Kortleken är sparad men mejlaviseringen misslyckades.', error));
            alert('Kortleken skickades upp! Tack.');
        } catch (error) {
            console.error(error);
            alert('Kortleken kunde inte skickas upp. Kontrollera anslutningen.');
        } finally {
            submitting = false;
            if (button) {
                button.disabled = false;
                button.textContent = originalLabel;
            }
        }
    };
}
