import Link from 'next/link'
import type { Home } from '@/lib/types'

const yes = <svg viewBox="0 0 20 20" aria-hidden="true"><path d="M4.5 10.5l3.5 3.5 7.5-8" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" /></svg>
const no = <svg viewBox="0 0 20 20" aria-hidden="true"><path d="M5.5 5.5l9 9M14.5 5.5l-9 9" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" /></svg>

/** "The difference is clear": All-on-4 and 3 on 6 side by side, the same three rows on each. */
export default function CompareSplit({ home }: { home: Home }) {
  const rows = home.compareRows ?? []
  return (
    <section className="section split-sec" aria-labelledby="cmp-h">
      <div className="wrap">
        <h2 className="display display--lg center" id="cmp-h" data-in>{home.compareHeading}</h2>
        <div className="split" data-in>
          <div className="split__col split__col--them">
            <h3>All-on-4</h3>
            <img src="/img/compare-allonx.png" width={1200} height={919} alt="An All-on-4 arch: one bridge with a pink acrylic gum base on four implants" loading="lazy" />
            <ul>{rows.map((r) => <li key={r.label}>{no}<span><b>{r.label}</b>{r.theirs}</span></li>)}</ul>
          </div>
          <div className="split__vs" aria-hidden="true">vs</div>
          <div className="split__col split__col--us">
            <h3>3 on 6</h3>
            <img src="/img/compare-3on6.png" width={1200} height={919} alt="A 3 on 6 arch: three zirconia bridges on six implants, with no denture base" loading="lazy" />
            <ul>{rows.map((r) => <li key={r.label}>{yes}<span><b>{r.label}</b>{r.ours}</span></li>)}</ul>
          </div>
        </div>
        <div className="actions center" data-in>
          <Link className="btn" href="/providers">Find a 3 on 6 provider near you</Link>
          <Link className="btn btn--ghost" href="/3on6-vs-alternatives">3 on 6 vs every alternative</Link>
        </div>
      </div>
    </section>
  )
}
