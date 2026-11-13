import Link from 'next/link'
import Hero from '@/components/Hero'
import CompareSplit from '@/components/CompareSplit'
import StoriesRail from '@/components/StoriesRail'
import CostCards from '@/components/CostCards'
import SmileFrames from '@/components/SmileFrames'
import GuaranteeBlock from '@/components/GuaranteeBlock'
import ConsultSection from '@/components/ConsultSection'
import { getHome } from '@/lib/data'

export const revalidate = 60

export default async function Home() {
  const home = await getHome()
  return (
    <>
      <Hero home={home} />
      <CompareSplit home={home} />
      <StoriesRail heading={home.storiesHeading} intro={home.storiesIntro} items={home.testimonials ?? []} />
      <CostCards home={home} />
      <SmileFrames items={home.beforeAfters ?? []} heading={home.beforeAfterHeading} intro={home.beforeAfterIntro} />

      <section className="section process" aria-labelledby="process-h">
        <div className="wrap">
          <div className="process__head" data-in>
            <p className="eyebrow">The 3 on 6 process</p>
            <h2 className="display display--lg" id="process-h">Three steps to your new smile.</h2>
          </div>
          <ol className="steps" data-stagger="80" data-in>
            {home.steps?.map((s, i) => <li key={s.title}><span className="steps__n">{i + 1}</span><h3>{s.title}</h3><p>{s.text}</p></li>)}
          </ol>
          <div className="actions" data-in>
            <a className="btn btn--ghost" href="https://youtu.be/UrcWg1Qvnh4" target="_blank" rel="noopener">Watch the full process</a>
          </div>
        </div>
      </section>

      <section className="section bone tint" aria-labelledby="bone-h">
        <div className="wrap bone__grid">
          <figure data-in><img src="/img/wix/render-two-options.png" width={800} height={573} alt="An All-on-4 arch on a pink acrylic base beside a 3 on 6 arch of three bridges on six implants" loading="lazy" /></figure>
          <div data-in>
            <h2 className="display display--lg" id="bone-h">{home.boneHeading}</h2>
            <p className="body">{home.boneBody}</p>
            <Link className="link" href="/post/benefits-of-segmented-bridges-in-reversing-bone-loss">Learn more about bone health →</Link>
          </div>
        </div>
      </section>

      <GuaranteeBlock home={home} />
      <ConsultSection />
    </>
  )
}
