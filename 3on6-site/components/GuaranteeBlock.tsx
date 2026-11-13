import Link from 'next/link'
import type { Home } from '@/lib/types'

const tick = <svg viewBox="0 0 20 20" aria-hidden="true"><path d="M4.5 10.5l3.5 3.5 7.5-8" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" /></svg>

/** The one bold navy "peak" moment on the home page. */
export default function GuaranteeBlock({ home }: { home: Home }) {
  return (
    <section className="section dark guarantee" aria-labelledby="g-h">
      <div className="wrap guarantee__grid">
        <div className="seal" aria-hidden="true">
          <svg viewBox="0 0 200 200"><defs><path id="ring" d="M100 100m-78 0a78 78 0 1 1 156 0a78 78 0 1 1-156 0" /></defs>
            <circle cx="100" cy="100" r="96" fill="none" stroke="currentColor" strokeWidth="2" opacity=".35" />
            <text><textPath href="#ring" startOffset="0">LIMITED LIFETIME GUARANTEE · LIMITED LIFETIME GUARANTEE ·</textPath></text>
          </svg>
          <span>3<small>on</small>6</span>
        </div>
        <div data-in>
          <p className="eyebrow">Peace of mind built in</p>
          <h2 className="display display--lg" id="g-h">{home.guaranteeHeading}</h2>
          <p className="lede">{home.guaranteeLede}</p>
          <ul className="covered">{home.guaranteePoints?.map((p) => <li key={p}>{tick}<span>{p}</span></li>)}</ul>
          <p className="fine">{home.guaranteeFine}</p>
          <Link className="btn btn--yellow" href="/guarantee">See what’s covered</Link>
        </div>
      </div>
    </section>
  )
}
