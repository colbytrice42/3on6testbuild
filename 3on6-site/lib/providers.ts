import type { Provider, Tier } from './types'

/** Cookie holding the visitor's provider: the slug only, never their location. */
export const PROVIDER_COOKIE = 'p3-provider'
/** "chosen" once the visitor picks a provider (opens its page, or picks one in the form). Otherwise "geo". */
export const PROVIDER_SRC_COOKIE = 'p3-provider-src'

export const TIER_ORDER: Tier[] = ['Platinum', 'Gold', 'Silver', 'Bronze', 'Licensed', 'New']
export const TIER_LABEL: Record<Tier, string> = {
  Platinum: 'Platinum Preferred', Gold: 'Gold Preferred', Silver: 'Silver Preferred', Bronze: 'Bronze Preferred',
  Licensed: 'Licensed Provider', New: 'New Provider',
}
export const TIER_NOTE: Record<Tier, string> = {
  Platinum: 'Most 3 on 6 cases completed', Gold: 'Preferred: extensive 3 on 6 experience', Silver: 'Preferred: proven 3 on 6 experience',
  Bronze: 'Preferred provider', Licensed: 'Fully trained and licensed', New: 'Trained; cases supported by Smile Systems',
}

export function km(lat1: number, lon1: number, lat2: number, lon2: number) {
  const r = (x: number) => (x * Math.PI) / 180
  const dLat = r(lat2 - lat1), dLon = r(lon2 - lon1)
  const h = Math.sin(dLat / 2) ** 2 + Math.cos(r(lat1)) * Math.cos(r(lat2)) * Math.sin(dLon / 2) ** 2
  return 2 * 6371 * Math.asin(Math.sqrt(h))
}
export const miles = (k: number) => Math.round(k * 0.621371)

/** Providers sorted by distance; ties (same city) go to the higher tier. */
export function byDistance(list: Provider[], lat: number, lng: number) {
  return list
    .filter((p) => p.lat != null && p.lng != null)
    .map((p) => ({ p, d: km(lat, lng, p.lat!, p.lng!) }))
    .sort((a, b) => a.d - b.d || TIER_ORDER.indexOf(a.p.tier) - TIER_ORDER.indexOf(b.p.tier))
}

/** Nearest provider for a visitor: same-state providers first (IP coordinates can point at a carrier hub
 *  in a neighbouring state), then straight distance. Returns '' when there's no usable location. */
export function nearestProvider(list: Provider[], lat?: number, lng?: number, region?: string): string {
  const okCoords = lat != null && lng != null && Number.isFinite(lat) && Number.isFinite(lng)
  const r = region?.toUpperCase()
  const inState = r ? list.filter((p) => p.state === r) : []
  if (okCoords) return byDistance(inState.length ? inState : list, lat!, lng!)[0]?.p.slug || ''
  if (inState.length) return [...inState].sort((a, b) => TIER_ORDER.indexOf(a.tier) - TIER_ORDER.indexOf(b.tier))[0].slug
  return ''
}

/** Old Wix office URLs → new slugs. `/office/smile-clinic-(utah)` → `/office/smile-clinic-utah`. */
export function cleanSlug(s: string) {
  let v = s
  try { v = decodeURIComponent(s) } catch {}
  return v.toLowerCase().replace(/&/g, '').replace(/[()]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
}
