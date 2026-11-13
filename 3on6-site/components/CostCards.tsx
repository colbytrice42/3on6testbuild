import Link from 'next/link'
import type { Home } from '@/lib/types'

export default function CostCards({ home }: { home: Home }) {
  const rows = home.costRows ?? []
  return (
    <section className="section cost tint" aria-labelledby="cost-h">
      <div className="wrap cost__grid">
        <div data-in>
          <p className="eyebrow">Dental implant costs</p>
          <h2 className="display display--lg" id="cost-h">{home.costHeading}</h2>
          <p className="body">{home.costIntro}</p>
          <Link className="link" href="/post/comparing-10-year-costs-of-dental-maintenance-dentures-all-on-4-3-on-6-and-natural-teeth">How we worked out the 10-year costs →</Link>
        </div>
        <div className="cost__table" data-in>
          <table>
            <caption className="sr-only">Typical costs, All-on-4 compared with 3 on 6</caption>
            <thead><tr><th scope="col"><span className="sr-only">Cost</span></th><th scope="col">All-on-4</th><th scope="col" className="us">3 on 6</th></tr></thead>
            <tbody>{rows.map((r) => <tr key={r.label}><th scope="row">{r.label}</th><td>{r.allOn4}</td><td className="us">{r.threeOn6}</td></tr>)}</tbody>
          </table>
          <p className="fine">{home.costFine}</p>
        </div>
      </div>
    </section>
  )
}
