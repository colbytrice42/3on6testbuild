'use client'
/**
 * Marketing attribution + conversion events.
 * - Attribution (UTMs, ad click IDs, landing page, referrer) is captured on the first page view and kept
 *   so it survives clicking around before booking. It contains no personal data.
 * - Events go to GA4 / Google Ads / Meta only when their IDs are set in Vercel (NEXT_PUBLIC_*).
 * - Events NEVER include the visitor's answers, name, phone or email — only that a step/lead happened.
 */
const KEY = 'p3-attribution'
const PARAMS = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content', 'gclid', 'gbraid', 'wbraid', 'fbclid', 'msclkid'] as const

export type Attribution = Partial<Record<(typeof PARAMS)[number], string>> & {
  landing_page?: string; referrer?: string; first_seen?: string; last_touch?: Partial<Record<string, string>>
}

export function captureAttribution() {
  try {
    const url = new URL(location.href)
    const fromUrl: Record<string, string> = {}
    PARAMS.forEach((p) => { const v = url.searchParams.get(p); if (v) fromUrl[p] = v.slice(0, 200) })
    const saved: Attribution = JSON.parse(localStorage.getItem(KEY) || 'null') || {}
    if (!saved.first_seen) {
      // First touch: keep the very first source we saw.
      Object.assign(saved, fromUrl, {
        landing_page: url.pathname + url.search,
        referrer: document.referrer && !document.referrer.startsWith(location.origin) ? document.referrer.slice(0, 300) : '',
        first_seen: new Date().toISOString(),
      })
    } else if (Object.keys(fromUrl).length) {
      // A later ad click: record it as the last touch, keep the first touch intact.
      saved.last_touch = { ...fromUrl, page: url.pathname, at: new Date().toISOString() }
    }
    localStorage.setItem(KEY, JSON.stringify(saved))
  } catch {}
}
export function getAttribution(): Attribution {
  try { return JSON.parse(localStorage.getItem(KEY) || '{}') } catch { return {} }
}

declare global { interface Window { gtag?: (...a: any[]) => void; fbq?: (...a: any[]) => void } }
const GA4 = process.env.NEXT_PUBLIC_GA4_ID
const ADS_SEND_TO = process.env.NEXT_PUBLIC_GOOGLE_ADS_CONVERSION // e.g. AW-123456789/AbCdEfGh

/** Funnel step events (GA4 only): form_start, form_step, form_submit_error. No answer values. */
export function trackStep(name: 'form_start' | 'form_step' | 'form_submit_error', params: Record<string, string | number> = {}) {
  try { if (GA4) window.gtag?.('event', name, params) } catch {}
}
/** The conversion. Paid Meta leads arrive via instant forms and paid Google has its own landing pages,
 *  so these mainly power GA4 reporting and retargeting audiences for organic/social visitors. */
export function trackLead(eventId: string, provider: string) {
  try {
    if (GA4) window.gtag?.('event', 'generate_lead', { provider, form: "free_consultation" })
    if (ADS_SEND_TO) window.gtag?.('event', 'conversion', { send_to: ADS_SEND_TO, transaction_id: eventId })
    window.fbq?.('track', 'Lead', {}, { eventID: eventId })
  } catch {}
}
export function cookie(name: string) {
  const m = typeof document !== 'undefined' ? document.cookie.match(new RegExp(`(?:^|; )${name}=([^;]+)`)) : null
  return m ? decodeURIComponent(m[1]) : ''
}
export const newEventId = () => (crypto?.randomUUID?.() ?? `${Date.now()}-${Math.random().toString(36).slice(2)}`)
