import { siteServicesConfig } from './site-services-config.js';

// Räknar öppningar av spelsidan. Spelarnas namn, inställningar och kort skickas inte hit.
// Lokal utveckling och den lokala adminvyn ska aldrig räknas som besök.
const { hostname, cloudflareToken } = siteServicesConfig;
if (location.protocol === 'https:' && location.hostname === hostname
    && /^[a-f0-9]{32}$/i.test(cloudflareToken)
    && !document.getElementById('dareme-visit-statistics')) {
    const beacon = document.createElement('script');
    beacon.id = 'dareme-visit-statistics';
    beacon.src = 'https://static.cloudflareinsights.com/beacon.min.js';
    beacon.defer = true;
    beacon.dataset.cfBeacon = JSON.stringify({ token: cloudflareToken, spa: false });
    document.head.append(beacon);
}
