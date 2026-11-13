import Link from 'next/link'
import PageHero from '@/components/PageHero'
import SmileFrames from '@/components/SmileFrames'
import ConsultSection from '@/components/ConsultSection'
import { getBeforeAfters } from '@/lib/data'

export const metadata = {
  title: 'Before and After 3 on 6 Dental Implants',
  description: 'Real 3 on 6 patients before and after full-mouth dental implants. No bulky fake gums, so we show retracted photos.',
  alternates: { canonical: '/before-and-after' },
}
export const revalidate = 60

export default async function BA() {
  const items = await getBeforeAfters()
  return (
    <>
      <PageHero eyebrow="Real patients" title="Before and after 3 on 6 dental implants."
        intro="Unlike other full-arch implant solutions, our patients don’t need bulky fake gums. That’s why we show retracted photos: we have nothing to hide."
        actions={<><a className="btn btn--yellow" href="#peak">See the results</a><Link className="btn btn--ghost-light" href="/patient-stories">Watch patient stories</Link></>} />
      <SmileFrames items={items} heading="A smile changes lives." intro="Our patients start dating again, ask for raises at work, and laugh with their grandkids. Tap any photo to compare." />
      <ConsultSection />
    </>
  )
}
