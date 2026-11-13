import type { Metadata } from 'next'
import PageHero from '@/components/PageHero'
import ProviderFinder from '@/components/ProviderFinder'
import ConsultSection from '@/components/ConsultSection'
import { getProviders } from '@/lib/data'
import { toMap } from '@/lib/project'
import { TIER_LABEL, TIER_NOTE, TIER_ORDER } from '@/lib/providers'

export const revalidate = 60
export const metadata: Metadata = {
  title: 'Find a 3 on 6 Provider',
  description: 'Looking for an authorized 3 on 6 provider nearby? Find a trained, licensed dentist near you to restore your smile with 3 on 6 dental implants.',
  alternates: { canonical: '/providers' },
}

export default async function Providers() {
  const providers = (await getProviders()).map((p) => ({ ...p, xy: toMap(p.lat, p.lng) }))
  const states = new Set(providers.filter((p) => p.state !== 'BC').map((p) => p.state)).size
  return (
    <>
      <PageHero eyebrow="Find a provider" title="Find a 3 on 6 provider near you."
        intro={`${providers.length} trained and licensed offices across ${states} states and Canada. Search your city, or let us sort them by distance.`}
        actions={null} />
      <section className="section finder-sec" aria-label="Provider finder">
        <div className="wrap"><ProviderFinder providers={providers} /></div>
      </section>
      <section className="section tint" aria-labelledby="tiers-h">
        <div className="wrap tiers">
          <div data-in>
            <h2 className="display display--lg" id="tiers-h">What the tiers mean.</h2>
            <p className="body">All 3 on 6™ providers are fully trained and licensed. Tiers reflect their experience with 3 on 6 treatment: Preferred (Platinum, Gold, Silver, Bronze) have completed the most cases, followed by Licensed Providers. Smile Systems provides continuing education for every provider each year to keep them current on the latest protocols and technology.</p>
            <p className="body">New Providers have completed the training but not yet the number of cases required to be listed as an independent licensed provider. They are authorized to perform 3 on 6 surgeries and receive direct support from Smile Systems until certified to treat without assistance.</p>
          </div>
          <ul className="tier-list" data-in>
            {TIER_ORDER.map((t) => <li key={t}><span className={`tier tier--${t.toLowerCase()}`}><span className="tier__dot" aria-hidden="true" />{TIER_LABEL[t]}</span><span>{TIER_NOTE[t]}</span><b>{providers.filter((p) => p.tier === t).length}</b></li>)}
          </ul>
        </div>
      </section>
      <ConsultSection heading="Not sure which office? We’ll help." />
    </>
  )
}
