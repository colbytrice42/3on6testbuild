import Link from 'next/link'
import PageHero from '@/components/PageHero'
import ConsultSection from '@/components/ConsultSection'

export const metadata = {
  title: '3 on 6 vs Alternatives',
  description: 'Dentures, overdentures, All-on-4 and 3 on 6 compared side by side on cost, warranty, function, diet, maintenance and long-term health.',
  alternates: { canonical: '/3on6-vs-alternatives' },
}

/* Ratings out of 5, read from the star images on 3on6.com/3on6-vs-alternatives. */
const COLS = ['Denture', 'Overdenture', 'All-on-4', '3 on 6'] as const
const ROWS: [string, number[]][] = [
  ['Upfront cost', [4, 3, 2, 2]],
  ['Lifetime cost', [2, 1.5, 1.5, 4.5]],
  ['Warranty', [0.5, 0.5, 0.5, 4.5]],
  ['Natural function', [1, 1.5, 4, 5]],
  ['Dietary freedom', [1, 1.5, 4.5, 5]],
  ['Maintenance', [0.5, 0.5, 3.5, 4.5]],
  ['Long-term health', [0.5, 1, 2, 4.5]],
]
function Stars({ n, k }: { n: number; k: string }) {
  return (
    <span className="stars" role="img" aria-label={`${n} out of 5`}>
      {[0, 1, 2, 3, 4].map((i) => {
        const fill = Math.max(0, Math.min(1, n - i)), gid = `s-${k}-${i}`
        return <svg key={i} viewBox="0 0 20 20" aria-hidden="true"><defs><linearGradient id={gid}><stop offset={fill} stopColor="currentColor" /><stop offset={fill} stopColor="currentColor" stopOpacity=".18" /></linearGradient></defs><path d="M10 1.8l2.5 5.3 5.8.7-4.3 4 1.1 5.8L10 14.8 4.9 17.6 6 11.8 1.7 7.8l5.8-.7z" fill={`url(#${gid})`} /></svg>
      })}
    </span>
  )
}

const OPTIONS = [
  { name: 'Denture', img: null, text: 'Dentures remain a last-resort option for most patients. Their appeal is a lower upfront cost, or use where a patient has already lost significant bone. But they often bring new problems: difficulty eating and speaking, sore spots, gagging from their bulk, and adhesives as the jawbone shrinks and the face changes shape. Many patients find them so uncomfortable they stop wearing them. Dental professionals recommend dentures only when permanent options such as implants aren’t possible.' },
  { name: 'Overdenture', img: null, text: 'Overdentures (snap-on or implant-supported dentures) look like dentures but snap onto 2 to 4 implants. They’re more stable, but don’t do much for food choices, sore spots, gagging or speech. The implants slow bone loss where they sit, while the rest of the jaw keeps shrinking. Maintenance is close to regular dentures, and the attachments wear and need replacing.' },
  { name: 'All-on-4', href: '/post/all-on-4-dental-implants-steps-benefits-issues', text: 'The All-on-4 (also called All-on-X) is a single full-arch prosthesis, usually acrylic or zirconia, attached semi-permanently to four or more implants. Patients can eat, speak and smile with confidence and enjoy a wider diet than with removable options. But the bridge often needs to be removed by a dentist for costly deep cleanings, food can get trapped beneath it, and dentists often remove healthy bone to fit it: a permanent change that can limit future options if it ever fails.' },
  { name: '3 on 6', href: '/what-is-3-on-6', text: 'The 3 on 6™ uses six implants to support three permanent bridges, so it looks, feels and works like natural teeth. There are no bulky acrylic gums, healthy bone is preserved throughout the jaw, and the bridges never come out for cleaning, so lifetime cost is lower and care is simple: brush and floss like normal teeth. No removable parts, no food restrictions, and many providers include a limited lifetime guarantee.' },
]

export default function Alternatives() {
  return (
    <>
      <PageHero eyebrow="Knowledge Hub" title="3 on 6 versus the alternatives."
        intro="Patients have more options than ever, from dentures and overdentures to fixed solutions like All-on-4. Not all of them deliver the same comfort, function or long-term health."
        image="/img/wix/render-two-options.png" />
      <section className="section">
        <div className="wrap">
          <h2 className="display display--lg" data-in>Rated side by side.</h2>
          <div className="rate-wrap" data-in>
            <table className="rate">
              <caption className="sr-only">Ratings out of five for four tooth replacement options</caption>
              <thead><tr><th scope="col"><span className="sr-only">Factor</span></th>{COLS.map((c) => <th scope="col" key={c} className={c === '3 on 6' ? 'us' : ''}>{c}</th>)}</tr></thead>
              <tbody>{ROWS.map(([label, vals]) => <tr key={label}><th scope="row">{label}</th>{vals.map((v, i) => <td key={i} className={i === 3 ? 'us' : ''}><Stars n={v} k={`${label.replace(/\W+/g, '')}-${i}`} /></td>)}</tr>)}</tbody>
            </table>
          </div>
          <p className="fine">Ratings reflect 3 on 6’s comparison of typical outcomes. Your provider can explain how each option applies to you.</p>
        </div>
      </section>
      <section className="section tint">
        <div className="wrap options" data-stagger="60" data-in>
          {OPTIONS.map((o) => (
            <article key={o.name} className={`option${o.name === '3 on 6' ? ' option--us' : ''}`}>
              <h2 className="display display--md">{o.href ? <Link href={o.href}>{o.name}</Link> : o.name}</h2>
              <p>{o.text}</p>
            </article>
          ))}
        </div>
      </section>
      <ConsultSection heading="Schedule your free consultation." />
    </>
  )
}
