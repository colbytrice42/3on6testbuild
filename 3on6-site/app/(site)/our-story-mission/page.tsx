import Link from 'next/link'
import PageHero from '@/components/PageHero'

export const metadata = { title: 'Our Story & Mission', description: 'Why Dr. Randy Roberts created the 3 on 6, and how Smile Systems trains dentists across the country to offer it.', alternates: { canonical: '/our-story-mission' } }

const TIMELINE = [
  ['2011', 'Dr. Randy Roberts graduates from NYU Dental School and, with the help of his brother John, starts Smile Clinic in Taylorsville, Utah.'],
  ['2013', 'Research and development on the 3 on 6™ begins after Dr. Roberts’ cousin comes to him with an All-on-4 treatment plan, looking for a better option.'],
  ['2014', 'On January 28th, Dr. Roberts’ birthday, he places the first 3 on 6™ on his cousin at Smile Clinic in Utah. The procedure is a major success.'],
  ['2017', 'Dr. Roberts explains the 3 on 6 in a television interview at a public health convention.'],
  ['2019', 'After years of perfecting the 3 on 6™, Smile Systems begins training and licensing dentists across the country to offer it.'],
  ['2023', 'Dr. Randy Roberts trains dentists in the 3 on 6 protocols.'],
  ['2025', 'Dentists are trained all over the country in 3 on 6.'],
]

export default function Story() {
  return (
    <>
      <PageHero eyebrow="It began with a simple question" title="Why are dentists destroying healthy bone and gums?" image="/img/wix/dr-randy-roberts.jpg" actions={null} />
      <section className="section">
        <div className="wrap">
          <h2 className="display display--lg" data-in>The history of a revolution.</h2>
          <ol className="timeline" data-stagger="70" data-in>
            {TIMELINE.map(([y, t]) => <li key={y}><span className="timeline__y">{y}</span><p>{t}</p></li>)}
          </ol>
        </div>
      </section>
      <section className="section tint">
        <div className="wrap wrap--text" data-in>
          <h2 className="display display--lg">How 3 on 6 is different, and why it matters.</h2>
          <div className="prose">
            <p>In the late 1990s, the All-on-4 gained worldwide attention for replacing an entire set of teeth with just four implants. For patients living with dentures or severe dental problems it seemed revolutionary, and it quickly became the go-to full-arch restoration.</p>
            <p>As the years passed, drawbacks surfaced. To make room for the prosthetic, healthy bone and gum tissue were often removed, permanently changing the mouth’s structure. The result relied on artificial gum material to replace what had been lost, sometimes leaving a less natural look and feel, and the bulky design made cleaning harder.</p>
            <p>The 3 on 6™ was created to solve those problems. Instead of removing healthy tissue, it preserves your natural bone and gums for a smile that is fully fixed, natural-looking and easier to maintain. Three individual bridges on six implants give patients the security they loved about All-on-4, with better health, aesthetics and long-term comfort.</p>
          </div>
        </div>
      </section>
      <section className="section dark mission">
        <div className="wrap wrap--text center" data-in>
          <p className="eyebrow">Our mission</p>
          <p className="mission__text">To restore confidence by delivering the healthiest, most natural dental restorations possible, designed to preserve your smile, your health and your quality of life.</p>
          <blockquote className="mission__quote">“There’s nothing more in life that I want than to have my natural gum line and not deal with the clunkiness of a denture.”<cite>Melissa B.</cite></blockquote>
          <div className="actions center"><Link className="btn btn--yellow" href="/providers">Find a 3 on 6 provider</Link></div>
        </div>
      </section>
    </>
  )
}
