import { siteServicesConfig } from './site-services-config.js';

const sending = new Map();
const sent = new Set();

// Mottagare och mejltext bestäms i EmailJS-mallen. Inga korttexter, spelarnamn,
// kortleksnamn, användar-ID:n eller valfria mottagaradresser skickas till mejltjänsten.
// Kontaktadressen visas i mejltexten; den används aldrig som mottagare.
export async function notifyDeckSubmission({ submissionId, kind, cardCount, submittedAt, contactEmail = '' }) {
    if (location.protocol !== 'https:' || location.hostname !== siteServicesConfig.hostname) {
        return { status: 'local' };
    }
    const { serviceId, templateId, publicKey } = siteServicesConfig.emailjs;
    if (![serviceId, templateId, publicKey].every(value => typeof value === 'string' && value.trim())) {
        return { status: 'not-configured' };
    }
    if (!/^[a-z0-9]{20}$/i.test(submissionId) || !['dare', 'truth'].includes(kind)
        || !Number.isInteger(cardCount) || cardCount < 1 || cardCount > 200
        || !Number.isSafeInteger(submittedAt) || !Number.isFinite(new Date(submittedAt).getTime())) {
        return { status: 'invalid' };
    }
    if (sent.has(submissionId)) return { status: 'already-sent' };
    if (sending.has(submissionId)) return sending.get(submissionId);

    const contact = typeof contactEmail === 'string' ? contactEmail.trim() : '';
    const displayContact = contact.length <= 254 && /^[^\s@<>]+@[^\s@<>]+\.[^\s@<>]+$/.test(contact)
        ? contact : 'Ingen mejladress angiven';
    const request = sendNotification({ serviceId, templateId, publicKey, submissionId, kind, cardCount, submittedAt, displayContact });
    sending.set(submissionId, request);
    try {
        return await request;
    } finally {
        sending.delete(submissionId);
    }
}

async function sendNotification({ serviceId, templateId, publicKey, submissionId, kind, cardCount, submittedAt, displayContact }) {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 8000);
    try {
        const response = await fetch('https://api.emailjs.com/api/v1.0/email/send', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'omit',
            keepalive: true,
            signal: controller.signal,
            body: JSON.stringify({
                service_id: serviceId,
                template_id: templateId,
                user_id: publicKey,
                template_params: {
                    submission_id: submissionId,
                    deck_type: kind === 'truth' ? 'Truth' : 'Dare',
                    card_count: cardCount,
                    contact_email: displayContact,
                    submitted_at: new Date(submittedAt).toLocaleString('sv-SE', { timeZone: 'Europe/Stockholm' })
                }
            })
        });
        if (!response.ok) throw new Error(`EmailJS HTTP ${response.status}`);
        sent.add(submissionId);
        if (sent.size > 200) sent.delete(sent.values().next().value);
        return { status: 'sent' };
    } catch (error) {
        // Kortleken är redan sparad i Firebase. Ett kvot-, nätverks- eller mejlfel
        // får aldrig visas som ett misslyckat kortleksinskick eller orsaka ett nytt inskick.
        console.warn('Mejlaviseringen kunde inte skickas. Kortleken är sparad.', error);
        return { status: 'failed' };
    } finally {
        clearTimeout(timeout);
    }
}
