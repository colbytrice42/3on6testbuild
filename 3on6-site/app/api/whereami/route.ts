import { NextResponse } from 'next/server'
import { providers } from '@/content/providers'
import { PROVIDER_COOKIE, PROVIDER_SRC_COOKIE, nearestProvider } from '@/lib/providers'

/** Diagnostic: what location Vercel sees for YOUR connection and which provider that maps to.
 *  Shows the requester their own data only; nothing is stored or logged. */
export const dynamic = 'force-dynamic'
export async function GET(req: Request) {
  const h = (k: string) => req.headers.get(k) || ''
  const lat = parseFloat(h('x-vercel-ip-latitude')), lng = parseFloat(h('x-vercel-ip-longitude')), region = h('x-vercel-ip-country-region')
  const cookie = (name: string) => new RegExp(`(?:^|; )${name}=([^;]+)`).exec(h('cookie'))?.[1] || null
  return NextResponse.json({
    vercelSees: { city: decodeURIComponent(h('x-vercel-ip-city')) || null, region: region || null, country: h('x-vercel-ip-country') || null,
      latitude: Number.isFinite(lat) ? lat : null, longitude: Number.isFinite(lng) ? lng : null },
    providerFromLocation: nearestProvider(providers, lat, lng, region || undefined) || null,
    providerInUse: cookie(PROVIDER_COOKIE), howItWasSet: cookie(PROVIDER_SRC_COOKIE) === 'chosen' ? 'chosen (provider page, ?provider= link, or picked in the form)' : 'guessed from location',
  }, { headers: { 'cache-control': 'no-store' } })
}
