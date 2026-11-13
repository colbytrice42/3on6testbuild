import Header from '@/components/Header'
import Footer from '@/components/Footer'
import Reveal from '@/components/Reveal'
import Analytics from '@/components/Analytics'
import HighLevelTracking from '@/components/HighLevelTracking'
import { ConsultProvider, type ProviderLite } from '@/components/ConsultContext'
import { getProviders, getSettings } from '@/lib/data'

export default async function SiteLayout({ children }: { children: React.ReactNode }) {
  const [settings, providers] = await Promise.all([getSettings(), getProviders()])
  const lite: ProviderLite[] = providers.map((p) => ({ slug: p.slug, name: p.name, tier: p.tier, doctors: p.doctors, city: p.city, state: p.state, phoneDisplay: p.phoneDisplay, phoneE164: p.phoneE164, website: p.website, lat: p.lat, lng: p.lng }))
  const site = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.3on6.com'
  const ld = {
    '@context': 'https://schema.org', '@type': 'Organization', name: '3 on 6', url: site, email: settings.email,
    sameAs: settings.social?.map((s) => s.url),
  }
  return (
    <ConsultProvider providers={lite}>
      <Header settings={settings} />
      <main id="top">{children}</main>
      <Footer settings={settings} />
      <Reveal />
      <Analytics />
      <HighLevelTracking />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(ld) }} />
    </ConsultProvider>
  )
}
