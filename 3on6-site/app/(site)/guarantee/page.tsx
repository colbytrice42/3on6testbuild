import PageHero from '@/components/PageHero'
import ConsultSection from '@/components/ConsultSection'

export const metadata = {
  title: 'Guarantee',
  description: 'Get a limited lifetime guarantee on your 3 on 6 dental implants with participating providers.',
  alternates: { canonical: '/guarantee' },
}

const FIRST_YEAR = [
  ['Free implant replacement', 'If an implant fails within the first year, it’s replaced for free.'],
  ['Free bridge replacement', 'If a bridge breaks within the first year, it’s replaced for free.'],
]
const LIFETIME = [
  ['Free implant replacement', 'If no osseointegration has occurred, the implant is replaced for free.'],
  ['Free implant replacement after integration', 'If an implant fails after osseointegration, it’s replaced for free (parts, not labor).'],
  ['Free bridge reattachment', 'If a bridge becomes loose or disconnected, it’s reattached for free.'],
  ['Free bite adjustments', 'If you need a bite adjustment with a handpiece, it’s done for free.'],
  ['Discounted bridges', 'If you want to replace a bridge for any reason, the cost is discounted.'],
]
const tick = <svg viewBox="0 0 20 20" aria-hidden="true"><path d="M4.5 10.5l3.5 3.5 7.5-8" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" /></svg>

export default function Guarantee() {
  return (
    <>
      <PageHero eyebrow="3 on 6™ Limited Lifetime Guarantee" title="Peace of mind, built into every smile."
        intro="Your smile is a lifelong investment, and participating providers stand behind it." actions={null} />
      <section className="section">
        <div className="wrap">
          <div className="g-cols">
            <div className="g-col" data-in>
              <p className="eyebrow">First year</p>
              <ul className="g-list">{FIRST_YEAR.map(([h, t]) => <li key={h}>{tick}<div><h3>{h}</h3><p>{t}</p></div></li>)}</ul>
            </div>
            <div className="g-col g-col--life" data-in>
              <p className="eyebrow">For life</p>
              <ul className="g-list">{LIFETIME.map(([h, t]) => <li key={h}>{tick}<div><h3>{h}</h3><p>{t}</p></div></li>)}</ul>
            </div>
          </div>
          <p className="fine g-fine" data-in>The 3 on 6™ Limited Lifetime Guarantee may be offered by 3 on 6™ providers at their discretion and is not offered or enforced by Smile Systems, 3 on 6, or its affiliates. Check with your provider to see if they offer the guarantee and for specific terms and conditions.</p>
        </div>
      </section>
      <section className="section tint">
        <div className="wrap keep" data-in>
          <h2 className="display display--lg">How to keep your guarantee.</h2>
          <ol className="steps steps--plain">
            <li><span className="steps__n">1</span><p>Attend cleaning and exam appointments every 6 months.</p></li>
            <li><span className="steps__n">2</span><p>Follow your at-home care instructions.</p></li>
            <li><span className="steps__n">3</span><p>Contact your 3 on 6™ provider promptly with any concerns about your new smile.</p></li>
          </ol>
        </div>
      </section>
      <ConsultSection heading="Ask your provider about the guarantee." />
    </>
  )
}
