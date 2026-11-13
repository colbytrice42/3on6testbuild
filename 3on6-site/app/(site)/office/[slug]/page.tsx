import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import PageHero from '@/components/PageHero'
import StoriesRail from '@/components/StoriesRail'
import ConsultSection from '@/components/ConsultSection'
import TierBadge from '@/components/TierBadge'
import UsMap from '@/components/UsMap'
import { getAllProviders, getProvider, getProviders, getTestimonials } from '@/lib/data'
import { TIER_LABEL, TIER_NOTE, byDistance, miles } from '@/lib/providers'
import { toMap } from '@/lib/project'

export const revalidate = 60
type P = { params: Promise<{ slug: string }> }

export async function generateStaticParams() {
  return (await getAllProviders()).map((p) => ({ slug: p.slug }))
}
export async function generateMetadata({ params }: P): Promise<Metadata> {
  const p = await getProvider((await params).slug)
  if (!p) return {}
  return {
    title: p.seo?.title || `${p.name} · 3 on 6 Dental Implants in ${p.city}, ${p.state}`,
    description: p.seo?.description || `${p.doctors.join(' and ')} at ${p.name} in ${p.city}, ${p.state} is a ${TIER_LABEL[p.tier]} for 3 on 6 full-mouth dental implants. Request a free consultation.`,
    robots: p.active === false ? { index: false } : undefined,
    alternates: { canonical: `/office/${p.slug}` },
  }
}

export default async function Office({ params }: P) {
  const p = await getProvider((await params).slug)
  if (!p) notFound()
  const [all, stories] = await Promise.all([getProviders(), getTestimonials()])
  const nearby = p.lat != null ? byDistance(all.filter((x) => x.slug !== p.slug), p.lat, p.lng!).slice(0, 3) : []
  const address = [p.street, `${p.city}, ${p.state} ${p.zip || ''}`.trim()].filter(Boolean).join(', ')
  const maps = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${p.name}, ${address}`)}`
  const ld = {
    '@context': 'https://schema.org', '@type': 'Dentist', name: p.name, telephone: p.phoneDisplay, url: p.website,
    address: { '@type': 'PostalAddress', streetAddress: p.street, addressLocality: p.city, addressRegion: p.state, postalCode: p.zip, addressCountry: p.state === 'BC' ? 'CA' : 'US' },
    ...(p.lat != null ? { geo: { '@type': 'GeoCoordinates', latitude: p.lat, longitude: p.lng } } : {}),
    employee: p.doctors.map((d) => ({ '@type': 'Person', name: d })),
  }
  return (
    <>
      <PageHero eyebrow={`3 on 6 provider · ${p.city}, ${p.state}`} title={p.name}
        intro={p.intro || `${p.doctors.join(' and ')} ${p.doctors.length > 1 ? 'offer' : 'offers'} 3 on 6 full-mouth dental implants in ${p.city}. Six implants, three bridges, and no fake gums.`}
        crumbs={[{ label: 'Find a provider', href: '/providers' }]} booking={`office-${p.slug}`} provider={p.slug} />
      <section className="section office" aria-label="Office details">
        <div className="wrap office__grid">
          <div className="card office__card" data-in>
            <TierBadge tier={p.tier} />
            <p className="office__tier">{TIER_NOTE[p.tier]}</p>
            <dl className="pp__dl">
              <dt>{p.doctors.length > 1 ? 'Doctors' : 'Doctor'}</dt><dd>{p.doctors.join(' and ')}</dd>
              <dt>Address</dt><dd>{address}<br /><a className="link" href={maps} target="_blank" rel="noopener">Get directions</a></dd>
              {p.phoneDisplay && <><dt>Phone</dt><dd><a href={`tel:${p.phoneE164}`}>{p.phoneDisplay}</a></dd></>}
              {p.website && <><dt>Website</dt><dd><a className="link" href={p.website} target="_blank" rel="noopener">{p.website.replace(/^https?:\/\/(www\.)?/, '').replace(/\/$/, '')}</a></dd></>}
            </dl>
          </div>
          <div className="office__map" data-in>
            <UsMap providers={[{ ...p, xy: toMap(p.lat, p.lng) }]} active={p.slug} />
            {nearby.length > 0 && (
              <div className="office__near">
                <h2 className="display display--sm">Other providers nearby</h2>
                <ul>{nearby.map(({ p: n, d }) => <li key={n.slug}><Link href={`/office/${n.slug}`}>{n.name}</Link><span>{n.city}, {n.state} · {miles(d)} mi</span></li>)}</ul>
              </div>
            )}
          </div>
        </div>
      </section>
      <StoriesRail heading="They were where you are." intro="Real 3 on 6 patients, in their own words." items={stories} />
      <ConsultSection provider={p.slug} heading={`Start with a free consultation in ${p.city}.`} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(ld) }} />
    </>
  )
}
