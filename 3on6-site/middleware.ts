import { NextResponse, type NextRequest } from 'next/server'
import { providers } from '@/content/providers'
import { PROVIDER_COOKIE, PROVIDER_SRC_COOKIE, cleanSlug, nearestProvider } from '@/lib/providers'

/**
 * 1. Keeps old Wix office URLs working: /office/smile-clinic-(utah) → /office/smile-clinic-utah (308).
 * 2. Picks the visitor's provider for the booking form and "your nearest provider" blocks. Only the slug is
 *    stored, never the visitor's location.
 *      Chosen: opening a provider's page (/office/<slug>) or a ?provider= link sets it, and it sticks.
 *      Otherwise: guessed from Vercel's IP geolocation on every visit, so a wrong guess never sticks.
 */
const MONTH = 60 * 60 * 24 * 30
const SLUGS = new Set(providers.map((p) => p.slug))
const LEGACY = new Map(providers.map((p) => [cleanSlug(p.wixSlug || p.slug), p.slug]))

export function middleware(req: NextRequest) {
  const path = req.nextUrl.pathname
  const office = /^\/office\/([^/]+)\/?$/.exec(path)?.[1]
  if (office && !SLUGS.has(office)) {
    const to = LEGACY.get(cleanSlug(office)) || (SLUGS.has(cleanSlug(office)) ? cleanSlug(office) : '')
    if (to) { const u = req.nextUrl.clone(); u.pathname = `/office/${to}`; return NextResponse.redirect(u, 308) }
  }

  const res = NextResponse.next()
  // Background loads (prefetches, in-app navigations) never change the provider; only a real page open does.
  const h = req.headers, dest = h.get('sec-fetch-dest')
  if (h.get('next-url') || h.get('rsc') || (dest && dest !== 'document')) return res

  const current = req.cookies.get(PROVIDER_COOKIE)?.value
  const chosenBefore = req.cookies.get(PROVIDER_SRC_COOKIE)?.value === 'chosen'
  const fromLink = req.nextUrl.searchParams.get('provider') || ''
  const chosen = (office && SLUGS.has(office) ? office : '') || (SLUGS.has(fromLink) ? fromLink : '')

  let slug = current || '', src = chosenBefore ? 'chosen' : 'geo'
  if (chosen) { slug = chosen; src = 'chosen' }
  else if (!chosenBefore || !current || !SLUGS.has(current)) {
    const lat = parseFloat(h.get('x-vercel-ip-latitude') || ''), lng = parseFloat(h.get('x-vercel-ip-longitude') || '')
    const country = h.get('x-vercel-ip-country') || ''
    const region = country === 'US' || country === 'CA' ? h.get('x-vercel-ip-country-region') || undefined : undefined
    slug = nearestProvider(providers, lat, lng, region); src = 'geo'
  }
  if (slug && slug !== current) res.cookies.set(PROVIDER_COOKIE, slug, { path: '/', maxAge: MONTH, sameSite: 'lax' })
  if ((src === 'chosen') !== chosenBefore) res.cookies.set(PROVIDER_SRC_COOKIE, src, { path: '/', maxAge: MONTH, sameSite: 'lax' })
  return res
}
export const config = { matcher: ['/((?!_next|api|studio|img|favicon|robots.txt|sitemap.xml).*)'] }
