/**
 * Classifies where a lead came from. Built for a site whose traffic is mostly organic + social,
 * with paid ads as bleed-over — so "no UTMs" is the normal case, not "unknown".
 *
 * Paid is only claimed with real evidence: a Google/Microsoft ad click ID, or a paid UTM medium.
 * fbclid alone is NOT treated as paid — Facebook/Instagram add it to ordinary organic post links too.
 */
export type Channel =
  | 'Paid Search' | 'Paid Social' | 'Organic Search' | 'Organic Social'
  | 'Google Business Profile' | 'Email' | 'Referral' | 'Direct'

type Touch = Partial<Record<string, string>>

const SOCIAL = /(^|\.)(facebook|fb|instagram|tiktok|youtube|youtu|linkedin|pinterest|twitter|x|threads|snapchat|reddit|nextdoor)\.|^(l|lm|m)\.facebook\.com$|^t\.co$/i
const SOCIAL_SOURCES = /^(facebook|fb|ig|instagram|meta|tiktok|tt|youtube|yt|linkedin|pinterest|twitter|x|threads|snapchat|reddit|nextdoor|social)$/i
const SEARCH = /(^|\.)(google|bing|yahoo|duckduckgo|ecosia|baidu|yandex|brave|startpage|aol|ask)\./i
const PAID_MEDIUM = /^(cpc|ppc|paid|paidsearch|paid_search|paid-search|paidsocial|paid_social|paid-social|display|cpm|cpv|retargeting|ads?)$/i
const GBP = /^(gbp|gmb|google_business_profile|google-business-profile|googlemaps|google_maps|maps)$/i

const host = (u?: string) => { try { return u ? new URL(u).hostname.replace(/^www\./, '') : '' } catch { return '' } }

export function classify(t: Touch): { channel: Channel; source: string } {
  const src = (t.utm_source || '').trim(), med = (t.utm_medium || '').trim()
  const ref = host(t.referrer)

  if (GBP.test(src) || GBP.test(med) || /^business\.google\.com$/.test(ref)) return { channel: 'Google Business Profile', source: 'google' }
  if (t.gclid || t.gbraid || t.wbraid) return { channel: 'Paid Search', source: src || 'google' }
  if (t.msclkid) return { channel: 'Paid Search', source: src || 'bing' }
  if (PAID_MEDIUM.test(med)) return { channel: SOCIAL_SOURCES.test(src) || /social/i.test(med) ? 'Paid Social' : 'Paid Search', source: src || 'unknown' }
  if (/^e-?mail$/i.test(med) || /^(newsletter|email)$/i.test(src)) return { channel: 'Email', source: src || 'email' }
  if (/social/i.test(med) || SOCIAL_SOURCES.test(src) || SOCIAL.test(ref + '.') || t.fbclid)
    return { channel: 'Organic Social', source: src || ref.split('.').slice(-2, -1)[0] || (t.fbclid ? 'facebook' : 'social') }
  if (/^organic$/i.test(med) || SEARCH.test(ref + '.')) return { channel: 'Organic Search', source: src || ref.split('.').slice(-2, -1)[0] || 'search' }
  if (ref) return { channel: 'Referral', source: src || ref }
  if (src) return { channel: 'Referral', source: src }
  return { channel: 'Direct', source: 'direct' }
}
